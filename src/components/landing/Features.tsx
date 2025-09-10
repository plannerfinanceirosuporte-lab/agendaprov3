import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MessageCircle, 
  CreditCard, 
  Users, 
  BarChart3, 
  Shield,
  Clock,
  Star,
  Smartphone
} from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Agendamento Inteligente',
    description: 'Sistema completo com calendário interativo, controle de horários e disponibilidade automática.',
    color: 'blue',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Automático',
    description: 'Confirmações, lembretes e feedback automáticos via WhatsApp para reduzir faltas.',
    color: 'green',
  },
  {
    icon: CreditCard,
    title: 'Pagamentos Integrados',
    description: 'Aceite pagamentos online com Pix, cartão e parcelamento direto na plataforma.',
    color: 'purple',
  },
  {
    icon: Users,
    title: 'Gestão de Clientes',
    description: 'Base completa de clientes com histórico, preferências e sistema de fidelidade.',
    color: 'orange',
  },
  {
    icon: Star,
    title: 'Programa de Fidelidade',
    description: 'Sistema de pontos, níveis VIP e recompensas para aumentar a retenção de clientes.',
    color: 'yellow',
  },
  {
    icon: BarChart3,
    title: 'Relatórios Detalhados',
    description: 'Análises completas de faturamento, clientes mais frequentes e performance.',
    color: 'indigo',
  },
  {
    icon: Shield,
    title: 'Segurança Total',
    description: 'Dados protegidos com criptografia e backup automático na nuvem.',
    color: 'red',
  },
  {
    icon: Clock,
    title: 'Disponível 24/7',
    description: 'Seus clientes podem agendar a qualquer hora, aumentando suas vendas.',
    color: 'cyan',
  },
  {
    icon: Smartphone,
    title: '100% Responsivo',
    description: 'Funciona perfeitamente em celular, tablet e computador com design moderno.',
    color: 'pink',
  },
];

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  green: 'bg-green-50 text-green-600 border-green-200',
  purple: 'bg-purple-50 text-purple-600 border-purple-200',
  orange: 'bg-orange-50 text-orange-600 border-orange-200',
  yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  red: 'bg-red-50 text-red-600 border-red-200',
  cyan: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  pink: 'bg-pink-50 text-pink-600 border-pink-200',
};

export function Features() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Tudo que você precisa para
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
              {' '}fazer seu negócio crescer
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Uma plataforma completa que automatiza sua gestão e melhora a experiência dos seus clientes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl border-2 mb-6 transition-all duration-300 ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-7 h-7" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-green-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}