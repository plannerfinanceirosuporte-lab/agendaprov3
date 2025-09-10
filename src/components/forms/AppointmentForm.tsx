import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { api } from '../../lib/api';
import { useStore } from '../../store/useStore';

const agendamentoSchema = z.object({
  cliente_id: z.string().min(1, 'Cliente é obrigatório'),
  profissional_id: z.string().min(1, 'Profissional é obrigatório'),
  servico_id: z.string().min(1, 'Serviço é obrigatório'),
  data_hora: z.string().min(1, 'Data e hora são obrigatórias'),
  observacoes: z.string().optional(),
});

type AgendamentoFormData = z.infer<typeof agendamentoSchema>;

interface AppointmentFormProps {
  agendamento?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function AppointmentForm({ agendamento, onClose, onSuccess }: AppointmentFormProps) {
  const { clientes, profissionais, servicos, setLoading } = useStore();
  const isEditing = !!agendamento;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AgendamentoFormData>({
    resolver: zodResolver(agendamentoSchema),
    defaultValues: agendamento || {},
  });

  const servicoSelecionado = watch('servico_id');
  const servico = servicos.find(s => s.id === servicoSelecionado);

  useEffect(() => {
    // Load data if not already loaded
    const loadData = async () => {
      try {
        if (clientes.length === 0) {
          const clientesResponse = await api.getClientes();
          // Update store with clientes
        }
        if (profissionais.length === 0) {
          const profissionaisResponse = await api.getProfissionais();
          // Update store with profissionais
        }
        if (servicos.length === 0) {
          const servicosResponse = await api.getServicos();
          // Update store with servicos
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    
    loadData();
  }, []);

  const onSubmit = async (data: AgendamentoFormData) => {
    setLoading(true);
    try {
      const agendamentoData = {
        ...data,
        valor_total: servico?.preco || 0,
        status: 'agendado' as const,
      };

      if (isEditing) {
        await api.updateAgendamento(agendamento.id, agendamentoData);
        toast.success('Agendamento atualizado com sucesso!');
      } else {
        await api.createAgendamento(agendamentoData);
        toast.success('Agendamento criado com sucesso!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar agendamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>
          {isEditing ? 'Editar Agendamento' : 'Novo Agendamento'}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Cliente *
          </label>
          <Select onValueChange={(value) => setValue('cliente_id', value)}>
            <SelectTrigger className={errors.cliente_id ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione um cliente" />
            </SelectTrigger>
            <SelectContent>
              {clientes.map((cliente) => (
                <SelectItem key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.cliente_id && (
            <p className="text-red-400 text-sm mt-1">{errors.cliente_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Profissional *
          </label>
          <Select onValueChange={(value) => setValue('profissional_id', value)}>
            <SelectTrigger className={errors.profissional_id ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione um profissional" />
            </SelectTrigger>
            <SelectContent>
              {profissionais.map((profissional) => (
                <SelectItem key={profissional.id} value={profissional.id}>
                  {profissional.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.profissional_id && (
            <p className="text-red-400 text-sm mt-1">{errors.profissional_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Serviço *
          </label>
          <Select onValueChange={(value) => setValue('servico_id', value)}>
            <SelectTrigger className={errors.servico_id ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione um serviço" />
            </SelectTrigger>
            <SelectContent>
              {servicos.map((servico) => (
                <SelectItem key={servico.id} value={servico.id}>
                  {servico.nome} - R$ {Number(servico.preco).toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.servico_id && (
            <p className="text-red-400 text-sm mt-1">{errors.servico_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Data e Hora *
          </label>
          <Input
            {...register('data_hora')}
            type="datetime-local"
            className={errors.data_hora ? 'border-red-500' : ''}
          />
          {errors.data_hora && (
            <p className="text-red-400 text-sm mt-1">{errors.data_hora.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Observações
          </label>
          <Input
            {...register('observacoes')}
            placeholder="Observações sobre o agendamento"
          />
        </div>

        {servico && (
          <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl backdrop-blur-sm">
            <p className="text-sm text-primary-400 font-semibold">
              Valor: R$ {Number(servico.preco).toFixed(2)} • Duração: {servico.duracao_minutos}min
            </p>
          </div>
        )}

        <DialogFooter className="pt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}