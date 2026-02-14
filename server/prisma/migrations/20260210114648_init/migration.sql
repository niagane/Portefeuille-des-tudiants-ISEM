-- CreateTable
CREATE TABLE "Etudiant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "matricule" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telephone" TEXT,
    "dateNaissance" DATETIME,
    "filiere" TEXT NOT NULL,
    "niveau" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Inscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "etudiantId" TEXT NOT NULL,
    "typeInscription" TEXT NOT NULL,
    "anneeAcademique" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'en_attente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Inscription_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "Etudiant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Paiement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "etudiantId" TEXT NOT NULL,
    "montant" REAL NOT NULL,
    "typePaiement" TEXT NOT NULL,
    "methodePaiement" TEXT NOT NULL,
    "statutPaiement" TEXT NOT NULL DEFAULT 'en_attente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Paiement_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "Etudiant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reclamation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "etudiantId" TEXT NOT NULL,
    "objet" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'en_attente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Reclamation_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "Etudiant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Justificatif" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "etudiantId" TEXT NOT NULL,
    "motif" TEXT NOT NULL,
    "dateDebut" DATETIME NOT NULL,
    "dateFin" DATETIME NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'en_attente',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Justificatif_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "Etudiant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Etudiant_matricule_key" ON "Etudiant"("matricule");

-- CreateIndex
CREATE UNIQUE INDEX "Etudiant_email_key" ON "Etudiant"("email");
