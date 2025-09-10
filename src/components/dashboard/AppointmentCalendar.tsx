import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Plus, Edit, Trash2 } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { AppointmentForm } from '../forms/AppointmentForm';
import { useStore } from '../../store/useStore';
import { api } from '../../lib/api';

export function AppointmentCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { agendamentos, setAgendamentos, isLoading, setLoading } = useStore();

  useEffect(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
    setWeekDays(eachDayOfInterval({ start, end }));
  }, [selectedDate]);

  useEffect(() => {
    loadAgendamentos();
  }, [selectedDate]);

  const loadAgendamentos = async () => {
    setLoading(true);
    try {
      const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
      
      const response = await api.getAgendamentos({
        data_inicio: start.toISOString(),
        data_fim: end.toISOString(),
      });
      
      setAgendamentos(response.agendamentos || []);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (agendamento: any) => {
    setSelectedAppointment(agendamento);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
      try {
        await api.deleteAgendamento(id);
        loadAgendamentos();
      } catch (error) {
        console.error('Erro ao cancelar agendamento:', error);
      }
    }
  };

  const handleSuccess = () => {
    loadAgendamentos();
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedAppointment(null);
  };

  const getAppointmentsForDay = (date: Date) => {
    return agendamentos.filter(appointment => {
      try {
        const appointmentDate = parseISO(appointment.data_hora);
        if (isNaN(appointmentDate.getTime())) {
          console.warn('Invalid date in appointment:', appointment.data_hora);
          return false;
        }
        return isSameDay(appointmentDate, date);
      } catch (error) {
        console.warn('Error parsing appointment date:', appointment.data_hora, error);
        return false;
      }
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      agendado: 'bg-blue-500/20 text-blue-400',
      confirmado: 'bg-green-500/20 text-green-400',
      em_andamento: 'bg-yellow-500/20 text-yellow-400',
      concluido: 'bg-gray-500/20 text-gray-400',
      cancelado: 'bg-red-500/20 text-red-400',
    };
    return colors[status as keyof typeof colors] || colors.agendado;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      agendado: 'Agendado',
      confirmado: 'Confirmado',
      em_andamento: 'Em Andamento',
      concluido: 'Concluído',
      cancelado: 'Cancelado',
      nao_compareceu: 'Não Compareceu',
    };
    return labels[status as keyof typeof labels] || status;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-dark-700 rounded mb-6" />
          <div className="grid grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-32 bg-dark-700 rounded" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Calendário de Agendamentos</h2>
            <p className="text-gray-400">
              Semana de {format(weekDays[0], 'dd', { locale: ptBR })} à {format(weekDays[6], 'dd MMM yyyy', { locale: ptBR })}
            </p>
          </div>
          <DialogTrigger asChild>
            <Button className="bg-primary-600 hover:bg-primary-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day, index) => {
            const dayAppointments = getAppointmentsForDay(day);
            const isToday = isSameDay(day, new Date());

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-dark-800/50 backdrop-blur-xl rounded-xl border-2 p-4 min-h-[300px] transition-all duration-300 hover:shadow-md ${
                  isToday ? 'border-primary-500 bg-primary-500/10' : 'border-white/10'
                }`}
              >
                <div className="text-center mb-4">
                  <p className="text-sm font-medium text-gray-400">
                    {format(day, 'EEE', { locale: ptBR })}
                  </p>
                  <p className={`text-2xl font-bold ${
                    isToday ? 'text-primary-400' : 'text-white'
                  }`}>
                    {format(day, 'dd')}
                  </p>
                </div>

                <div className="space-y-2">
                  {dayAppointments.map((appointment) => (
                    <motion.div
                      key={appointment.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-dark-700/50 rounded-lg p-3 border border-white/10 shadow-sm hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-300">
                          {(() => {
                            try {
                              if (!appointment.data_hora) {
                                return 'Horário não definido';
                              }
                              const date = parseISO(appointment.data_hora);
                              if (isNaN(date.getTime())) {
                                return 'Horário inválido';
                              }
                              return format(date, 'HH:mm');
                            } catch (error) {
                              console.warn('Error formatting appointment time:', appointment.data_hora, error);
                              return 'Horário inválido';
                            }
                          })()}
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                            {getStatusLabel(appointment.status)}
                          </span>
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(appointment)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(appointment.id)}
                              className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm font-semibold text-white mb-1">
                        {appointment.clientes?.nome}
                      </p>
                      
                      <div className="text-xs text-gray-300 space-y-1">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {appointment.profissionais?.nome}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {appointment.servicos?.nome}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-primary-400">R$ {Number(appointment.valor_total).toFixed(2)}</span>
                          <span>{appointment.servicos?.duracao_minutos}min</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {dayAppointments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">Nenhum agendamento</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {isDialogOpen && (
          <AppointmentForm
            agendamento={selectedAppointment}
            onClose={handleCloseDialog}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </Dialog>
  );
}