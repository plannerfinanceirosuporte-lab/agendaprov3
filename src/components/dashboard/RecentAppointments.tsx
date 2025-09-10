import React from 'react';
import { Card } from '../ui/card';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Appointment {
  id: string;
  data_hora: string;
  status: string;
  clientes: { nome: string };
  servicos: { nome: string };
  profissionais: { nome: string };
  valor_total: number;
}

interface RecentAppointmentsProps {
  appointments: Appointment[];
  isLoading?: boolean;
}

const statusColors = {
  agendado: 'bg-blue-500/20 text-blue-400',
  confirmado: 'bg-green-500/20 text-green-400',
  em_andamento: 'bg-yellow-500/20 text-yellow-400',
  concluido: 'bg-gray-500/20 text-gray-400',
  cancelado: 'bg-red-500/20 text-red-400',
};

const statusLabels = {
  agendado: 'Agendado',
  confirmado: 'Confirmado',
  em_andamento: 'Em Andamento',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
  nao_compareceu: 'Não Compareceu',
};

export function RecentAppointments({ appointments, isLoading }: RecentAppointmentsProps) {
  if (isLoading) {
    return (
      <Card title="Próximos Agendamentos">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card title="Próximos Agendamentos" subtitle="Agendamentos para hoje">
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Nenhum agendamento para hoje</p>
        ) : (
          appointments.slice(0, 5).map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="font-medium text-white">{appointment.clientes.nome}</p>
                    <p className="text-sm text-gray-400">{appointment.servicos.nome}</p>
                    <p className="text-sm text-gray-500">
                      {(() => {
                        try {
                          if (!appointment.data_hora) {
                            return 'Horário não definido';
                          }
                          const date = parseISO(appointment.data_hora);
                          if (isNaN(date.getTime())) {
                            return 'Horário inválido';
                          }
                          return format(parseISO(appointment.data_hora), 'HH:mm', { locale: ptBR });
                        } catch {
                          return 'Horário inválido';
                        }
                      })()} - {appointment.profissionais.nome}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-white">
                  R$ {Number(appointment.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[appointment.status as keyof typeof statusColors]}`}>
                  {statusLabels[appointment.status as keyof typeof statusLabels]}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}