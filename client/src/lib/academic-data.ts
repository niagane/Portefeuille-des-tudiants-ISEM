export type NiveauLicence =
  | 'LICENCE 1'
  | 'LICENCE 2'
  | 'LICENCE 3'
  | 'MASTER 1'
  | 'MASTER 2';

export interface CourseItem {
  module: string;
  enseignant: string;
  credits: number;
  salle: string;
  pdfUrl?: string;
}

export interface TdItem {
  module: string;
  groupe: string;
  encadrant: string;
  salle: string;
  pdfUrl?: string;
}

export interface PlanningSlot {
  heure: string;
  lundi: string;
  mardi: string;
  mercredi: string;
  jeudi: string;
  vendredi: string;
}

export const PARCOURS_BY_LEVEL: Record<NiveauLicence, string[]> = {
  'LICENCE 1': ['LPG', 'LPGIE'],
  'LICENCE 2': ['LPG', 'LPGIE'],
  'LICENCE 3': ['LPG', 'LPGIE'],
  'MASTER 1': ['MBF', 'MGRH', 'ACG', 'MMP'],
  'MASTER 2': ['MBF', 'MGRH', 'ACG', 'MMP']
};

export const PARCOURS_LABELS: Record<string, string> = {
  LPG: 'LPG',
  LPGIE: 'LPGIE',
  MBF: 'MBF - Monnaie Banque Finance',
  MGRH: 'MGRH - Management des Ressources Humaines',
  ACG: 'ACG - Audit et Controle de Gestion',
  MMP: 'MMP - Marketing et Management de Projet'
};

const LEVEL_ALIASES: Record<string, NiveauLicence> = {
  L1: 'LICENCE 1',
  L2: 'LICENCE 2',
  L3: 'LICENCE 3',
  M1: 'MASTER 1',
  M2: 'MASTER 2',
  'LICENCE 1': 'LICENCE 1',
  'LICENCE 2': 'LICENCE 2',
  'LICENCE 3': 'LICENCE 3',
  'MASTER 1': 'MASTER 1',
  'MASTER 2': 'MASTER 2'
};

export function normalizeNiveau(raw?: string | null): NiveauLicence {
  const upper = (raw || '').trim().toUpperCase();
  return LEVEL_ALIASES[upper] || 'LICENCE 1';
}

export const COURSE_CHOICES_BY_LEVEL: Record<NiveauLicence, string[]> = {
  'LICENCE 1': [
    'Introduction a la gestion',
    'Comptabilite generale',
    'Microeconomie 1',
    'Macroeconomie 1',
    'Business English'
  ],
  'LICENCE 2': [
    'Comptabilite approfondie',
    'RSE et DD (LPG2)',
    'Techniques de recherche (TRE)',
    'CPP L2',
    'Statistiques 2'
  ],
  'LICENCE 3': [
    'Methodes statistiques (MS)',
    'Systemes d information',
    'Management strategique',
    'Marketing',
    'Projet de fin d etudes'
  ],
  'MASTER 1': [
    'Architecture logicielle',
    'Big Data',
    'Methodes de recherche',
    'Securite avancee',
    'Management de projet'
  ],
  'MASTER 2': [
    'Cloud et DevOps',
    'Intelligence artificielle',
    'Gouvernance SI',
    'Audit et conformite',
    'Memoire de master'
  ]
};

export const COURSES_BY_LEVEL: Record<NiveauLicence, CourseItem[]> = {
  'LICENCE 1': [
    { module: 'Introduction a la gestion', enseignant: 'Equipe ISEM', credits: 6, salle: 'A12', pdfUrl: '/documents/l1-introduction-gestion.pdf' },
    { module: 'Comptabilite generale', enseignant: 'Equipe ISEM', credits: 5, salle: 'B04', pdfUrl: '/documents/l1-fascicule.pdf' },
    { module: 'Microeconomie 1', enseignant: 'Equipe ISEM', credits: 4, salle: 'B05', pdfUrl: '/documents/l1-fascicule.pdf' }
  ],
  'LICENCE 2': [
    { module: 'CPP L2', enseignant: 'Equipe ISEM', credits: 5, salle: 'C11', pdfUrl: '/documents/l2-cpp-support-01.pdf' },
    { module: 'Techniques de recherche', enseignant: 'Equipe ISEM', credits: 5, salle: 'C09', pdfUrl: '/documents/l2-tre-support-04.pdf' },
    { module: 'Rattrapage LPG2', enseignant: 'Equipe ISEM', credits: 4, salle: 'C07', pdfUrl: '/documents/l2-lpg-rattrapage-16-fev.pdf' }
  ],
  'LICENCE 3': [
    { module: 'Methodes statistiques (MS)', enseignant: 'Equipe ISEM', credits: 6, salle: 'D02', pdfUrl: '/documents/l3-cours-ms.pdf' },
    { module: 'Fiche L3 - Travaux diriges', enseignant: 'Equipe ISEM', credits: 5, salle: 'TD-L3', pdfUrl: '/documents/l3-fiche-1.pdf' },
    { module: 'Exercices complementaires L3', enseignant: 'Equipe ISEM', credits: 4, salle: 'D05', pdfUrl: '/documents/l3-exo-complementaire.pdf' }
  ],
  'MASTER 1': [
    { module: 'Architecture logicielle', enseignant: 'M. Tall', credits: 6, salle: 'M11' },
    { module: 'Big Data', enseignant: 'Mme Ndiour', credits: 5, salle: 'Lab M1' },
    { module: 'Methodes de recherche', enseignant: 'M. Mbaye', credits: 4, salle: 'M04' }
  ],
  'MASTER 2': [
    { module: 'Cloud et DevOps', enseignant: 'M. Diagne', credits: 6, salle: 'M21' },
    { module: 'Intelligence artificielle', enseignant: 'Mme Cisse', credits: 5, salle: 'Lab IA' },
    { module: 'Gouvernance SI', enseignant: 'M. Fofana', credits: 4, salle: 'M07' }
  ]
};

export const TD_BY_LEVEL: Record<NiveauLicence, TdItem[]> = {
  'LICENCE 1': [
    { module: 'TD Microeconomie 1', groupe: 'Groupe 1', encadrant: 'Equipe ISEM', salle: 'TD-01', pdfUrl: '/documents/l1-td-microeconomie-1.pdf' },
    { module: 'TD Analyse L1', groupe: 'Groupe 2', encadrant: 'Equipe ISEM', salle: 'TD-05', pdfUrl: '/documents/l1-fascicule.pdf' }
  ],
  'LICENCE 2': [
    { module: 'TD CPP L2', groupe: 'Groupe A', encadrant: 'Equipe ISEM', salle: 'TD-02', pdfUrl: '/documents/l2-cpp-support-01.pdf' },
    { module: 'TD TRE L2', groupe: 'Groupe B', encadrant: 'Equipe ISEM', salle: 'TD-06', pdfUrl: '/documents/l2-tre-support-04.pdf' }
  ],
  'LICENCE 3': [
    { module: 'TD Fiche 1 L3', groupe: 'Groupe Projet', encadrant: 'Equipe ISEM', salle: 'TD-03', pdfUrl: '/documents/l3-fiche-1.pdf' },
    { module: 'TD Exos complementaires L3', groupe: 'Groupe S1', encadrant: 'Equipe ISEM', salle: 'TD-07', pdfUrl: '/documents/l3-exo-complementaire.pdf' }
  ],
  'MASTER 1': [
    { module: 'Architecture logicielle', groupe: 'Master G1', encadrant: 'M. Diallo', salle: 'TD-M1' },
    { module: 'Big Data', groupe: 'Master G2', encadrant: 'Mme Seck', salle: 'Lab-M1' }
  ],
  'MASTER 2': [
    { module: 'Cloud et DevOps', groupe: 'Master Pro', encadrant: 'M. Ndiaye', salle: 'TD-M2' },
    { module: 'IA appliquee', groupe: 'Master Rech.', encadrant: 'Mme Ba', salle: 'Lab-M2' }
  ]
};

export const SCHEDULE_BY_LEVEL: Record<NiveauLicence, PlanningSlot[]> = {
  'LICENCE 1': [
    { heure: '08:00 - 10:00', lundi: 'Algorithmique', mardi: 'Maths appliquees', mercredi: 'Anglais', jeudi: 'Programmation', vendredi: 'Libre' },
    { heure: '10:30 - 12:30', lundi: 'TD Algo', mardi: 'Expression', mercredi: 'Programmation', jeudi: 'Maths', vendredi: 'TD Prog' },
    { heure: '14:00 - 16:00', lundi: 'Libre', mardi: 'Projet', mercredi: 'TD Maths', jeudi: 'Anglais', vendredi: 'Soutien' }
  ],
  'LICENCE 2': [
    { heure: '08:00 - 10:00', lundi: 'Base de donnees', mardi: 'Reseaux', mercredi: 'Programmation web', jeudi: 'Analyse num.', vendredi: 'Libre' },
    { heure: '10:30 - 12:30', lundi: 'TD BDD', mardi: 'TD Reseaux', mercredi: 'TD Web', jeudi: 'Methodologie', vendredi: 'Seminaire' },
    { heure: '14:00 - 16:00', lundi: 'Projet web', mardi: 'Libre', mercredi: 'Atelier dev', jeudi: 'Veille techno', vendredi: 'Libre' }
  ],
  'LICENCE 3': [
    { heure: '08:00 - 10:00', lundi: 'Genie logiciel', mardi: 'Dev mobile', mercredi: 'Securite', jeudi: 'Admin systeme', vendredi: 'Libre' },
    { heure: '10:30 - 12:30', lundi: 'TD Genie logiciel', mardi: 'TD Mobile', mercredi: 'TD Securite', jeudi: 'Projet', vendredi: 'Conference' },
    { heure: '14:00 - 16:00', lundi: 'Projet fil rouge', mardi: 'Libre', mercredi: 'Atelier CV', jeudi: 'Encadrement', vendredi: 'Libre' }
  ],
  'MASTER 1': [
    { heure: '08:00 - 10:00', lundi: 'Architecture logicielle', mardi: 'Big Data', mercredi: 'Recherche', jeudi: 'Securite avancee', vendredi: 'Libre' },
    { heure: '10:30 - 12:30', lundi: 'TD Archi', mardi: 'TD Big Data', mercredi: 'Seminaire', jeudi: 'Projet SI', vendredi: 'Veille' },
    { heure: '14:00 - 16:00', lundi: 'Atelier', mardi: 'Libre', mercredi: 'Projet', jeudi: 'Encadrement', vendredi: 'Libre' }
  ],
  'MASTER 2': [
    { heure: '08:00 - 10:00', lundi: 'Cloud et DevOps', mardi: 'IA', mercredi: 'Gouvernance SI', jeudi: 'Audit', vendredi: 'Libre' },
    { heure: '10:30 - 12:30', lundi: 'TD Cloud', mardi: 'TD IA', mercredi: 'Cas pratique', jeudi: 'Projet final', vendredi: 'Conference' },
    { heure: '14:00 - 16:00', lundi: 'Memoire', mardi: 'Libre', mercredi: 'Encadrement', jeudi: 'Soutenance blanche', vendredi: 'Libre' }
  ]
};

const MASTER_COURSE_CHOICES_BY_PARCOURS: Record<string, string[]> = {
  MBF: ['Marches financiers', 'Gestion bancaire', 'Analyse du risque', 'Ingenierie financiere', 'Memoire MBF'],
  MGRH: ['Strategie RH', 'Droit social', 'Recrutement et talents', 'GPEC', 'Memoire MGRH'],
  ACG: ['Audit interne', 'Controle de gestion avance', 'Normes IFRS', 'Fiscalite', 'Memoire ACG'],
  MMP: ['Marketing strategique', 'Management de projet', 'Communication digitale', 'Etudes de marche', 'Memoire MMP']
};

const MASTER_COURSES_BY_PARCOURS: Record<string, CourseItem[]> = {
  MBF: [
    { module: 'Marches financiers', enseignant: 'Equipe Master MBF', credits: 6, salle: 'M-BF1', pdfUrl: '/documents/master-mbf-maquette.pdf' },
    { module: 'Gestion bancaire', enseignant: 'Equipe Master MBF', credits: 5, salle: 'M-BF2', pdfUrl: '/documents/master-mbf-maquette.pdf' },
    { module: 'Ingenierie financiere', enseignant: 'Equipe Master MBF', credits: 4, salle: 'M-BF3', pdfUrl: '/documents/master-mbf-maquette.pdf' }
  ],
  MGRH: [
    { module: 'Strategie RH', enseignant: 'Equipe Master MGRH', credits: 6, salle: 'M-RH1', pdfUrl: '/documents/master-mgrh-maquette.pdf' },
    { module: 'Droit social', enseignant: 'Equipe Master MGRH', credits: 5, salle: 'M-RH2', pdfUrl: '/documents/master-mgrh-maquette.pdf' },
    { module: 'GPEC', enseignant: 'Equipe Master MGRH', credits: 4, salle: 'M-RH3', pdfUrl: '/documents/master-mgrh-maquette.pdf' }
  ],
  ACG: [
    { module: 'Audit interne', enseignant: 'Equipe Master ACG', credits: 6, salle: 'M-ACG1', pdfUrl: '/documents/master-acg-maquette.pdf' },
    { module: 'Controle de gestion avance', enseignant: 'Equipe Master ACG', credits: 5, salle: 'M-ACG2', pdfUrl: '/documents/master-acg-maquette.pdf' },
    { module: 'Normes IFRS', enseignant: 'Equipe Master ACG', credits: 4, salle: 'M-ACG3', pdfUrl: '/documents/master-acg-maquette.pdf' }
  ],
  MMP: [
    { module: 'Marketing strategique', enseignant: 'Equipe Master MMP', credits: 6, salle: 'M-MMP1', pdfUrl: '/documents/master-mmp-maquette.pdf' },
    { module: 'Management de projet', enseignant: 'Equipe Master MMP', credits: 5, salle: 'M-MMP2', pdfUrl: '/documents/master-mmp-maquette.pdf' },
    { module: 'Communication digitale', enseignant: 'Equipe Master MMP', credits: 4, salle: 'M-MMP3', pdfUrl: '/documents/master-mmp-maquette.pdf' }
  ]
};

const MASTER_TD_BY_PARCOURS: Record<string, TdItem[]> = {
  MBF: [
    { module: 'TD Gestion bancaire', groupe: 'Master BF-A', encadrant: 'Equipe Master MBF', salle: 'TD-BF1', pdfUrl: '/documents/master-mbf-maquette.pdf' },
    { module: 'TD Analyse du risque', groupe: 'Master BF-B', encadrant: 'Equipe Master MBF', salle: 'TD-BF2', pdfUrl: '/documents/master-mbf-maquette.pdf' }
  ],
  MGRH: [
    { module: 'TD Strategie RH', groupe: 'Master RH-A', encadrant: 'Equipe Master MGRH', salle: 'TD-RH1', pdfUrl: '/documents/master-mgrh-maquette.pdf' },
    { module: 'TD Recrutement et talents', groupe: 'Master RH-B', encadrant: 'Equipe Master MGRH', salle: 'TD-RH2', pdfUrl: '/documents/master-mgrh-maquette.pdf' }
  ],
  ACG: [
    { module: 'TD Audit interne', groupe: 'Master ACG-A', encadrant: 'Equipe Master ACG', salle: 'TD-ACG1', pdfUrl: '/documents/master-acg-maquette.pdf' },
    { module: 'TD Fiscalite', groupe: 'Master ACG-B', encadrant: 'Equipe Master ACG', salle: 'TD-ACG2', pdfUrl: '/documents/master-acg-maquette.pdf' }
  ],
  MMP: [
    { module: 'TD Marketing strategique', groupe: 'Master MMP-A', encadrant: 'Equipe Master MMP', salle: 'TD-MMP1', pdfUrl: '/documents/master-mmp-maquette.pdf' },
    { module: 'TD Management de projet', groupe: 'Master MMP-B', encadrant: 'Equipe Master MMP', salle: 'TD-MMP2', pdfUrl: '/documents/master-mmp-maquette.pdf' }
  ]
};

const MASTER_SCHEDULE_BY_PARCOURS: Record<string, PlanningSlot[]> = {
  MBF: [
    { heure: '08:00 - 10:00', lundi: 'Marches financiers', mardi: 'Gestion bancaire', mercredi: 'Analyse du risque', jeudi: 'Ingenierie financiere', vendredi: 'Libre' },
    { heure: '10:30 - 12:30', lundi: 'TD BF', mardi: 'Cas pratique', mercredi: 'Seminaire banque', jeudi: 'Projet', vendredi: 'Veille' },
    { heure: '14:00 - 16:00', lundi: 'Memoire', mardi: 'Libre', mercredi: 'Encadrement', jeudi: 'Atelier', vendredi: 'Libre' }
  ],
  MGRH: [
    { heure: '08:00 - 10:00', lundi: 'Strategie RH', mardi: 'Droit social', mercredi: 'GPEC', jeudi: 'Talents', vendredi: 'Libre' },
    { heure: '10:30 - 12:30', lundi: 'TD RH', mardi: 'Etude de cas', mercredi: 'Seminaire RH', jeudi: 'Projet', vendredi: 'Conference' },
    { heure: '14:00 - 16:00', lundi: 'Memoire', mardi: 'Libre', mercredi: 'Encadrement', jeudi: 'Atelier', vendredi: 'Libre' }
  ],
  ACG: [
    { heure: '08:00 - 10:00', lundi: 'Audit interne', mardi: 'Controle de gestion', mercredi: 'IFRS', jeudi: 'Fiscalite', vendredi: 'Libre' },
    { heure: '10:30 - 12:30', lundi: 'TD ACG', mardi: 'Cas audit', mercredi: 'Seminaire', jeudi: 'Projet', vendredi: 'Veille' },
    { heure: '14:00 - 16:00', lundi: 'Memoire', mardi: 'Libre', mercredi: 'Encadrement', jeudi: 'Atelier', vendredi: 'Libre' }
  ],
  MMP: [
    { heure: '08:00 - 10:00', lundi: 'Marketing strategique', mardi: 'Management projet', mercredi: 'Com digitale', jeudi: 'Etudes marche', vendredi: 'Libre' },
    { heure: '10:30 - 12:30', lundi: 'TD MMP', mardi: 'Workshop', mercredi: 'Seminaire', jeudi: 'Projet', vendredi: 'Conference' },
    { heure: '14:00 - 16:00', lundi: 'Memoire', mardi: 'Libre', mercredi: 'Encadrement', jeudi: 'Atelier', vendredi: 'Libre' }
  ]
};

export function getCourseChoices(niveau: NiveauLicence, filiere?: string | null): string[] {
  if ((niveau === 'MASTER 1' || niveau === 'MASTER 2') && filiere && MASTER_COURSE_CHOICES_BY_PARCOURS[filiere]) {
    return MASTER_COURSE_CHOICES_BY_PARCOURS[filiere];
  }
  return COURSE_CHOICES_BY_LEVEL[niveau] || [];
}

export function getCourses(niveau: NiveauLicence, filiere?: string | null): CourseItem[] {
  if ((niveau === 'MASTER 1' || niveau === 'MASTER 2') && filiere && MASTER_COURSES_BY_PARCOURS[filiere]) {
    return MASTER_COURSES_BY_PARCOURS[filiere];
  }
  return COURSES_BY_LEVEL[niveau] || [];
}

export function getTd(niveau: NiveauLicence, filiere?: string | null): TdItem[] {
  if ((niveau === 'MASTER 1' || niveau === 'MASTER 2') && filiere && MASTER_TD_BY_PARCOURS[filiere]) {
    return MASTER_TD_BY_PARCOURS[filiere];
  }
  return TD_BY_LEVEL[niveau] || [];
}

export function getSchedule(niveau: NiveauLicence, filiere?: string | null): PlanningSlot[] {
  if ((niveau === 'MASTER 1' || niveau === 'MASTER 2') && filiere && MASTER_SCHEDULE_BY_PARCOURS[filiere]) {
    return MASTER_SCHEDULE_BY_PARCOURS[filiere];
  }
  return SCHEDULE_BY_LEVEL[niveau] || [];
}
