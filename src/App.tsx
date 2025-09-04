import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ListManager } from './components/ListManager';
import { ShoppingListView } from './components/ShoppingListView';
import { History } from './components/History';
import { useShoppingLists } from './hooks/useShoppingLists';
import { ShoppingList, ShoppingItem } from './types';
import { LIST_TEMPLATES, TEMPLATE_ITEMS } from './data/templates';

type Page = 'dashboard' | 'lists' | 'history' | 'list-view';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');

  const {
    lists,
    createList,
    updateList,
    deleteList,
    duplicateList,
    addItem,
    updateItem,
    deleteItem,
    getLastList,
    getCurrentMonthTotal
  } = useShoppingLists();

  const selectedList = lists.find(list => list.id === selectedListId) ?? null;

  const handleCreateList = () => {
    setShowCreateModal(true);
    setNewListName('');
  };

  const handleConfirmCreateList = () => {
    if (newListName.trim()) {
      const newList = createList(newListName);
      setSelectedListId(newList.id);
      setCurrentPage('list-view');
      setShowCreateModal(false);
      setNewListName('');
    }
  };
  
  const handleCreateFromTemplate = (templateKey: string) => {
    const template = LIST_TEMPLATES.find(t => t.key === templateKey);
    if (template) {
      const items = TEMPLATE_ITEMS[templateKey] || [];
      const newList = createList(template.name, items);
      setSelectedListId(newList.id);
      setCurrentPage('list-view');
      setShowCreateModal(false);
    }
  };

  const handleOpenList = (list: ShoppingList) => {
    setSelectedListId(list.id);
    setCurrentPage('list-view');
  };

  const handleBackToLists = () => {
    setSelectedListId(null);
    setCurrentPage('lists');
  };

  const handleNavigate = (page: 'dashboard' | 'lists' | 'history') => {
    setCurrentPage(page);
    setSelectedListId(null);
  };

  const handleAddItem = (item: Omit<ShoppingItem, 'id' | 'createdAt'>) => {
    if (selectedListId) {
      addItem(selectedListId, item);
    }
  };

  const handleUpdateItem = (itemId: string, updates: Partial<ShoppingItem>) => {
    if (selectedListId) {
      updateItem(selectedListId, itemId, updates);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    if (selectedListId) {
      deleteItem(selectedListId, itemId);
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            lastList={getLastList()}
            currentMonthTotal={getCurrentMonthTotal()}
            onCreateList={handleCreateList}
            onOpenList={handleOpenList}
            listsCount={lists.length}
          />
        );
      case 'lists':
        return (
          <ListManager
            lists={lists}
            onCreateList={handleCreateList}
            onOpenList={handleOpenList}
            onDeleteList={deleteList}
            onDuplicateList={duplicateList}
            onUpdateList={updateList}
          />
        );
      case 'history':
        return <History lists={lists} />;
      case 'list-view':
        return selectedList ? (
          <ShoppingListView
            list={selectedList}
            onBack={handleBackToLists}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <Layout 
      currentPage={currentPage === 'list-view' ? 'lists' : currentPage} 
      onNavigate={handleNavigate}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage + (selectedListId || '')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Create List Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Criar Nova Lista</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-3">Começar com um modelo</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {LIST_TEMPLATES.map(template => (
                      <button 
                        key={template.key}
                        onClick={() => handleCreateFromTemplate(template.key)}
                        className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 hover:ring-2 hover:ring-blue-500 transition-all"
                      >
                        <template.icon className="h-6 w-6 text-blue-600" />
                        <span className="font-semibold text-gray-800">{template.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-sm text-gray-500">OU</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-3">Criar lista personalizada</h4>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      placeholder="Nome da sua lista..."
                      className="flex-1 w-full px-4 py-3 border border-gray-300 bg-transparent rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleConfirmCreateList()}
                    />
                    <button
                      onClick={handleConfirmCreateList}
                      disabled={!newListName.trim()}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                    >
                      Criar
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowCreateModal(false)}
                className="w-full mt-8 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}

export default App;
