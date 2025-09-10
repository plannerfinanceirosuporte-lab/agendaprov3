import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, User, Phone, Mail, MapPin, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { ClientForm } from '../forms/ClientForm';
import { useStore } from '../../store/useStore';
import { api } from '../../lib/api';

export function ClientsManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { clientes, setClientes, isLoading, setLoading } = useStore();

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    setLoading(true);
    try {
      const response = await api.getClientes();
      setClientes(response.clientes || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cliente: any) => {
    setSelectedClient(cliente);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await api.deleteCliente(id);
        loadClientes();
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
      }
    }
  };

  const handleSuccess = () => {
    loadClientes();
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedClient(null);
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefone.includes(searchTerm)
  );

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
            <h2 className="text-2xl font-bold text-white">Gestão de Clientes</h2>
            <p className="text-gray-400">{clientes.length} clientes cadastrados</p>
          </div>
          <DialogTrigger asChild>
            <Button className="bg-primary-600 hover:bg-primary-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClientes.map((cliente, index) => (
            <motion.div
              key={cliente.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-8 card-hover group bg-gray-800/20 border-gray-700/30">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">{cliente.nome}</h3>
                      <p className="text-sm text-gray-400 font-medium">Cliente ativo</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(cliente)}
                      className="h-9 w-9 p-0 rounded-xl"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(cliente.id)}
                      className="h-9 w-9 p-0 text-red-400 hover:text-red-300 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-300">
                    <Phone className="w-4 h-4 mr-3 text-gray-400" />
                    {cliente.telefone}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-300">
                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                    {cliente.email}
                  </div>
                  
                  {cliente.endereco && (
                    <div className="flex items-center text-sm text-gray-300">
                      <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                      {cliente.endereco}
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white tracking-tight">12</p>
                      <p className="text-xs text-gray-400 font-medium">Agendamentos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary-400 tracking-tight">R$ 850</p>
                      <p className="text-xs text-gray-400 font-medium">Total gasto</p>
                    </div>
                    <div className="text-center">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-400">
                        VIP
                      </div>
                      <p className="text-xs text-gray-400 font-medium mt-1">1.240 pontos</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <Button variant="outline" size="sm" className="flex-1 rounded-xl">
                    Ver Histórico
                  </Button>
                  <Button size="sm" className="flex-1 rounded-xl">
                    Agendar
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredClientes.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm 
                ? 'Tente ajustar os termos da sua busca' 
                : 'Comece adicionando seu primeiro cliente'
              }
            </p>
            <DialogTrigger asChild>
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
          </div>
        )}

        {isDialogOpen && (
          <ClientForm
            cliente={selectedClient}
            onClose={handleCloseDialog}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </Dialog>
  );
}