import React from 'react';
import { 
  Calendar, 
  Users, 
  Briefcase, 
  BarChart3, 
  Settings,
  Home,
  Clock,
  Zap
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'agendamentos', label: 'Agendamentos', icon: Calendar },
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'profissionais', label: 'Profissionais', icon: Briefcase },
  { id: 'servicos', label: 'Serviços', icon: Clock },
  { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
  { id: 'configuracoes', label: 'Configurações', icon: Settings },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-72 bg-gray-900/80 backdrop-blur-2xl border-r border-gray-700/50 h-screen flex flex-col">
      <div className="p-8 border-b border-gray-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-2xl">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">AgendaPro</h1>
            <p className="text-sm text-gray-400 font-medium">Sistema de Gestão</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-6 py-8 space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-left transition-all duration-300 group
                ${isActive 
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-2xl transform scale-[1.02]' 
                  : 'text-gray-300 hover:bg-gray-800/50 hover:text-white hover:transform hover:scale-[1.01] backdrop-blur-sm'
                }
              `}
            >
              <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary-400'}`} />
              <span className="font-semibold text-sm tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gray-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Admin</p>
            <p className="text-xs text-gray-400 font-medium">admin@empresa.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}