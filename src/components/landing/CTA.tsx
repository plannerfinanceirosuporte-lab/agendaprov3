import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Calendar className="w-16 h-16 text-white mx-auto mb-8" />
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Pronto para transformar seu negócio?
          </h2>
          
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Junte-se a milhares de empresários que já automatizaram seus agendamentos
            e aumentaram seu faturamento com nossa plataforma.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-8">
            <Input 
              placeholder="Seu melhor email" 
              className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 backdrop-blur-sm"
            />
            <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 font-medium">
              Começar Grátis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-blue-100 text-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
              <span>30 dias grátis</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
              <span>Suporte incluído</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}