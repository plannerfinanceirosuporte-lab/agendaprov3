import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Users, BarChart3 } from 'lucide-react';
import { Button } from '../ui/button';

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-20 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-grid-gray-100 bg-[size:20px_20px] opacity-30" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Transforme seu
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                {' '}negócio{' '}
              </span>
              com agendamentos inteligentes
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Plataforma completa para salões, clínicas e academias. 
              Gerencie agendamentos, clientes e pagamentos em um só lugar, 
              com automação via WhatsApp e sistema de fidelidade.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Teste Grátis por 30 Dias
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 rounded-xl border-2 border-gray-300 hover:border-blue-500 transition-all duration-300">
                Ver Demonstração
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4"
              >
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Agendamento Online</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4"
              >
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Gestão de Clientes</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-4"
              >
                <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">WhatsApp Automático</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-4"
              >
                <BarChart3 className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Relatórios Detalhados</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 transform rotate-1">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl blur opacity-20" />
              <div className="relative bg-white rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Agenda de Hoje</h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    12 agendamentos
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">09:00 - Maria Silva</p>
                      <p className="text-xs text-gray-600">Corte + Escova</p>
                    </div>
                    <span className="text-sm text-green-600 font-medium">R$ 85</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">10:30 - João Costa</p>
                      <p className="text-xs text-gray-600">Massagem Relaxante</p>
                    </div>
                    <span className="text-sm text-green-600 font-medium">R$ 120</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-600 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">14:00 - Ana Rodrigues</p>
                      <p className="text-xs text-gray-600">Manicure + Pedicure</p>
                    </div>
                    <span className="text-sm text-green-600 font-medium">R$ 65</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}