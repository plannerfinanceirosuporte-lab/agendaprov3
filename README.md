# Plataforma SaaS de Agendamento Online - AgendaPro

Uma plataforma completa de agendamento online voltada para negócios de serviços como salões de beleza, clínicas, academias e outros estabelecimentos que precisam gerenciar agendamentos, clientes e profissionais.

## 🚀 Funcionalidades Principais

### ✅ **Implementadas na Primeira Etapa**
- **Banco de Dados Completo**: PostgreSQL via Supabase com 7 tabelas principais
- **APIs RESTful Seguras**: Todas as operações CRUD implementadas
- **Sistema de Autenticação**: JWT com diferentes níveis de acesso
- **Row Level Security (RLS)**: Segurança completa no banco de dados
- **Dashboard Administrativo**: Interface moderna e responsiva
- **Sistema Multi-tenant**: Isolamento completo por estabelecimento

### 🏗️ **Estrutura do Banco de Dados**

#### Tabelas Principais:
1. **estabelecimentos** - Dados dos negócios
2. **usuarios** - Sistema de usuários com roles
3. **profissionais** - Profissionais que prestam serviços
4. **servicos** - Catálogo de serviços
5. **clientes** - Base de clientes
6. **agendamentos** - Registro de agendamentos
7. **fidelidade** - Sistema de pontos e recompensas

### 🔐 **Segurança Implementada**
- Autenticação via JWT
- Row Level Security (RLS) em todas as tabelas
- Validação de dados com Zod
- Middleware de autenticação para APIs
- Controle de acesso por roles (admin, gerente, atendente)

### 🎯 **APIs Disponíveis**

#### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de usuário

#### Estabelecimentos
- `GET /api/estabelecimentos` - Listar estabelecimentos
- `POST /api/estabelecimentos` - Criar estabelecimento

#### Profissionais
- `GET /api/profissionais` - Listar profissionais
- `POST /api/profissionais` - Criar profissional

#### Serviços
- `GET /api/servicos` - Listar serviços
- `POST /api/servicos` - Criar serviço

#### Clientes
- `GET /api/clientes` - Listar clientes (com dados de fidelidade)
- `POST /api/clientes` - Criar cliente

#### Agendamentos
- `GET /api/agendamentos` - Listar agendamentos
- `POST /api/agendamentos` - Criar agendamento
- `PUT /api/agendamentos/[id]` - Atualizar agendamento
- `DELETE /api/agendamentos/[id]` - Cancelar agendamento

#### Dashboard
- `GET /api/dashboard/stats` - Estatísticas do dashboard

## 🛠️ **Tecnologias Utilizadas**

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de Dados**: PostgreSQL (Supabase)
- **Autenticação**: JWT, bcryptjs
- **Validação**: Zod
- **Datas**: date-fns
- **Icons**: Lucide React

## 📋 **Configuração do Ambiente**

1. **Configure o Supabase**:
   - Clique em "Connect to Supabase" no canto superior direito
   - Configure suas variáveis de ambiente

2. **Execute as migrações**:
   - As migrações SQL estão em `/supabase/migrations/`
   - Execute no Supabase SQL Editor

3. **Configure as variáveis de ambiente**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
   SUPABASE_SERVICE_ROLE_KEY=sua-chave-de-servico
   JWT_SECRET=sua-chave-secreta-jwt
   ```

## 🚀 **Como Usar**

### Exemplo de Uso das APIs

#### 1. Fazer Login
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@empresa.com',
    password: 'senha123'
  })
});

const { token, user } = await response.json();
```

#### 2. Criar um Cliente
```javascript
const response = await fetch('/api/clientes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '(11) 99999-9999'
  })
});
```

#### 3. Criar um Agendamento
```javascript
const response = await fetch('/api/agendamentos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    cliente_id: 'uuid-do-cliente',
    profissional_id: 'uuid-do-profissional',
    servico_id: 'uuid-do-servico',
    data_hora: '2024-01-15T14:00:00Z',
    valor_total: 85.00
  })
});
```

## 🎨 **Interface do Dashboard**

A interface atual inclui:
- **Sidebar de Navegação**: Menu lateral com todas as seções
- **Dashboard Principal**: Estatísticas em tempo real
- **Cards de Estatísticas**: Agendamentos, clientes, receita
- **Lista de Próximos Agendamentos**: Visão dos agendamentos do dia
- **Ações Rápidas**: Botões para operações frequentes
- **Status do Sistema**: Monitoramento em tempo real

## 🔜 **Próximas Etapas**

### Desenvolvimento Frontend
- [ ] Formulários completos para CRUD
- [ ] Calendário de agendamentos
- [ ] Gestão de horários disponíveis
- [ ] Sistema de notificações

### Integrações
- [ ] WhatsApp API para confirmações
- [ ] Sistema de pagamentos (Stripe/PagSeguro)
- [ ] Notificações por email
- [ ] Relatórios avançados

### Funcionalidades Avançadas
- [ ] Sistema de recorrência
- [ ] Gestão de filas de espera
- [ ] App móvel para clientes
- [ ] Integração com calendários externos

## 📖 **Documentação da API**

Todas as APIs seguem padrões REST e retornam JSON. Exemplos completos de uso estão disponíveis nos arquivos de rota em `/src/app/api/`.

### Códigos de Status
- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Erro de validação
- `401` - Não autorizado
- `403` - Acesso negado
- `404` - Não encontrado
- `500` - Erro interno do servidor

---

**AgendaPro** - Transformando a gestão de agendamentos em uma experiência simples e eficiente.