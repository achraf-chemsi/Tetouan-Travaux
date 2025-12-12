import { Project } from './types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const isCriticalProject = (project: Project): boolean => {
  const isStopped = project.status === 'En arrêt';
  const isDelayed = project.progress < 50 && new Date(project.deadline) < new Date();
  return isStopped || isDelayed;
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Achevé':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'En cours':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'En arrêt':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'Non commencé':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};