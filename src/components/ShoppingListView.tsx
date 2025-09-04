import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Plus, Search, Check, Star, Edit3, Trash2, 
  DollarSign, Package, Target
} from 'lucide-react';
import { ShoppingList, ShoppingItem, UNITS, Unit } from '../types';
import { COMMON_ITEMS } from '../data/templates';

interface ShoppingListViewProps {
  list: ShoppingList;
  onBack: () => void;
  onAddItem: (item: Omit<ShoppingItem, 'id' | 'createdAt'>) => void;
  onUpdateItem: (itemId: string, updates: Partial<ShoppingItem>) => void;
  onDeleteItem: (itemId: string) => void;
}

const initialFormState = {
  name: '',
  quantity: 1,
  unit: 'unidade' as Unit,
  estimatedPrice: 0,
  isPriority: false,
  isPurchased: false,
};

export function ShoppingListView({ 
  list, onBack, onAddItem, onUpdateItem, onDeleteItem 
}: ShoppingListViewProps) {
  const [showFormModal, setShowFormModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);
  const [formState, setFormState] = useState(initialFormState);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (showFormModal) {
      if (editingItem) {
        setFormState({
          name: editingItem.name,
          quantity: editingItem.quantity,
          unit: editingItem.unit as Unit,
          estimatedPrice: editingItem.estimatedPrice,
          isPriority: editingItem.isPriority,
          isPurchased: editingItem.isPurchased,
        });
      } else {
        setFormState(initialFormState);
      }
    }
  }, [editingItem, showFormModal]);

  const filteredItems = list.items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a.isPurchased !== b.isPurchased) return a.isPurchased ? 1 : -1;
    if (a.isPriority !== b.isPriority) return a.isPriority ? -1 : 1;
    return a.createdAt > b.createdAt ? 1 : -1;
  });

  const { totalEstimated, totalActual } = list.items.reduce(
    (totals, item) => {
      totals.totalEstimated += item.estimatedPrice * item.quantity;
      if (item.isPurchased) {
        totals.totalActual += (item.actualPrice || item.estimatedPrice) * item.quantity;
      }
      return totals;
    },
    { totalEstimated: 0, totalActual: 0 }
  );
  
  const completedItems = list.items.filter(item => item.isPurchased).length;
  const priorityItems = list.items.filter(item => item.isPriority && !item.isPurchased).length;

  const handleFormSubmit = () => {
    if (formState.name.trim()) {
      if (editingItem) {
        onUpdateItem(editingItem.id, formState);
      } else {
        onAddItem(formState);
      }
      setShowFormModal(false);
      setSuggestions([]);
    }
  };
  
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setShowFormModal(true);
  };

  const handleOpenEditModal = (item: ShoppingItem) => {
    setEditingItem(item);
    setShowFormModal(true);
  };
  
  const handleCloseModal = () => {
    setShowFormModal(false);
    setEditingItem(null);
    setSuggestions([]);
  }

  const handleTogglePurchased = (item: ShoppingItem) => {
    onUpdateItem(item.id, { 
      isPurchased: !item.isPurchased,
      actualPrice: !item.isPurchased && !item.actualPrice ? item.estimatedPrice : item.actualPrice
    });
  };

  const handleNameChange = (name: string) => {
    setFormState({ ...formState, name });
    if (name.length > 1 && !editingItem) {
      const filteredSuggestions = COMMON_ITEMS.filter(item => 
        item.toLowerCase().includes(name.toLowerCase())
      );
      setSuggestions(filteredSuggestions.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setFormState({ ...formState, name: suggestion });
    setSuggestions([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{list.name}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {completedItems}/{list.items.length} itens concluídos
                {priorityItems > 0 && ` • ${priorityItems} prioridades`}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleOpenAddModal}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline font-medium">Adicionar Item</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Progresso</span>
            <span className="text-sm font-bold text-blue-600">
              {Math.round((completedItems / Math.max(list.items.length, 1)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedItems / Math.max(list.items.length, 1)) * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs lg:text-sm text-gray-500 font-medium">Total</p>
              <p className="text-lg lg:text-xl font-bold text-gray-900">{list.items.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs lg:text-sm text-gray-500 font-medium">Comprados</p>
              <p className="text-lg lg:text-xl font-bold text-gray-900">{completedItems}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs lg:text-sm text-gray-500 font-medium">Estimado</p>
              <p className="text-lg lg:text-xl font-bold text-gray-900">R$ {totalEstimated.toFixed(0)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 lg:p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs lg:text-sm text-gray-500 font-medium">Gasto Real</p>
              <p className="text-lg lg:text-xl font-bold text-gray-900">R$ {totalActual.toFixed(0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar itens na lista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Items List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <AnimatePresence>
          {sortedItems.length > 0 ? (
            sortedItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 lg:p-6 border-b border-gray-100 last:border-b-0 ${
                  item.isPurchased ? 'bg-gray-50' : 'bg-white'
                } hover:bg-gray-50 transition-colors`}
              >
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleTogglePurchased(item)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all transform hover:scale-110 ${
                      item.isPurchased
                        ? 'bg-green-500 border-green-500 text-white shadow-lg'
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                  >
                    {item.isPurchased && <Check className="h-4 w-4" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <h3 className={`font-semibold text-lg ${
                          item.isPurchased ? 'line-through text-gray-500' : 'text-gray-900'
                        }`}>
                          {item.name}
                        </h3>
                        {item.isPriority && !item.isPurchased && (
                          <div className="bg-red-100 px-2 py-1 rounded-full flex items-center space-x-1">
                            <Star className="h-3 w-3 text-red-600 fill-current" />
                            <span className="text-xs font-medium text-red-600">Prioridade</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 sm:space-x-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {item.quantity} {item.unit}
                          </p>
                          <p className="font-bold text-gray-900">
                            R$ {(item.estimatedPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:space-x-1">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onUpdateItem(item.id, { isPriority: !item.isPriority })}
                            className={`p-2 rounded-lg transition-colors ${
                              item.isPriority
                                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                                : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                            }`}
                          >
                            <Star className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDeleteItem(item.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Package className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {searchTerm ? 'Nenhum item encontrado' : 'Lista vazia'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm 
                  ? 'Tente usar outros termos de busca'
                  : 'Adicione itens à sua lista de compras'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={handleOpenAddModal}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Adicionar Primeiro Item
                </button>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Add/Edit Item Modal */}
      <AnimatePresence>
        {showFormModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {editingItem ? 'Editar Item' : 'Adicionar Novo Item'}
              </h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome do produto</label>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ex: Arroz, Feijão, Leite..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    autoFocus
                    disabled={!!editingItem}
                  />
                  {suggestions.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
                    >
                      <ul className="py-1 max-h-40 overflow-y-auto">
                        {suggestions.map(suggestion => (
                          <li 
                            key={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade</label>
                    <input
                      type="number"
                      value={formState.quantity}
                      onChange={(e) => setFormState({ ...formState, quantity: parseInt(e.target.value) || 1 })}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unidade</label>
                    <select
                      value={formState.unit}
                      onChange={(e) => setFormState({ ...formState, unit: e.target.value as Unit })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    >
                      {UNITS.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preço estimado (R$)</label>
                  <input
                    type="number"
                    value={formState.estimatedPrice}
                    onChange={(e) => setFormState({ ...formState, estimatedPrice: parseFloat(e.target.value) || 0 })}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.isPriority}
                    onChange={(e) => setFormState({ ...formState, isPriority: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Marcar como prioridade</span>
                </label>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleFormSubmit}
                  disabled={!formState.name.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium transform hover:scale-105"
                >
                  {editingItem ? 'Salvar Alterações' : 'Adicionar Item'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
