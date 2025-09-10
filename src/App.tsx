'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useStore } from './store/useStore';
import { api } from './lib/api';
import { supabase } from './lib/supabase/client';

// Layout Components
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// Page Components
import { LandingPage } from './components/landing/LandingPage';
import { LoginForm } from './components/auth/LoginForm';
import { StatsGrid } from './components/dashboard/StatsGrid';
import { RecentAppointments } from './components/dashboard/RecentAppointments';
import AppointmentsPage from './components/dashboard/AppointmentsPage';
import { ClientsManager } from './components/dashboard/ClientsManager';
import { ServicesManager } from './components/dashboard/ServicesManager';

// UI Components
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';

// Icons
import { Plus, Calendar, Users, Settings, BarChart3 } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const { 
    isAuthenticated, 
    user, 
    setUser,
    setToken,
    setClientes,
    setProfissionais,
    setServicos,
    stats, 
    setStats, 
    agendamentos, 
    setAgendamentos,
    currentView, 
    setCurrentView,
    isLoading,
    setLoading
  } = useStore();

  // Check for stored token on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // Try to restore user session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          // Fetch complete user profile from database
          supabase
            .from('usuarios')
            .select('id, nome, email, role, estabelecimento_id')
            .eq('id', session.user.id)
            .single()
            .then(({ data: userProfile, error }) => {
              if (error || !userProfile) {
                console.error('Erro ao buscar perfil do usuário:', error);
                localStorage.removeItem('token');
                setCurrentPage('login');
                return;
              }

              const user = {
                id: userProfile.id,
                nome: userProfile.nome,
                email: userProfile.email,
                role: userProfile.role,
                estabelecimentoId: userProfile.estabelecimento_id
              };

              // Set auth BEFORE setting user/token to prevent timing issues
              api.setAuth(user, session.access_token);
              setUser(user);
              setToken(session.access_token);
              setCurrentPage('dashboard');
              // Load data after authentication is properly set
              loadDashboardData();
              loadInitialData();
            });
        } else {
          localStorage.removeItem('token');
          setCurrentPage('login');
        }
      });
    } else {
      setCurrentPage('landing');
    }
  }, [setUser, setToken]);


  const loadInitialData = async () => {
    try {
      // Load clientes, profissionais, servicos for forms
      const [clientesResponse, profissionaisResponse, servicosResponse] = await Promise.all([
        api.getClientes(),
        api.getProfissionais(),
        api.getServicos()
      ]);
      
      setClientes(clientesResponse.clientes || []);
      setProfissionais(profissionaisResponse.profissionais || []);
      setServicos(servicosResponse.servicos || []);
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsResponse, agendamentosResponse] = await Promise.all([
        api.getStats(),
        api.getAgendamentos({
          data_inicio: new Date().toISOString().split('T')[0],
          data_fim: new Date().toISOString().split('T')[0],
        })
      ]);
      
      setStats(statsResponse.stats);
      setAgendamentos(agendamentosResponse.agendamentos || []);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderDashboardContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 mt-2">
                  Visão geral do seu negócio hoje, {new Date().toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Agendamento
              </Button>
            </div>

            <StatsGrid stats={stats || {
              agendamentosHoje: 0,
              agendamentosMes: 0,
              clientesTotal: 0,
              receitaMes: 0,
              agendamentosPendentes: 0
            }} isLoading={isLoading} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <RecentAppointments appointments={agendamentos} isLoading={isLoading} />
              </div>
              
              <div className="space-y-6">
                <Card title="Ações Rápidas" className="p-6">
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="w-4 h-4 mr-3" />
                      Novo Agendamento
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-3" />
                      Cadastrar Cliente
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-3" />
                      Configurações
                    </Button>
                  </div>
                </Card>

                <Card title="Status do Sistema" className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Sistema</span>
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
                        Online
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Backup</span>
                      <span className="text-xs text-gray-500">Última: hoje às 03:00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Sincronização</span>
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
                        Ativa
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        );

      case 'agendamentos':
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AppointmentsPage />
            </motion.div>
          );

      case 'clientes':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ClientsManager />
          </motion.div>
        );

      case 'servicos':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ServicesManager />
          </motion.div>
        );

      case 'profissionais':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">Profissionais</h1>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Novo Profissional
              </Button>
            </div>
            <Card className="p-8">
              <p className="text-gray-400 text-center py-8">
                Módulo de Profissionais em desenvolvimento.
                <br />
                APIs já configuradas para gestão completa.
              </p>
            </Card>
          </motion.div>
        );

      case 'relatorios':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h1 className="text-3xl font-bold text-white">Relatórios</h1>
            <Card className="p-8">
              <p className="text-gray-400 text-center py-8">
                Módulo de Relatórios em desenvolvimento.
                <br />
                APIs de estatísticas já disponíveis.
              </p>
            </Card>
          </motion.div>
        );

      case 'configuracoes':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h1 className="text-3xl font-bold text-white">Configurações</h1>
            <Card className="p-8">
              <p className="text-gray-400 text-center py-8">
                Módulo de Configurações em desenvolvimento.
                <br />
                Sistema de autenticação e permissões já implementado.
              </p>
            </Card>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // Landing Page
  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen bg-background">
        <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">AgendaPro</span>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost"
                  onClick={() => setCurrentPage('login')}
                >
                  Entrar
                </Button>
                <Button 
                  onClick={() => setCurrentPage('login')}
                >
                  Começar Grátis
                </Button>
              </div>
            </div>
          </div>
        </nav>
        <LandingPage />
      </div>
    );
  }

  // Login Page
  if (currentPage === 'login' && !isAuthenticated) {
    return <LoginForm />;
  }

  // Dashboard
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar activeTab={currentView} onTabChange={setCurrentView} />
        
        <div className="flex-1 overflow-auto">
          <Header />
          <main className="p-8">
            <AnimatePresence mode="wait">
              {renderDashboardContent()}
            </AnimatePresence>
          </main>
        </div>
      </div>
    );
  }

  // Fallback to login
  return (
    <>
      <LoginForm />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
          },
        }}
      />
    </>
  );
}

export default App;