import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { api } from '../../lib/api';
import { useStore } from '../../store/useStore';

const clienteSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  endereco: z.string().optional(),
  data_nascimento: z.string().optional(),
  observacoes: z.string().optional(),
});

type ClienteFormData = z.infer<typeof clienteSchema>;

interface ClientFormProps {
  cliente?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function ClientForm({ cliente, onClose, onSuccess }: ClientFormProps) {
  const { setLoading } = useStore();
  const isEditing = !!cliente;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: cliente || {},
  });

  const onSubmit = async (data: ClienteFormData) => {
    setLoading(true);
    try {
      if (isEditing) {
        await api.updateCliente(cliente.id, data);
        toast.success('Cliente atualizado com sucesso!');
      } else {
        await api.createCliente(data);
        toast.success('Cliente criado com sucesso!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>
          {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Nome *
          </label>
          <Input
            {...register('nome')}
            placeholder="Nome completo"
            className={errors.nome ? 'border-red-500' : ''}
          />
          {errors.nome && (
            <p className="text-red-400 text-sm mt-1">{errors.nome.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Email *
          </label>
          <Input
            {...register('email')}
            type="email"
            placeholder="email@exemplo.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Telefone *
          </label>
          <Input
            {...register('telefone')}
            placeholder="(11) 99999-9999"
            className={errors.telefone ? 'border-red-500' : ''}
          />
          {errors.telefone && (
            <p className="text-red-400 text-sm mt-1">{errors.telefone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Data de Nascimento
          </label>
          <Input
            {...register('data_nascimento')}
            type="date"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Endereço
          </label>
          <Input
            {...register('endereco')}
            placeholder="Rua, número, bairro"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            Observações
          </label>
          <Input
            {...register('observacoes')}
            placeholder="Observações sobre o cliente"
          />
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