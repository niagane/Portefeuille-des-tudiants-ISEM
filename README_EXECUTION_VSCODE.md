
# Guide d’exécution (VS Code) — Portefeuille Étudiants ISEM UGB

Ce projet est un **monorepo** avec :
- **Front** : Next.js dans `client/` (port **3000**)
- **Back** : Express + Prisma (SQLite) dans `server/` (port **5000**)

> Les pages **Connexion** et **Créer un compte** appellent l’API (`/auth/login`, `/auth/register`).
> Si le serveur n’est pas démarré ou si l’URL API est mauvaise, l’authentification ne marche pas.

## Prérequis
- Node.js 18+ (recommandé 20)
- pnpm installé : `npm i -g pnpm`

## 1) Installation
À la racine du projet :
```bash
pnpm install
```

## 2) Démarrer le BACK (Express + Prisma)
Dans un terminal :
```bash
# depuis la racine
pnpm prisma:generate
pnpm prisma:migrate
pnpm dev
```

- Le serveur doit écouter sur **http://localhost:5000**
- Le fichier d’environnement back est dans `server/.env`.

## 3) Démarrer le FRONT (Next.js)
Dans un **second** terminal :
```bash
cd client
pnpm install
pnpm dev
```

Ouvre : **http://localhost:3000**

## 4) Configuration API côté FRONT
Le front lit l’URL de l’API depuis :
- `client/.env.local` → `NEXT_PUBLIC_API_URL=http://localhost:5000`

Le client HTTP Axios est dans :
- `client/src/lib/api.ts`

## 5) Tester rapidement l’API
### Inscription (register)
```bash
curl -X POST http://localhost:5000/auth/register   -H "Content-Type: application/json"   -d '{
    "matricule":"A12345",
    "nom":"Diallo",
    "prenom":"Amadou",
    "email":"amadou.diallo@ugb.edu.sn",
    "password":"Passw0rd!",
    "telephone":"770000000",
    "filiere":"Informatique",
    "niveau":"L1"
  }'
```

### Connexion (login)
```bash
curl -X POST http://localhost:5000/auth/login   -H "Content-Type: application/json"   -d '{"email":"amadou.diallo@ugb.edu.sn","password":"Passw0rd!"}'
```

## 6) Dépannage
- **Erreur Network / CORS** : vérifie que le back tourne bien sur `:5000` et que `FRONTEND_URL` dans `server/.env` correspond à `http://localhost:3000`.
- **401 Email ou mot de passe incorrect** : le compte n’existe pas encore → fais d’abord register.
- **Erreur Prisma / DB** : relance `pnpm prisma:migrate`.

