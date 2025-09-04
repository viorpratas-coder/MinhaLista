import { useMemo } from 'react';
import { ShoppingList, ShoppingItem } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { isSameMonth, parseISO } from 'date-fns';
import { faker } from '@faker-js/faker';

export function useShoppingLists() {
  const [rawLists, setLists] = useLocalStorage<ShoppingList[]>('shopping-lists', []);

  // Use useMemo to synchronously parse dates from localStorage.
  // This ensures that any component consuming this hook gets Date objects, not strings,
  // fixing the ".getTime is not a function" error.
  const lists = useMemo(() => {
    if (!rawLists) return [];
    return rawLists.map(list => {
      const createdAt = typeof list.createdAt === 'string' ? parseISO(list.createdAt) : list.createdAt;
      const updatedAt = typeof list.updatedAt === 'string' ? parseISO(list.updatedAt) : list.updatedAt;

      return {
        ...list,
        createdAt,
        updatedAt,
        items: (list.items || []).map(item => ({
          ...item,
          createdAt: typeof item.createdAt === 'string' ? parseISO(item.createdAt) : item.createdAt,
        })),
      };
    });
  }, [rawLists]);

  const createList = (name: string, templateItems?: Omit<ShoppingItem, 'id' | 'createdAt' | 'isPurchased' | 'actualPrice'>[]): ShoppingList => {
    const newItems: ShoppingItem[] = (templateItems || []).map(item => ({
      ...item,
      id: faker.string.uuid(),
      createdAt: new Date(),
      isPurchased: false,
      actualPrice: undefined,
    }));

    const newList: ShoppingList = {
      id: faker.string.uuid(),
      name,
      items: newItems,
      createdAt: new Date(),
      updatedAt: new Date(),
      isCompleted: false
    };

    setLists(prev => [newList, ...prev]);
    return newList;
  };

  const updateList = (listId: string, updates: Partial<ShoppingList>) => {
    setLists(prev => 
      prev.map(list => 
        list.id === listId 
          ? { ...list, ...updates, updatedAt: new Date() }
          : list
      )
    );
  };

  const deleteList = (listId: string) => {
    setLists(prev => prev.filter(list => list.id !== listId));
  };

  const duplicateList = (listId: string, newName: string): ShoppingList => {
    const listToDuplicate = lists.find(list => list.id === listId);
    if (!listToDuplicate) throw new Error('List not found');

    const duplicatedList: ShoppingList = {
      ...listToDuplicate,
      id: faker.string.uuid(),
      name: newName,
      createdAt: new Date(),
      updatedAt: new Date(),
      isCompleted: false,
      items: listToDuplicate.items.map(item => ({
        ...item,
        id: faker.string.uuid(),
        isPurchased: false,
        actualPrice: undefined,
        createdAt: new Date()
      }))
    };

    setLists(prev => [duplicatedList, ...prev]);
    return duplicatedList;
  };

  const addItem = (listId: string, item: Omit<ShoppingItem, 'id' | 'createdAt'>) => {
    const list = lists.find(l => l.id === listId);
    if (!list) return;
    
    const newItem: ShoppingItem = {
      ...item,
      id: faker.string.uuid(),
      createdAt: new Date()
    };

    const updatedItems = [...list.items, newItem];
    updateList(listId, { items: updatedItems });
  };

  const updateItem = (listId: string, itemId: string, updates: Partial<ShoppingItem>) => {
    const list = lists.find(l => l.id === listId);
    if (!list) return;

    const updatedItems = list.items.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );

    updateList(listId, { items: updatedItems });
  };

  const deleteItem = (listId: string, itemId: string) => {
    const list = lists.find(l => l.id === listId);
    if (!list) return;

    const updatedItems = list.items.filter(item => item.id !== itemId);
    updateList(listId, { items: updatedItems });
  };

  const getLastList = (): ShoppingList | null => {
    const sortedLists = [...lists].sort((a, b) => {
      const dateA = a.updatedAt instanceof Date ? a.updatedAt.getTime() : 0;
      const dateB = b.updatedAt instanceof Date ? b.updatedAt.getTime() : 0;
      return dateB - dateA;
    });
    return sortedLists.length > 0 ? sortedLists[0] : null;
  };

  const getCurrentMonthTotal = (): { estimated: number; actual: number } => {
    const currentMonth = new Date();
    let estimated = 0;
    let actual = 0;

    lists
      .filter(list => list.createdAt instanceof Date && isSameMonth(list.createdAt, currentMonth))
      .forEach(list => {
        list.items.forEach(item => {
          estimated += item.estimatedPrice * item.quantity;
          if (item.isPurchased) {
            actual += (item.actualPrice || item.estimatedPrice) * item.quantity;
          }
        });
      });

    return { estimated, actual };
  };

  return {
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
  };
}
