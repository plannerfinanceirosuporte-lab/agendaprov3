import { supabase } from './supabase/client';
import { startOfMonth, endOfMonth, format } from 'date-fns';

import type { Database } from './supabase/types';

type Tables = Database['public']['Tables'];
type Cliente = Tables['clientes']['Row'];
type Agendamento = Tables['agendamentos']['Row'];
type Servico = Tables['servicos']['Row'];
type Profissional = Tables['profissionais']['Row'];

class ApiClient {
  private currentUser: any = null;
  private currentToken: string | null = null;

  setAuth(user: any, token: string) {
    this.currentUser = user;
    this.currentToken = token;
  }

  // Auth
  async login(email: string, password: string): Promise<any> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Get user profile from usuarios table
    const { data: userProfile, error: profileError } = await supabase
      .from('usuarios')
      .select(`
        *,
        estabelecimentos (
          id,
          nome,
          tipo_servico
        )
      `)
      .eq('email', email)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
    }

    return {
      user: {
        id: userProfile?.id || data.user.id,
        nome: userProfile?.nome || data.user.user_metadata?.nome || 'Usuário',
        email: data.user.email,
        role: userProfile?.role || 'admin',
        estabelecimentoId: userProfile?.estabelecimento_id
      },
      token: data.session?.access_token,
      message: 'Login realizado com sucesso'
    };
  }

  async register(userData: { email: string; password: string; nome: string }) {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          nome: userData.nome,
        }
      }
    });

    if (error) throw error;
    return data;
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // Clientes
  async getClientes(): Promise<{ clientes: any[] }> {
    if (!this.currentUser?.estabelecimentoId) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase
      .from('clientes')
      .select(`
        *,
        fidelidade (
          pontos_totais,
          pontos_disponiveis,
          nivel
        )
      `)
      .eq('estabelecimento_id', this.currentUser.estabelecimentoId)
      .eq('ativo', true)
      .order('nome');

    if (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
    
    return { clientes: data || [] };
  }

  async createCliente(clienteData: any): Promise<{ cliente: any }> {
    if (!this.currentUser?.estabelecimentoId) {
      throw new Error('Usuário não autenticado');
    }

    const cliente = {
      ...clienteData,
      estabelecimento_id: this.currentUser.estabelecimentoId,
    };

    const { data, error } = await supabase
      .from('clientes')
      .insert([cliente])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }

    // Create fidelidade record
    const { error: fidelidadeError } = await supabase
      .from('fidelidade')
      .insert([{ cliente_id: data.id }]);

    if (fidelidadeError) {
      console.error('Erro ao criar fidelidade:', fidelidadeError);
    }

    return { cliente: data };
  }

  async updateCliente(id: string, updates: any): Promise<{ cliente: any }> {
    const { data, error } = await supabase
      .from('clientes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
    
    return { cliente: data };
  }

  async deleteCliente(id: string): Promise<void> {
    const { error } = await supabase
      .from('clientes')
      .update({ ativo: false })
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar cliente:', error);
      throw error;
    }
  }

  // Serviços
  async getServicos(): Promise<{ servicos: any[] }> {
    if (!this.currentUser?.estabelecimentoId) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .eq('estabelecimento_id', this.currentUser.estabelecimentoId)
      .eq('ativo', true)
      .order('nome');

    if (error) {
      console.error('Erro ao buscar serviços:', error);
      throw error;
    }
    
    return { servicos: data || [] };
  }

  async createServico(servicoData: any): Promise<{ servico: any }> {
    if (!this.currentUser?.estabelecimentoId) {
      throw new Error('Usuário não autenticado');
    }

    const servico = {
      ...servicoData,
      estabelecimento_id: this.currentUser.estabelecimentoId,
    };

    const { data, error } = await supabase
      .from('servicos')
      .insert([servico])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar serviço:', error);
      throw error;
    }
    
    return { servico: data };
  }

  async updateServico(id: string, updates: any): Promise<{ servico: any }> {
    const { data, error } = await supabase
      .from('servicos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar serviço:', error);
      throw error;
    }
    
    return { servico: data };
  }

  async deleteServico(id: string): Promise<void> {
    const { error } = await supabase
      .from('servicos')
      .update({ ativo: false })
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar serviço:', error);
      throw error;
    }
  }

  // Profissionais
  async getProfissionais(): Promise<{ profissionais: any[] }> {
    if (!this.currentUser?.estabelecimentoId) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase
      .from('profissionais')
      .select('*')
      .eq('estabelecimento_id', this.currentUser.estabelecimentoId)
      .eq('ativo', true)
      .order('nome');

    if (error) {
      console.error('Erro ao buscar profissionais:', error);
      throw error;
    }
    
    return { profissionais: data || [] };
  }

  async createProfissional(profissionalData: any): Promise<{ profissional: any }> {
    if (!this.currentUser?.estabelecimentoId) {
      throw new Error('Usuário não autenticado');
    }

    const profissional = {
      ...profissionalData,
      estabelecimento_id: this.currentUser.estabelecimentoId,
    };

    const { data, error } = await supabase
      .from('profissionais')
      .insert([profissional])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar profissional:', error);
      throw error;
    }
    
    return { profissional: data };
  }

  async updateProfissional(id: string, updates: any): Promise<{ profissional: any }> {
    const { data, error } = await supabase
      .from('profissionais')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar profissional:', error);
      throw error;
    }
    
    return { profissional: data };
  }

  async deleteProfissional(id: string): Promise<void> {
    const { error } = await supabase
      .from('profissionais')
      .update({ ativo: false })
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar profissional:', error);
      throw error;
    }
  }

  // Agendamentos
  async getAgendamentos(filters?: any): Promise<{ agendamentos: any[] }> {
    if (!this.currentUser?.estabelecimentoId) {
      throw new Error('Usuário não autenticado');
    }

    let query = supabase
      .from('agendamentos')
      .select(`
        *,
        clientes (
          id,
          nome,
          telefone,
          email
        ),
        profissionais (
          id,
          nome
        ),
        servicos (
          id,
          nome,
          preco,
          duracao_minutos
        )
      `)
      .eq('estabelecimento_id', this.currentUser.estabelecimentoId)
      .order('data_hora', { ascending: true });

    if (filters?.data_inicio) {
      query = query.gte('data_hora', filters.data_inicio);
    }

    if (filters?.data_fim) {
      query = query.lte('data_hora', filters.data_fim);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar agendamentos:', error);
      throw error;
    }
    
    return { agendamentos: data || [] };
  }

  async createAgendamento(agendamentoData: any): Promise<{ agendamento: any }> {
    if (!this.currentUser?.estabelecimentoId) {
      throw new Error('Usuário não autenticado');
    }

    const agendamento = {
      ...agendamentoData,
      estabelecimento_id: this.currentUser.estabelecimentoId,
    };

    // Check for conflicts
    const { data: conflitos } = await supabase
      .from('agendamentos')
      .select('id')
      .eq('profissional_id', agendamento.profissional_id)
      .eq('data_hora', agendamento.data_hora)
      .neq('status', 'cancelado');

    if (conflitos && conflitos.length > 0) {
      throw new Error('Horário já ocupado para este profissional');
    }

    const { data, error } = await supabase
      .from('agendamentos')
      .insert([agendamento])
      .select(`
        *,
        clientes (id, nome, telefone, email),
        profissionais (id, nome),
        servicos (id, nome, preco, duracao_minutos)
      `)
      .single();

    if (error) {
      console.error('Erro ao criar agendamento:', error);
      throw error;
    }
    
    return { agendamento: data };
  }

  async updateAgendamento(id: string, updates: any): Promise<{ agendamento: any }> {
    const { data, error } = await supabase
      .from('agendamentos')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        clientes (id, nome, telefone, email),
        profissionais (id, nome),
        servicos (id, nome, preco, duracao_minutos)
      `)
      .single();

    if (error) {
      console.error('Erro ao atualizar agendamento:', error);
      throw error;
    }
    
    return { agendamento: data };
  }

  async deleteAgendamento(id: string): Promise<void> {
    const { error } = await supabase
      .from('agendamentos')
      .update({ status: 'cancelado' })
      .eq('id', id);

    if (error) {
      console.error('Erro ao cancelar agendamento:', error);
      throw error;
    }
  }

  // Dashboard
  async getStats(): Promise<any> {
    if (!this.currentUser?.estabelecimentoId) {
      throw new Error('Usuário não autenticado');
    }

    const hoje = new Date();
    const inicioMes = startOfMonth(hoje);
    const fimMes = endOfMonth(hoje);

    // Agendamentos hoje
    const { data: agendamentosHoje } = await supabase
      .from('agendamentos')
      .select('id, status')
      .eq('estabelecimento_id', this.currentUser.estabelecimentoId)
      .gte('data_hora', format(hoje, 'yyyy-MM-dd'))
      .lt('data_hora', format(new Date(hoje.getTime() + 86400000), 'yyyy-MM-dd'));

    // Agendamentos do mês
    const { data: agendamentosMes } = await supabase
      .from('agendamentos')
      .select('id, valor_total, status')
      .eq('estabelecimento_id', this.currentUser.estabelecimentoId)
      .gte('data_hora', inicioMes.toISOString())
      .lte('data_hora', fimMes.toISOString());

    // Clientes totais
    const { data: clientes } = await supabase
      .from('clientes')
      .select('id')
      .eq('estabelecimento_id', this.currentUser.estabelecimentoId)
      .eq('ativo', true);

    // Receita do mês
    const receitaMes = agendamentosMes
      ?.filter(a => a.status === 'concluido')
      ?.reduce((acc, curr) => acc + Number(curr.valor_total), 0) || 0;

    return {
      stats: {
        agendamentosHoje: agendamentosHoje?.length || 0,
        agendamentosMes: agendamentosMes?.length || 0,
        clientesTotal: clientes?.length || 0,
        receitaMes,
        agendamentosPendentes: agendamentosHoje?.filter(a => a.status === 'agendado').length || 0,
      }
    };
  }
}

export const api = new ApiClient();