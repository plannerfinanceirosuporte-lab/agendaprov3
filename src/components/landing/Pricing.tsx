import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { Button } from '../ui/button';

const plans = [
  {
    name: 'Starter',
    price: 'R$ 49',
    period: '/mês',
    description: 'Perfeito para começar',
    popular: false,
    features: [
      'Até 100 agendamentos/mês',
      'WhatsApp automático',
      'Gestão de clientes',
      'Relatórios básicos',
      'Suporte por email',
    ],
    cta: 'Começar Grátis',
  },
  {
    name: 'Professional',
    price: 'R$ 99',
    period: '/mês',
    description: 'Para negócios em crescimento',
    popular: true,
    features: [
      'Agendamentos ilimitados',
      'WhatsApp + SMS automático',
      'Sistema de fidelidade',
      'Pagamentos integrados',
      'Relatórios avançados',
      'Múltiplos profissionais',
      'App móvel',
      'Suporte prioritário',
    ],
    cta: 'Mais Popular',
  },
  {
    name: 'Enterprise',
    price: 'R$ 199',
    period: '/mês',
    description: 'Para grandes operações',
    popular: false,
    features: [
      'Tudo do Professional',
      'Múltiplas unidades',
      'API personalizada',
      'Integrações avançadas',
      'Relatórios personalizados',
      'Suporte dedicado',
      'Treinamento incluído',
    ],
    cta: 'Falar com Vendas',
  },
];

export function Pricing() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Planos transparentes,
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
              {' '}sem surpresas
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Escolha o plano ideal para o seu negócio. Todos os planos incluem teste grátis de 30 dias.
          </p>
          
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <Star className="w-4 h-4 mr-2" />
            30 dias grátis • Sem compromisso • Cancele quando quiser
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                plan.popular 
                  ? 'border-2 border-blue-500 transform scale-105 lg:scale-110' 
                  : 'border border-gray-200 hover:border-blue-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="flex items-end justify-center">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-xl text-gray-600 ml-2">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full py-3 text-base font-medium rounded-xl transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            Precisa de algo personalizado para sua empresa?
          </p>
          <Button variant="outline" size="lg" className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50">
            Falar com Especialista
          </Button>
        </motion.div>
      </div>
    </section>
  );
}