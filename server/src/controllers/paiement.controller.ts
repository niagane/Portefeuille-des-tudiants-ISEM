import { Request, Response } from 'express';
import prisma from '../prisma';

const PAYDUNYA_BASE_URL = process.env.PAYDUNYA_BASE_URL || 'https://app.paydunya.com';
const PAYDUNYA_API_PREFIX = process.env.PAYDUNYA_API_PREFIX || '';

const isTestMode = () => (process.env.PAYDUNYA_PUBLIC_KEY || '').startsWith('test_');
const apiPrefix = () => (PAYDUNYA_API_PREFIX ? PAYDUNYA_API_PREFIX : isTestMode() ? '/sandbox-api/v1' : '/api/v1');

const paydunyaHeaders = () => ({
  'Content-Type': 'application/json',
  'PAYDUNYA-MASTER-KEY': process.env.PAYDUNYA_MASTER_KEY || '',
  'PAYDUNYA-PRIVATE-KEY': process.env.PAYDUNYA_PRIVATE_KEY || '',
  'PAYDUNYA-PUBLIC-KEY': process.env.PAYDUNYA_PUBLIC_KEY || '',
  'PAYDUNYA-TOKEN': process.env.PAYDUNYA_TOKEN || ''
});

const ensurePaydunyaConfig = () => {
  const required = [
    process.env.PAYDUNYA_MASTER_KEY,
    process.env.PAYDUNYA_PRIVATE_KEY,
    process.env.PAYDUNYA_PUBLIC_KEY,
    process.env.PAYDUNYA_TOKEN
  ];
  return required.every(Boolean);
};

const buildReference = () => `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

// Initialiser un paiement PayDunya (Wave / Orange Money / Carte)
export const initierPaiementPaydunya = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!ensurePaydunyaConfig()) {
      res.status(500).json({
        success: false,
        message: 'Configuration PayDunya incomplete. Ajoutez les cles API dans server/.env.'
      });
      return;
    }

    const etudiant = (req as any).user;
    const { montant, typePaiement, methodePaiement, successUrl, cancelUrl } = req.body;

    if (!montant || !typePaiement || !methodePaiement) {
      res.status(400).json({ success: false, message: 'montant, typePaiement et methodePaiement sont obligatoires.' });
      return;
    }

    const reference = buildReference();
    const montantNumber = Number(montant);

    const paiement = await prisma.paiement.create({
      data: {
        etudiantId: etudiant.id,
        montant: montantNumber,
        typePaiement,
        methodePaiement,
        statutPaiement: 'en_attente'
      }
    });

    const returnBase = successUrl || process.env.PAYDUNYA_RETURN_URL || 'http://localhost:3000/dashboard/paiement?status=success';
    const cancelBase = cancelUrl || process.env.PAYDUNYA_CANCEL_URL || 'http://localhost:3000/dashboard/paiement?status=cancel';
    const callbackUrl = process.env.PAYDUNYA_IPN_URL || 'http://localhost:5000/api/paiements/paydunya/ipn';

    const payload = {
      invoice: {
        items: [
          {
            name: `Frais ${typePaiement}`,
            quantity: 1,
            unit_price: montantNumber,
            total_price: montantNumber,
            description: `Paiement ${typePaiement} - ISEM`
          }
        ],
        total_amount: montantNumber,
        description: `Paiement ${typePaiement} pour ${etudiant?.email || 'etudiant'}`
      },
      store: {
        name: 'ISEM UGB Portefeuille Etudiant',
        website_url: 'http://localhost:3000'
      },
      custom_data: {
        local_payment_id: paiement.id,
        local_reference: reference,
        etudiant_id: etudiant.id,
        methode_paiement: methodePaiement
      },
      actions: {
        cancel_url: cancelBase,
        return_url: returnBase,
        callback_url: callbackUrl
      }
    };

    const response = await fetch(`${PAYDUNYA_BASE_URL}${apiPrefix()}/checkout-invoice/create`, {
      method: 'POST',
      headers: paydunyaHeaders(),
      body: JSON.stringify(payload)
    });

    const rawText = await response.text();
    let data: any = {};
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      data = { response_text: rawText };
    }

    const checkoutUrl =
      data?.response_text ||
      data?.invoice_url ||
      data?.url ||
      data?.redirect_url ||
      data?.response?.url;

    const token = data?.token || data?.response?.token;
    const ok = data?.response_code === '00' && typeof checkoutUrl === 'string' && checkoutUrl.startsWith('http');

    if (!ok || !checkoutUrl) {
      await prisma.paiement.update({ where: { id: paiement.id }, data: { statutPaiement: 'echoue' } });
      res.status(502).json({
        success: false,
        message: data?.description || data?.response_text || 'Echec de creation de la session PayDunya.',
        details: data
      });
      return;
    }

    await prisma.paiement.update({
      where: { id: paiement.id },
      data: { recuUrl: token ? `paydunya:${token}:${reference}` : `paydunya:${reference}` }
    });

    res.status(201).json({
      success: true,
      message: 'Session PayDunya creee avec succes.',
      paiementId: paiement.id,
      reference,
      checkoutUrl,
      token
    });
  } catch (error: any) {
    console.error('Erreur initierPaiementPaydunya:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de l initialisation du paiement.' });
  }
};

// Callback IPN PayDunya
export const callbackPaydunya = async (req: Request, res: Response): Promise<void> => {
  try {
    const body: any = req.body || {};
    const customData = body?.custom_data || body?.invoice?.custom_data || {};

    const localPaymentId = customData.local_payment_id || body?.metadata?.local_payment_id;
    const statusRaw = String(body?.status || body?.payment_status || body?.invoice?.status || '').toLowerCase();

    let statutPaiement = 'en_attente';
    if (['completed', 'paid', 'success', 'accepte', 'accepted'].includes(statusRaw)) {
      statutPaiement = 'valide';
    }
    if (['cancelled', 'canceled', 'failed', 'echec', 'declined'].includes(statusRaw)) {
      statutPaiement = 'echoue';
    }

    if (localPaymentId) {
      await prisma.paiement.update({ where: { id: localPaymentId }, data: { statutPaiement } });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erreur callbackPaydunya:', error);
    res.status(200).json({ success: true });
  }
};

// Verifier le statut d'un paiement PayDunya via le token (optionnel)
export const verifierPaiementPaydunya = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    if (!token) {
      res.status(400).json({ success: false, message: 'Token PayDunya manquant.' });
      return;
    }

    if (!ensurePaydunyaConfig()) {
      res.status(500).json({ success: false, message: 'Configuration PayDunya incomplete.' });
      return;
    }

    const response = await fetch(`${PAYDUNYA_BASE_URL}${apiPrefix()}/checkout-invoice/confirm/${token}`, {
      method: 'GET',
      headers: paydunyaHeaders()
    });

    const rawText = await response.text();
    let data: any = {};
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      data = { response_text: rawText };
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Erreur verifierPaiementPaydunya:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la verification du paiement.' });
  }
};

// Paiement physique (recu)
export const creerPaiement = async (req: Request, res: Response): Promise<void> => {
  try {
    const etudiantId = (req as any).user.id;
    const { montant, typePaiement, methodePaiement, recuUrl } = req.body;

    const reference = buildReference();

    const paiement = await prisma.paiement.create({
      data: {
        etudiantId,
        montant,
        typePaiement,
        methodePaiement,
        recuUrl,
        statutPaiement: methodePaiement === 'physique' ? 'en_attente' : 'valide'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Paiement initie avec succes !',
      paiement,
      reference
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// Obtenir mes paiements
export const getMesPaiements = async (req: Request, res: Response): Promise<void> => {
  try {
    const etudiantId = (req as any).user.id;

    const paiements = await prisma.paiement.findMany({
      where: { etudiantId },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, paiements });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};
