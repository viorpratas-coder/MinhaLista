import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Calendar, Copy, Trash2, Edit3 } from 'lucide-react';
import { ShoppingList } from '../types';
import { format } from 'date-fns';

interface ListManagerProps {
  lists: ShoppingList[];
  onCreateList: () => void;
  onOpenList: (list: ShoppingList) => void;
  onDeleteList: (listId: string) => void;
  onDuplicateList: (listId: string, newName: string) => void;
  onUpdateList: (listId: string, updates: Partial<ShoppingList>) => void;
}

export function ListManager({ lists, onCreateList, onOpenList, onDeleteList, onDuplicateList, onUpdateList }: ListManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDuplicateModal, setShowDuplicateModal] = useState<string | null>(null);
  const [editingList, setEditingList] = useState<ShoppingList | null>(null);
  const [newListName, setNewListName] = useState('');

  const filteredLists = lists.filter(list =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDuplicateList = (listId: string) => {
    if (newListName.trim()) {
      onDuplicateList(listId, newListName);
      setNewListName('');
      setShowDuplicateModal(null);
    }
  };

  const handleOpenEditModal = (list: ShoppingList) => {
    setEditingList(list);
    setNewListName(list.name);
  };

  const handleConfirmEdit = () => {
    if (editingList && newListName.trim()) {
      onUpdateList(editingList.id, { name: newListName });
      setEditingList(null);
      setNewListName('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">Minhas Listas</h2>
        {lists.length > 0 && (
          <button
            onClick={onCreateList}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Nova Lista</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar listas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredLists.map((list) => {
            const totalItems = list.items.length;
            const completedItems = list.items.filter(item => item.isPurchased).length;
            const totalValue = list.items.reduce((sum, item) => 
              sum + (item.estimatedPrice * item.quantity), 0);
            const completionPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

            return (
              <motion.div
                key={list.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden flex flex-col"
                onClick={() => onOpenList(list)}
              >
                <div className="p-6 flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                        {list.name}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(list.createdAt, 'dd/MM/yyyy')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progresso</span>
                      <span className="font-medium">{completedItems}/{totalItems} itens</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">
                        R$ {totalValue.toFixed(2)}
                      </span>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        list.isCompleted
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {list.isCompleted ? 'Concluída' : 'Em progresso'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-2 flex justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => handleOpenEditModal(list)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                        <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => {
                        setShowDuplicateModal(list.id);
                        setNewListName(`${list.name} (Cópia)`);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <Copy className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDeleteList(list.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredLists.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Nenhuma lista encontrada' : 'Nenhuma lista criada'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? 'Tente usar outros termos de busca'
              : 'Crie sua primeira lista de compras para começar'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={onCreateList}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              Criar Primeira Lista
            </button>
          )}
        </div>
      )}

      {/* Edit/Duplicate Modals */}
      <AnimatePresence>
        {(showDuplicateModal || editingList) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => { setShowDuplicateModal(null); setEditingList(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingList ? 'Editar Nome da Lista' : 'Duplicar Lista'}
              </h3>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Nome da lista"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && (editingList ? handleConfirmEdit() : handleDuplicateList(showDuplicateModal!))}
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => { setShowDuplicateModal(null); setEditingList(null); }}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => editingList ? handleConfirmEdit() : handleDuplicateList(showDuplicateModal!)}
                  disabled={!newListName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {editingList ? 'Salvar' : 'Duplicar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
