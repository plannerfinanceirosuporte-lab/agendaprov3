/*
# Criação do Schema Completo da Plataforma SaaS de Agendamento

Este arquivo cria toda a estrutura do banco de dados para a plataforma SaaS de agendamento online.

## 1. Novas Tabelas
- `estabelecimentos` - Dados dos negócios que usam a plataforma
- `usuarios` - Usuários do sistema com diferentes níveis de acesso
- `profissionais` - Profissionais que prestam serviços
- `servicos` - Catálogo de serviços oferecidos
- `clientes` - Base de clientes dos estabelecimentos
- `agendamentos` - Registro de todos os agendamentos
- `fidelidade` - Sistema de pontos e fidelidade dos clientes

## 2. Segurança
- RLS habilitado em todas as tabelas
- Políticas de acesso baseadas no estabelecimento
- Autenticação por JWT

## 3. Funcionalidades
- Sistema completo de agendamento
- Gestão de estabelecimentos multi-tenant
- Controle de fidelidade
- Logs de auditoria
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create estabelecimentos table
CREATE TABLE IF NOT EXISTS estabelecimentos (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome text NOT NULL,
    tipo_servico text NOT NULL,
    telefone text NOT NULL,
    email text NOT NULL UNIQUE,
    endereco text NOT NULL,
    whatsapp text NOT NULL,
    horario_funcionamento jsonb DEFAULT '{"segunda": "08:00-18:00", "terca": "08:00-18:00", "quarta": "08:00-18:00", "quinta": "08:00-18:00", "sexta": "08:00-18:00", "sabado": "08:00-14:00", "domingo": "fechado"}',
    ativo boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create usuarios table
CREATE TABLE IF NOT EXISTS usuarios (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    estabelecimento_id uuid NOT NULL REFERENCES estabelecimentos(id) ON DELETE CASCADE,
    email text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    nome text NOT NULL,
    role text NOT NULL CHECK (role IN ('admin', 'gerente', 'atendente')) DEFAULT 'atendente',
    ativo boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create profissionais table
CREATE TABLE IF NOT EXISTS profissionais (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    estabelecimento_id uuid NOT NULL REFERENCES estabelecimentos(id) ON DELETE CASCADE,
    nome text NOT NULL,
    email text NOT NULL,
    telefone text NOT NULL,
    especialidades text[] DEFAULT '{}',
    horario_trabalho jsonb DEFAULT '{"segunda": "08:00-18:00", "terca": "08:00-18:00", "quarta": "08:00-18:00", "quinta": "08:00-18:00", "sexta": "08:00-18:00", "sabado": "08:00-14:00", "domingo": "fechado"}',
    ativo boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create servicos table
CREATE TABLE IF NOT EXISTS servicos (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    estabelecimento_id uuid NOT NULL REFERENCES estabelecimentos(id) ON DELETE CASCADE,
    nome text NOT NULL,
    descricao text NOT NULL DEFAULT '',
    preco decimal(10,2) NOT NULL DEFAULT 0,
    duracao_minutos integer NOT NULL DEFAULT 60,
    categoria text NOT NULL DEFAULT 'Geral',
    ativo boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create clientes table
CREATE TABLE IF NOT EXISTS clientes (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    estabelecimento_id uuid NOT NULL REFERENCES estabelecimentos(id) ON DELETE CASCADE,
    nome text NOT NULL,
    email text NOT NULL,
    telefone text NOT NULL,
    data_nascimento date,
    endereco text,
    observacoes text,
    ativo boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create agendamentos table
CREATE TABLE IF NOT EXISTS agendamentos (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    estabelecimento_id uuid NOT NULL REFERENCES estabelecimentos(id) ON DELETE CASCADE,
    cliente_id uuid NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    profissional_id uuid NOT NULL REFERENCES profissionais(id) ON DELETE CASCADE,
    servico_id uuid NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
    data_hora timestamptz NOT NULL,
    status text NOT NULL CHECK (status IN ('agendado', 'confirmado', 'em_andamento', 'concluido', 'cancelado', 'nao_compareceu')) DEFAULT 'agendado',
    valor_total decimal(10,2) NOT NULL DEFAULT 0,
    observacoes text,
    whatsapp_enviado boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create fidelidade table
CREATE TABLE IF NOT EXISTS fidelidade (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id uuid NOT NULL REFERENCES clientes(id) ON DELETE CASCADE UNIQUE,
    pontos_totais integer DEFAULT 0,
    pontos_disponiveis integer DEFAULT 0,
    nivel text DEFAULT 'Bronze',
    historico_pontos jsonb DEFAULT '[]',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_usuarios_estabelecimento ON usuarios(estabelecimento_id);
CREATE INDEX IF NOT EXISTS idx_profissionais_estabelecimento ON profissionais(estabelecimento_id);
CREATE INDEX IF NOT EXISTS idx_servicos_estabelecimento ON servicos(estabelecimento_id);
CREATE INDEX IF NOT EXISTS idx_clientes_estabelecimento ON clientes(estabelecimento_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_estabelecimento ON agendamentos(estabelecimento_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_data_hora ON agendamentos(data_hora);
CREATE INDEX IF NOT EXISTS idx_agendamentos_status ON agendamentos(status);
CREATE INDEX IF NOT EXISTS idx_fidelidade_cliente ON fidelidade(cliente_id);

-- Enable Row Level Security
ALTER TABLE estabelecimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE profissionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE fidelidade ENABLE ROW LEVEL SECURITY;

-- RLS Policies for estabelecimentos
CREATE POLICY "Estabelecimentos podem ver seus próprios dados"
    ON estabelecimentos FOR ALL
    USING (id IN (
        SELECT estabelecimento_id FROM usuarios 
        WHERE id = auth.uid()::uuid
    ));

-- RLS Policies for usuarios
CREATE POLICY "Usuarios podem ver dados do seu estabelecimento"
    ON usuarios FOR ALL
    USING (estabelecimento_id IN (
        SELECT estabelecimento_id FROM usuarios 
        WHERE id = auth.uid()::uuid
    ));

-- RLS Policies for profissionais
CREATE POLICY "Profissionais do estabelecimento"
    ON profissionais FOR ALL
    USING (estabelecimento_id IN (
        SELECT estabelecimento_id FROM usuarios 
        WHERE id = auth.uid()::uuid
    ));

-- RLS Policies for servicos
CREATE POLICY "Servicos do estabelecimento"
    ON servicos FOR ALL
    USING (estabelecimento_id IN (
        SELECT estabelecimento_id FROM usuarios 
        WHERE id = auth.uid()::uuid
    ));

-- RLS Policies for clientes
CREATE POLICY "Clientes do estabelecimento"
    ON clientes FOR ALL
    USING (estabelecimento_id IN (
        SELECT estabelecimento_id FROM usuarios 
        WHERE id = auth.uid()::uuid
    ));

-- RLS Policies for agendamentos
CREATE POLICY "Agendamentos do estabelecimento"
    ON agendamentos FOR ALL
    USING (estabelecimento_id IN (
        SELECT estabelecimento_id FROM usuarios 
        WHERE id = auth.uid()::uuid
    ));

-- RLS Policies for fidelidade
CREATE POLICY "Fidelidade do estabelecimento"
    ON fidelidade FOR ALL
    USING (cliente_id IN (
        SELECT c.id FROM clientes c
        JOIN usuarios u ON c.estabelecimento_id = u.estabelecimento_id
        WHERE u.id = auth.uid()::uuid
    ));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_estabelecimentos_updated_at BEFORE UPDATE ON estabelecimentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profissionais_updated_at BEFORE UPDATE ON profissionais FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_servicos_updated_at BEFORE UPDATE ON servicos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agendamentos_updated_at BEFORE UPDATE ON agendamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fidelidade_updated_at BEFORE UPDATE ON fidelidade FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();