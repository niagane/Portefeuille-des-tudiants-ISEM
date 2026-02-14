export interface Etudiant {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  filiere: string;
  niveau: string;
  createdAt: string;
}

export interface Inscription {
  id: string;
  typeInscription: string;
  anneeAcademique: string;
  matieres?: string;
  statut: string;
  createdAt: string;
}

export interface Paiement {
  id: string;
  montant: number;
  typePaiement: string;
  methodePaiement: string;
  recuUrl?: string;
  statutPaiement: string;
  createdAt: string;
}

export interface Reclamation {
  id: string;
  objet: string;
  description: string;
  statut: string;
  createdAt: string;
}

export interface Justificatif {
  id: string;
  motif: string;
  dateDebut: string;
  dateFin: string;
  statut: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  etudiant: Etudiant;
}