import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, DollarSign, ShoppingCart, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ShoppingList } from '../types';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

interface HistoryProps {
  lists: ShoppingList[];
}

export function History({ lists }: HistoryProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'3m' | '6m' | '12m'>('6m');

  const getMonthlyData = () => {
    const months = selectedPeriod === '3m' ? 3 : selectedPeriod === '6m' ? 6 : 12;
    const endDate = new Date();
    const startDate = subMonths(endDate, months - 1);
    
    const monthsArray = eachMonthOfInterval({ start: startDate, end: endDate });
    
    return monthsArray.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthLists = lists.filter(list => 
        list.createdAt >= monthStart && list.createdAt <= monthEnd
      );
      
      let totalEstimated = 0;
      let totalActual = 0;
      let itemCount = 0;

      monthLists.forEach(list => {
        itemCount += list.items.length;
        list.items.forEach(item => {
            totalEstimated += item.estimatedPrice * item.quantity;
            if (item.isPurchased) {
                totalActual += (item.actualPrice || item.estimatedPrice) * item.quantity;
            }
        });
      });
      
      return {
        month: format(month, 'MMM'),
        fullMonth: format(month, 'MMMM yyyy'),
        estimated: totalEstimated,
        actual: totalActual,
        itemCount,
        listCount: monthLists.length
      };
    });
  };

  const getMostBoughtItems = () => {
    const itemCounts: { [key: string]: number } = {};
    
    lists.forEach(list => {
      list.items.forEach(item => {
        if (item.isPurchased) {
          itemCounts[item.name] = (itemCounts[item.name] || 0) + 1;
        }
      });
    });
    
    return Object.entries(itemCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
  };

  const monthlyData = getMonthlyData();
  const mostBoughtItems = getMostBoughtItems();
  
  const totalSpent = monthlyData.reduce((sum, month) => sum + month.actual, 0);
  const totalItems = monthlyData.reduce((sum, month) => sum + month.itemCount, 0);
  const totalLists = monthlyData.reduce((sum, month) => sum + month.listCount, 0);
  const avgSpentPerMonth = totalSpent / monthlyData.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Histórico e Estatísticas</h2>
        <div className="flex bg-gray-100 rounded-lg p-1">
          {(['3m', '6m', '12m'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {period === '3m' ? '3 meses' : period === '6m' ? '6 meses' : '1 ano'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Gasto</p>
              <p className="text-2xl font-bold text-gray-900">R$ {totalSpent.toFixed(2)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Listas Criadas</p>
              <p className="text-2xl font-bold text-gray-900">{totalLists}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Itens</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Média Mensal</p>
              <p className="text-2xl font-bold text-gray-900">R$ {avgSpentPerMonth.toFixed(2)}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendência de Gastos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `R$ ${value.toFixed(0)}`} />
              <Tooltip 
                formatter={(value: number) => [`R$ ${value.toFixed(2)}`, '']}
                labelFormatter={(label, payload) => {
                  const item = payload?.[0]?.payload;
                  return item?.fullMonth || label;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="estimated" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Estimado"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Real"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparação Mensal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `R$ ${value.toFixed(0)}`} />
              <Tooltip 
                formatter={(value: number) => [`R$ ${value.toFixed(2)}`, '']}
                labelFormatter={(label, payload) => {
                  const item = payload?.[0]?.payload;
                  return item?.fullMonth || label;
                }}
              />
              <Bar dataKey="estimated" fill="#3B82F6" name="Estimado" />
              <Bar dataKey="actual" fill="#10B981" name="Real" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Most Bought Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Produtos Mais Comprados</h3>
        </div>
        <div className="p-6">
          {mostBoughtItems.length > 0 ? (
            <div className="space-y-4">
              {mostBoughtItems.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-amber-600' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{item.count} vezes</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ 
                          width: `${(item.count / mostBoughtItems[0].count) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Nenhum item comprado ainda</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
