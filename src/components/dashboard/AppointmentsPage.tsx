
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
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
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAppointments(selectedDate);
  }, [selectedDate]);

  async function fetchAppointments(dateStr: string) {
    setLoading(true);
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`id, data_hora, status, clientes (nome), servicos (nome), profissionais (nome)`)
      .gte('data_hora', `${dateStr}T00:00:00.000Z`)
      .lte('data_hora', `${dateStr}T23:59:59.999Z`)
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

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedDate(e.target.value);
  }

  // Cards de resumo (mock, substitua por dados reais se quiser)
  const resumo = [
    { label: 'Agendamentos Hoje', value: appointments.length, icon: '📅', color: 'bg-purple-600' },
    { label: 'Total de Clientes', value: '-', icon: '👥', color: 'bg-yellow-600' },
    { label: 'Receita do Dia', value: 'R$ 0,00', icon: '💰', color: 'bg-red-600' },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Agendamentos</h1>
          <p className="text-gray-400">Visão geral dos agendamentos do seu negócio.</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold">+ Novo Agendamento</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {resumo.map((card) => (
          <Card key={card.label} className={`flex items-center gap-4 p-4 ${card.color} text-white`}>
            <span className="text-2xl">{card.icon}</span>
            <div>
              <div className="text-lg font-bold">{card.value}</div>
              <div className="text-xs opacity-80">{card.label}</div>
            </div>
          </Card>
        ))}
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="p-4 bg-zinc-900 w-full md:w-1/3">
          <label className="block text-gray-400 mb-2">Selecione o dia</label>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full p-2 rounded bg-zinc-800 text-white border border-zinc-700"
          />
        </Card>
        <Card className="p-4 bg-zinc-900 w-full md:w-2/3">
          <h2 className="text-lg font-semibold mb-4 text-white">Agendamentos do Dia</h2>
          {loading ? (
            <p className="text-gray-400">Carregando...</p>
          ) : appointments.length === 0 ? (
            <p className="text-gray-400">Nenhum agendamento para o dia selecionado.</p>
          ) : (
            <ul className="divide-y divide-zinc-800">
              {appointments.map((a) => {
                let hora = 'Data inválida';
                if (a.data_hora) {
                  const d = new Date(a.data_hora);
                  if (!isNaN(d.getTime())) {
                    hora = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  }
                }
                return (
                  <li key={a.id} className="py-2">
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">{a.cliente_nome}</span>
                      <span className="text-gray-400 text-sm">{a.servico_nome} com {a.profissional_nome}</span>
                      <span className="text-gray-500 text-xs">{hora}</span>
                      <span className="text-xs text-purple-400">{a.status}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AppointmentsPage;
