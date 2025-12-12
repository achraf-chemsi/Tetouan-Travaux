export type ProjectStatus = 'En cours' | 'Achevé' | 'En arrêt' | 'Non commencé';

export interface Project {
  id: string;
  name: string; // Intitulé du Projet
  owner: string; // Maitre d'ouvrage
  program: string; // INDH, Medina Program, FDR, etc.
  budget: number; // Montant du Marché (MAD)
  progress: number; // Taux Phy (%)
  status: ProjectStatus; // Etat Projet
  deadline: string; // Date prévisionnelle d'Achèvement
}

export interface KPIData {
  totalProjects: number;
  totalBudget: number;
  avgProgress: number;
  criticalCount: number;
}