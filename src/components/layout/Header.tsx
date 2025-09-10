import React from 'react';
import { Bell, Settings, User, LogOut, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useStore } from '../../store/useStore';

export function Header() {
  const { user, logout } = useStore();

  return (
    <header className="bg-gray-900/30 backdrop-blur-2xl border-b border-gray-700/50 px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar agendamentos, clientes..."
              className="pl-12 bg-gray-800/30 border-gray-600/30"
            />
          </div>
        </div>

        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Olá, {user?.nome || 'Usuário'}!
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-1">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative rounded-xl">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-lg">
              3
            </span>
          </Button>

          <Button variant="ghost" size="sm" className="rounded-xl">
            <Settings className="w-5 h-5 text-gray-400" />
          </Button>

          <div className="flex items-center space-x-4 pl-6 border-l border-gray-700/50">
            <div className="text-right">
              <p className="text-sm font-semibold text-white">{user?.nome}</p>
              <p className="text-xs text-gray-400 font-medium">{user?.role}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-4 h-4 text-white" />
            </div>
            <Button variant="ghost" size="sm" onClick={logout} className="rounded-xl">
              <LogOut className="w-4 h-4 text-gray-400" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}