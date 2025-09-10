import { z } from 'zod';

// Estabelecimento schemas
export const estabelecimentoSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  tipo_servico: z.string().min(2, 'Tipo de serviço é obrigatório'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  email: z.string().email('Email inválido'),
  endereco: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  whatsapp: z.string().min(10, 'WhatsApp deve ter pelo menos 10 dígitos'),
  horario_funcionamento: z.any().optional(),
});

export const updateEstabelecimentoSchema = estabelecimentoSchema.partial();

// Profissional schemas
export const profissionalSchema = z.object({
  estabelecimento_id: z.string().uuid(),
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  especialidades: z.array(z.string()).default([]),
  horario_trabalho: z.any().optional(),
});

export const updateProfissionalSchema = profissionalSchema.partial();

// Serviço schemas
export const servicoSchema = z.object({
  estabelecimento_id: z.string().uuid(),
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  descricao: z.string().min(5, 'Descrição deve ter pelo menos 5 caracteres'),
  preco: z.number().positive('Preço deve ser positivo'),
  duracao_minutos: z.number().positive('Duração deve ser positiva'),
  categoria: z.string().min(2, 'Categoria é obrigatória'),
});

export const updateServicoSchema = servicoSchema.partial();

// Cliente schemas
export const clienteSchema = z.object({
  estabelecimento_id: z.string().uuid(),
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  data_nascimento: z.string().nullable().optional(),
  endereco: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
});

export const updateClienteSchema = clienteSchema.partial();

// Agendamento schemas
export const agendamentoSchema = z.object({
  estabelecimento_id: z.string().uuid(),
  cliente_id: z.string().uuid(),
  profissional_id: z.string().uuid(),
  servico_id: z.string().uuid(),
  data_hora: z.string().refine((date) => !isNaN(Date.parse(date)), 'Data inválida'),
  valor_total: z.number().positive('Valor deve ser positivo'),
  observacoes: z.string().nullable().optional(),
});

export const updateAgendamentoSchema = agendamentoSchema.partial().extend({
  status: z.enum(['agendado', 'confirmado', 'em_andamento', 'concluido', 'cancelado', 'nao_compareceu']).optional(),
});

// Usuario schemas
export const usuarioSchema = z.object({
  estabelecimento_id: z.string().uuid(),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  role: z.enum(['admin', 'gerente', 'atendente']).default('atendente'),
});

export const updateUsuarioSchema = usuarioSchema.partial().omit({ password: true });

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});