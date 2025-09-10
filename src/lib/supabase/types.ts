export interface Database {
  public: {
    Tables: {
      estabelecimentos: {
        Row: {
          id: string;
          nome: string;
          tipo_servico: string;
          telefone: string;
          email: string;
          endereco: string;
          whatsapp: string;
          horario_funcionamento: any;
          ativo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          tipo_servico: string;
          telefone: string;
          email: string;
          endereco: string;
          whatsapp: string;
          horario_funcionamento?: any;
          ativo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          tipo_servico?: string;
          telefone?: string;
          email?: string;
          endereco?: string;
          whatsapp?: string;
          horario_funcionamento?: any;
          ativo?: boolean;
          updated_at?: string;
        };
      };
      profissionais: {
        Row: {
          id: string;
          estabelecimento_id: string;
          nome: string;
          email: string;
          telefone: string;
          especialidades: string[];
          horario_trabalho: any;
          ativo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          estabelecimento_id: string;
          nome: string;
          email: string;
          telefone: string;
          especialidades: string[];
          horario_trabalho?: any;
          ativo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          estabelecimento_id?: string;
          nome?: string;
          email?: string;
          telefone?: string;
          especialidades?: string[];
          horario_trabalho?: any;
          ativo?: boolean;
          updated_at?: string;
        };
      };
      servicos: {
        Row: {
          id: string;
          estabelecimento_id: string;
          nome: string;
          descricao: string;
          preco: number;
          duracao_minutos: number;
          categoria: string;
          ativo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          estabelecimento_id: string;
          nome: string;
          descricao: string;
          preco: number;
          duracao_minutos: number;
          categoria: string;
          ativo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          estabelecimento_id?: string;
          nome?: string;
          descricao?: string;
          preco?: number;
          duracao_minutos?: number;
          categoria?: string;
          ativo?: boolean;
          updated_at?: string;
        };
      };
      clientes: {
        Row: {
          id: string;
          estabelecimento_id: string;
          nome: string;
          email: string;
          telefone: string;
          data_nascimento: string | null;
          endereco: string | null;
          observacoes: string | null;
          ativo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          estabelecimento_id: string;
          nome: string;
          email: string;
          telefone: string;
          data_nascimento?: string | null;
          endereco?: string | null;
          observacoes?: string | null;
          ativo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          estabelecimento_id?: string;
          nome?: string;
          email?: string;
          telefone?: string;
          data_nascimento?: string | null;
          endereco?: string | null;
          observacoes?: string | null;
          ativo?: boolean;
          updated_at?: string;
        };
      };
      agendamentos: {
        Row: {
          id: string;
          estabelecimento_id: string;
          cliente_id: string;
          profissional_id: string;
          servico_id: string;
          data_hora: string;
          status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado' | 'nao_compareceu';
          valor_total: number;
          observacoes: string | null;
          whatsapp_enviado: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          estabelecimento_id: string;
          cliente_id: string;
          profissional_id: string;
          servico_id: string;
          data_hora: string;
          status?: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado' | 'nao_compareceu';
          valor_total: number;
          observacoes?: string | null;
          whatsapp_enviado?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          estabelecimento_id?: string;
          cliente_id?: string;
          profissional_id?: string;
          servico_id?: string;
          data_hora?: string;
          status?: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado' | 'nao_compareceu';
          valor_total?: number;
          observacoes?: string | null;
          whatsapp_enviado?: boolean;
          updated_at?: string;
        };
      };
      fidelidade: {
        Row: {
          id: string;
          cliente_id: string;
          pontos_totais: number;
          pontos_disponiveis: number;
          nivel: string;
          historico_pontos: any[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cliente_id: string;
          pontos_totais?: number;
          pontos_disponiveis?: number;
          nivel?: string;
          historico_pontos?: any[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cliente_id?: string;
          pontos_totais?: number;
          pontos_disponiveis?: number;
          nivel?: string;
          historico_pontos?: any[];
          updated_at?: string;
        };
      };
      usuarios: {
        Row: {
          id: string;
          estabelecimento_id: string;
          email: string;
          password_hash: string;
          nome: string;
          role: 'admin' | 'gerente' | 'atendente';
          ativo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          estabelecimento_id: string;
          email: string;
          password_hash: string;
          nome: string;
          role?: 'admin' | 'gerente' | 'atendente';
          ativo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          estabelecimento_id?: string;
          email?: string;
          password_hash?: string;
          nome?: string;
          role?: 'admin' | 'gerente' | 'atendente';
          ativo?: boolean;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}