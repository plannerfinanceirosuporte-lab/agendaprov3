import { create } from 'zustand';

interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
  estabelecimentoId: string;
}

interface Agendamento {
  id: string;
  data_hora: string;
  status: string;
  cliente_id: string;
  profissional_id: string;
  servico_id: string;
  valor_total: number;
  observacoes?: string;
  clientes?: { nome: string; telefone: string; email: string };
  profissionais?: { nome: string };
  servicos?: { nome: string; duracao_minutos: number };
}

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  data_nascimento?: string;
  endereco?: string;
  observacoes?: string;
}

interface Profissional {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  especialidades: string[];
  horario_trabalho: any;
}

interface Servico {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracao_minutos: number;
  categoria: string;
}

interface Stats {
  agendamentosHoje: number;
  agendamentosMes: number;
  clientesTotal: number;
  receitaMes: number;
  agendamentosPendentes: number;
}

interface AppState {
  // Auth
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Data
  agendamentos: Agendamento[];
  clientes: Cliente[];
  profissionais: Profissional[];
  servicos: Servico[];
  stats: Stats | null;
  
  // UI State
  isLoading: boolean;
  currentView: string;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setAgendamentos: (agendamentos: Agendamento[]) => void;
  setClientes: (clientes: Cliente[]) => void;
  setProfissionais: (profissionais: Profissional[]) => void;
  setServicos: (servicos: Servico[]) => void;
  setStats: (stats: Stats) => void;
  setLoading: (loading: boolean) => void;
  setCurrentView: (view: string) => void;
  logout: () => void;
}

export const useStore = create<AppState>((set) => ({
  // Initial state
  user: null,
  token: null,
  isAuthenticated: false,
  agendamentos: [],
  clientes: [],
  profissionais: [],
  servicos: [],
  stats: null,
  isLoading: false,
  currentView: 'dashboard',
  
  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => set({ token }),
  setAgendamentos: (agendamentos) => set({ agendamentos }),
  setClientes: (clientes) => set({ clientes }),
  setProfissionais: (profissionais) => set({ profissionais }),
  setServicos: (servicos) => set({ servicos }),
  setStats: (stats) => set({ stats }),
  setLoading: (isLoading) => set({ isLoading }),
  setCurrentView: (currentView) => set({ currentView }),
  logout: () => set({ 
    user: null, 
    token: null, 
    isAuthenticated: false,
    agendamentos: [],
    clientes: [],
    profissionais: [],
    servicos: [],
    stats: null
  }),
}));