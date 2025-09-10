import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Calendar } from 'react-calendar'; // Você pode trocar por outro calendário se preferir
import 'react-calendar/dist/Calendar.css';
import { supabase } from '../../lib/supabase/client';

interface Appointment {
  id: string;
  cliente_nome: string;
  servico_nome: string;
  profissional_nome: string;
  data_hora: string;
  status: string;
}

const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAppointments(selectedDate);
  }, [selectedDate]);

  async function fetchAppointments(date: Date) {
    setLoading(true);
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`id, data_hora, status, clientes (nome), servicos (nome), profissionais (nome)`) // ajuste conforme suas relações
      .gte('data_hora', start.toISOString())
      .lte('data_hora', end.toISOString())
      .order('data_hora', { ascending: true });
    if (!error && data) {
      setAppointments(
        data.map((a: any) => ({
          id: a.id,
          cliente_nome: a.clientes?.nome || '',
          servico_nome: a.servicos?.nome || '',
          profissional_nome: a.profissionais?.nome || '',
          data_hora: a.data_hora,
          status: a.status,
        }))
      );
    }
    setLoading(false);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Agendamentos</h1>
          <p className="text-gray-400">Visualize, crie e gerencie seus agendamentos facilmente.</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold">+ Novo Agendamento</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 p-4 bg-zinc-900">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="rounded-lg shadow"
            tileClassName={({ date }) =>
              date.toDateString() === selectedDate.toDateString()
                ? 'bg-purple-600 text-white' : ''
            }
          />
        </Card>
        <Card className="p-4 bg-zinc-900">
          <h2 className="text-lg font-semibold mb-4 text-white">Próximos Agendamentos</h2>
          {loading ? (
            <p className="text-gray-400">Carregando...</p>
          ) : appointments.length === 0 ? (
            <p className="text-gray-400">Nenhum agendamento para o dia selecionado.</p>
          ) : (
            <ul className="divide-y divide-zinc-800">
              {appointments.map((a) => (
                <li key={a.id} className="py-2">
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">{a.cliente_nome}</span>
                    <span className="text-gray-400 text-sm">{a.servico_nome} com {a.profissional_nome}</span>
                    <span className="text-gray-500 text-xs">{new Date(a.data_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-xs text-purple-400">{a.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AppointmentsPage;
