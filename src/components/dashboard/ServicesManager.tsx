import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Clock, DollarSign, Tag, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { ServiceForm } from '../forms/ServiceForm';
import { useStore } from '../../store/useStore';
import { api } from '../../lib/api';

export function ServicesManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { servicos, setServicos, isLoading, setLoading } = useStore();

  useEffect(() => {
    loadServicos();
  }, []);

  const loadServicos = async () => {
    setLoading(true);
    try {
      const response = await api.getServicos();
      setServicos(response.servicos || []);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (servico: any) => {
    setSelectedService(servico);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await api.deleteServico(id);
        loadServicos();
      } catch (error) {
        console.error('Erro ao excluir serviço:', error);
      }
    }
  };

  const handleSuccess = () => {
    loadServicos();
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedService(null);
  };

  const filteredServicos = servicos.filter(servico =>
    servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servico.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servico.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryColor = (categoria: string) => {
    const colors = {
      'Cabelo': 'bg-purple-500/20 text-purple-400',
      'Unha': 'bg-pink-500/20 text-pink-400',
      'Pele': 'bg-green-500/20 text-green-400',
      'Massagem': 'bg-blue-500/20 text-blue-400',
      'Depilação': 'bg-orange-500/20 text-orange-400',
      'Sobrancelha': 'bg-indigo-500/20 text-indigo-400',
    };
    return colors[categoria as keyof typeof colors] || 'bg-gray-500/20 text-gray-400';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-dark-700 rounded mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-dark-700 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Gestão de Serviços</h2>
            <p className="text-gray-400">{servicos.length} serviços disponíveis</p>
          </div>
          <DialogTrigger asChild>
            <Button className="bg-primary-600 hover:bg-primary-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Serviço
            </Button>
          </DialogTrigger>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar serviços..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServicos.map((servico, index) => (
            <motion.div
              key={servico.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-8 card-hover group bg-gray-800/20 border-gray-700/30">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{servico.nome}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(servico.categoria)}`}>
                      <Tag className="w-3 h-3 mr-1" />
                      {servico.categoria}
                    </span>
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(servico)}
                      className="h-9 w-9 p-0 rounded-xl"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(servico.id)}
                      className="h-9 w-9 p-0 text-red-400 hover:text-red-300 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                  {servico.descricao}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-300">
                      <Clock className="w-4 h-4 mr-3 text-gray-400" />
                      {servico.duracao_minutos} minutos
                    </div>
                    <div className="flex items-center text-xl font-bold text-primary-400 tracking-tight">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {Number(servico.preco).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
                    <span>Agendamentos este mês</span>
                    <span className="font-bold text-white">24</span>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm" className="flex-1 rounded-xl">
                      Ver Detalhes
                    </Button>
                    <Button size="sm" className="flex-1 rounded-xl">
                      Agendar
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredServicos.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              {searchTerm ? 'Nenhum serviço encontrado' : 'Nenhum serviço cadastrado'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm 
                ? 'Tente ajustar os termos da sua busca' 
                : 'Comece adicionando seus primeiros serviços'
              }
            </p>
            <DialogTrigger asChild>
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Serviço
              </Button>
            </DialogTrigger>
          </div>
        )}

        {isDialogOpen && (
          <ServiceForm
            servico={selectedService}
            onClose={handleCloseDialog}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </Dialog>
  );
}