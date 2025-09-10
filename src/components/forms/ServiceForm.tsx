import React from 'react';
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

const servicoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  descricao: z.string().min(5, 'Descrição deve ter pelo menos 5 caracteres'),
  preco: z.number().positive('Preço deve ser positivo'),
  duracao_minutos: z.number().positive('Duração deve ser positiva'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
});

type ServicoFormData = z.infer<typeof servicoSchema>;

interface ServiceFormProps {
  servico?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const categorias = [
  'Cabelo',
  'Unha',
  'Pele',
  'Massagem',
  'Depilação',
  'Sobrancelha',
  'Estética',
  'Outros'
];

export function ServiceForm({ servico, onClose, onSuccess }: ServiceFormProps) {
  const { setLoading } = useStore();
  const isEditing = !!servico;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ServicoFormData>({
    resolver: zodResolver(servicoSchema),
    defaultValues: servico ? {
      ...servico,
      preco: Number(servico.preco),
    } : {},
  });

  const onSubmit = async (data: ServicoFormData) => {
    setLoading(true);
    try {
      if (isEditing) {
        await api.updateServico(servico.id, data);
        toast.success('Serviço atualizado com sucesso!');
      } else {
        await api.createServico(data);
        toast.success('Serviço criado com sucesso!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar serviço');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>
          {isEditing ? 'Editar Serviço' : 'Novo Serviço'}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Nome *
          </label>
          <Input
            {...register('nome')}
            placeholder="Nome do serviço"
            className={errors.nome ? 'border-red-500' : ''}
          />
          {errors.nome && (
            <p className="text-red-400 text-sm mt-1">{errors.nome.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Descrição *
          </label>
          <Input
            {...register('descricao')}
            placeholder="Descrição do serviço"
            className={errors.descricao ? 'border-red-500' : ''}
          />
          {errors.descricao && (
            <p className="text-red-400 text-sm mt-1">{errors.descricao.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Preço (R$) *
            </label>
            <Input
              {...register('preco', { valueAsNumber: true })}
              type="number"
              step="0.01"
              placeholder="0.00"
              className={errors.preco ? 'border-red-500' : ''}
            />
            {errors.preco && (
              <p className="text-red-400 text-sm mt-1">{errors.preco.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Duração (min) *
            </label>
            <Input
              {...register('duracao_minutos', { valueAsNumber: true })}
              type="number"
              placeholder="60"
              className={errors.duracao_minutos ? 'border-red-500' : ''}
            />
            {errors.duracao_minutos && (
              <p className="text-red-400 text-sm mt-1">{errors.duracao_minutos.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Categoria *
          </label>
          <Select onValueChange={(value) => setValue('categoria', value)}>
            <SelectTrigger className={errors.categoria ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((categoria) => (
                <SelectItem key={categoria} value={categoria}>
                  {categoria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoria && (
            <p className="text-red-400 text-sm mt-1">{errors.categoria.message}</p>
          )}
        </div>

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