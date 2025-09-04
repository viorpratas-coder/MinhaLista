import React from 'react';
import { motion } from 'framer-motion';
import { Plus, ShoppingCart, TrendingUp, Calendar, DollarSign, Target, CheckCircle, Clock } from 'lucide-react';
import { ShoppingList } from '../types';
import { format } from 'date-fns';

interface DashboardProps {
  lastList: ShoppingList | null;
  currentMonthTotal: { estimated: number; actual: number };
  onCreateList: () => void;
  onOpenList: (list: ShoppingList) => void;
  listsCount: number;
}

export function Dashboard({ lastList, currentMonthTotal, onCreateList, onOpenList, listsCount }: DashboardProps) {
  const completedItems = lastList?.items.filter(item => item.isPurchased).length || 0;
  const totalItems = lastList?.items.length || 0;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const lastListTotal = lastList?.items.reduce((total, item) => 
    total + (item.estimatedPrice * item.quantity), 0) || 0;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-2">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl lg:text-4xl font-bold text-gray-900"
        >
          Olá! Bem-vindo de volta 👋
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 text-lg"
        >
          Vamos organizar suas compras hoje?
        </motion.p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 lg:gap-6">
        {lastList && (
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenList(lastList)}
            className="group relative bg-white border-2 border-gray-200 text-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center justify-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-left">
                <span className="text-xl font-bold">Continuar Lista</span>
                <p className="text-gray-500 text-sm mt-1">{lastList.name}</p>
              </div>
            </div>
          </motion.button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Estimado</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {currentMonthTotal.estimated.toFixed(0)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Gasto Real</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {currentMonthTotal.actual.toFixed(0)}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Progresso</p>
              <p className="text-2xl font-bold text-gray-900">{completionPercentage}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Listas</p>
              <p className="text-2xl font-bold text-gray-900">{listsCount}</p>
              <p className="text-xs text-gray-400">criadas</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-xl">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Last List Preview */}
      {lastList && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{lastList.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {format(lastList.createdAt, 'dd/MM/yyyy')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">
                  R$ {lastListTotal.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  {completedItems}/{totalItems} concluídos
                </p>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Progresso da Lista</span>
              <span className="text-sm font-bold text-blue-600">{completionPercentage}%</span>
            </div>
            
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full shadow-sm"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 1.5, delay: 1 }}
                />
              </div>
            </div>

            {/* Items Preview */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Itens Recentes
              </h4>
              <div className="space-y-2">
                {lastList.items.slice(0, 4).map((item, index) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + (index * 0.1) }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        item.isPurchased ? 'bg-green-500' : item.isPriority ? 'bg-red-500' : 'bg-gray-300'
                      }`} />
                      <span className={`text-sm font-medium ${
                        item.isPurchased ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}>
                        {item.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                      {item.quantity} {item.unit}
                    </span>
                  </motion.div>
                ))}
                {lastList.items.length > 4 && (
                  <p className="text-xs text-gray-500 text-center py-2">
                    +{lastList.items.length - 4} itens adicionais...
                  </p>
                )}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => onOpenList(lastList)}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              Abrir Lista Completa
            </button>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {listsCount === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center"
        >
          <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Nenhuma lista criada ainda
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Crie sua primeira lista de compras e comece a organizar suas compras de forma inteligente
          </p>
          <button
            onClick={onCreateList}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Criar Primeira Lista
          </button>
        </motion.div>
      )}
    </div>
  );
}
