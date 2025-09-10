import React from 'react';
import { Calendar, Users, DollarSign, Clock } from 'lucide-react';

interface Stats {
  agendamentosHoje: number;
  agendamentosMes: number;
  clientesTotal: number;
  receitaMes: number;
  agendamentosPendentes: number;
}

interface StatsGridProps {
  stats: Stats;
  isLoading?: boolean;
}

export function StatsGrid({ stats, isLoading }: StatsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-800/30 rounded-2xl border border-gray-700/50 p-8 animate-pulse backdrop-blur-sm">
            <div className="h-4 bg-gray-700 rounded-lg w-3/4 mb-3"></div>
            <div className="h-8 bg-gray-700 rounded-lg w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Agendamentos Hoje',
      value: stats.agendamentosHoje,
      icon: Calendar,
      color: 'primary',
    },
    {
      title: 'Agendamentos do Mês',
      value: stats.agendamentosMes,
      icon: Clock,
      color: 'success',
    },
    {
      title: 'Total de Clientes',
      value: stats.clientesTotal,
      icon: Users,
      color: 'warning',
    },
    {
      title: 'Receita do Mês',
      value: `R$ ${stats.receitaMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'error',
    },
  ];

  const colorClasses = {
    primary: 'bg-primary-500/20 text-primary-400',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-gray-800/30 backdrop-blur-2xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:transform hover:scale-[1.02] group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-400 mb-2 tracking-wide">{stat.title}</p>
                <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                <Icon className="w-7 h-7" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}