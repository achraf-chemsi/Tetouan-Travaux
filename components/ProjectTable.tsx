import React, { useState, useMemo } from 'react';
import { Project, ProjectStatus } from '../types';
import { formatCurrency, formatDate, getStatusColor } from '../utils';
import { 
  Search, 
  Filter, 
  AlertCircle, 
  X, 
  Calendar, 
  Building2, 
  CreditCard, 
  Activity, 
  Briefcase 
} from 'lucide-react';

interface ProjectTableProps {
  projects: Project[];
}

const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'All'>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.owner.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, statusFilter]);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Table Header / Filters */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h3 className="text-lg font-semibold text-slate-800">Liste des Projets</h3>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher un projet..."
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white w-full sm:w-auto cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'All')}
              >
                <option value="All">Tous les statuts</option>
                <option value="En cours">En cours</option>
                <option value="Achevé">Achevé</option>
                <option value="En arrêt">En arrêt</option>
                <option value="Non commencé">Non commencé</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Projet</th>
                <th className="px-6 py-4">Maitre d'ouvrage</th>
                <th className="px-6 py-4 text-right">Budget</th>
                <th className="px-6 py-4 text-center">Statut</th>
                <th className="px-6 py-4">Avancement</th>
                <th className="px-6 py-4 text-right">Echéance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <tr 
                    key={project.id} 
                    onClick={() => setSelectedProject(project)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {project.name}
                      <div className="text-xs text-slate-400 font-normal mt-1">{project.program}</div>
                    </td>
                    <td className="px-6 py-4">{project.owner}</td>
                    <td className="px-6 py-4 text-right font-medium font-mono">
                      {formatCurrency(project.budget)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 min-w-[150px]">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium w-8 text-right">{project.progress}%</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              project.status === 'En arrêt' ? 'bg-red-500' : 
                              project.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right tabular-nums">
                      {formatDate(project.deadline)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 flex flex-col items-center justify-center">
                    <AlertCircle size={32} className="mb-2 opacity-50" />
                    <p>Aucun projet trouvé</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer */}
        <div className="px-6 py-4 border-t border-slate-100 text-xs text-slate-400 bg-slate-50 flex justify-between">
           <span>Affichage de {filteredProjects.length} sur {projects.length} projets</span>
           <span>Dernière mise à jour: Aujourd'hui</span>
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedProject(null)}>
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-[fadeIn_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div className="pr-8">
                <div className="flex items-center gap-2 mb-2">
                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedProject.status)}`}>
                      {selectedProject.status}
                    </span>
                    <span className="text-xs text-slate-400 font-medium px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                      ID: {selectedProject.id}
                    </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 leading-snug">{selectedProject.name}</h2>
              </div>
              <button 
                onClick={() => setSelectedProject(null)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Program & Owner */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Programme</p>
                      <p className="text-sm font-semibold text-slate-900">{selectedProject.program}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                      <Building2 size={18} />
                    </div>
                     <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Maitre d'ouvrage</p>
                      <p className="text-sm font-semibold text-slate-900">{selectedProject.owner}</p>
                    </div>
                  </div>
                </div>

                {/* Budget & Deadline */}
                <div className="space-y-4">
                   <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Montant du Marché</p>
                      <p className="text-sm font-semibold text-slate-900 font-mono text-lg">{formatCurrency(selectedProject.budget)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                      <Calendar size={18} />
                    </div>
                     <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Date d'achèvement</p>
                      <p className="text-sm font-semibold text-slate-900">{formatDate(selectedProject.deadline)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Section */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center gap-2 text-slate-800 font-semibold">
                      <Activity size={18} className="text-slate-400" />
                      <span>Avancement Physique</span>
                   </div>
                   <span className="text-2xl font-bold text-blue-600">{selectedProject.progress}%</span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden w-full shadow-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                       selectedProject.status === 'En arrêt' ? 'bg-red-500' : 
                       selectedProject.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${selectedProject.progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2 text-right">Mise à jour automatique basée sur les rapports de chantier</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectTable;