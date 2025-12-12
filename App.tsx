import React, { useMemo } from 'react';
import { 
  LayoutDashboard, 
  Coins, 
  Activity, 
  AlertTriangle, 
  MapPin, 
  Building2 
} from 'lucide-react';
import { mockProjects } from './mockData';
import { formatCurrency, isCriticalProject } from './utils';
import StatCard from './components/StatCard';
import DashboardCharts from './components/DashboardCharts';
import ProjectTable from './components/ProjectTable';

const App: React.FC = () => {
  // Calculate Global KPIs
  const kpis = useMemo(() => {
    const totalProjects = mockProjects.length;
    const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0);
    const avgProgress = mockProjects.reduce((sum, p) => sum + p.progress, 0) / totalProjects;
    const criticalCount = mockProjects.filter(isCriticalProject).length;

    return {
      totalProjects,
      totalBudget,
      avgProgress: Math.round(avgProgress),
      criticalCount
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      
      {/* Header / Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Building2 className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Tétouan Travaux</h1>
              <p className="text-xs text-slate-500 font-medium">Tableau de Bord des Projets</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span className="hidden sm:flex items-center gap-1">
              <MapPin size={14} /> Province de Tétouan
            </span>
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
              <span className="font-semibold text-slate-600 text-xs">MA</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            label="Total Projets" 
            value={kpis.totalProjects} 
            icon={LayoutDashboard} 
            color="blue" 
          />
          <StatCard 
            label="Budget Global" 
            value={formatCurrency(kpis.totalBudget)} 
            icon={Coins} 
            color="green" 
          />
          <StatCard 
            label="Avancement Moyen" 
            value={`${kpis.avgProgress}%`} 
            icon={Activity} 
            color="yellow" 
          />
          <StatCard 
            label="Projets Critiques" 
            value={kpis.criticalCount} 
            icon={AlertTriangle} 
            color="red" 
          />
        </div>

        {/* Charts Section */}
        <DashboardCharts projects={mockProjects} />

        {/* Data Table Section */}
        <ProjectTable projects={mockProjects} />

      </main>
    </div>
  );
};

export default App;