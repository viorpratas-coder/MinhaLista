export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  estimatedPrice: number;
  actualPrice?: number;
  isPriority: boolean;
  isPurchased: boolean;
  createdAt: Date;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean;
}

export interface MonthlyStats {
  month: string;
  totalEstimated: number;
  totalActual: number;
  itemCount: number;
  mostBoughtItems: { name: string; count: number }[];
}

export const UNITS = [
  'kg', 'g', 'l', 'ml', 'unidade', 'pacote', 'caixa', 'lata', 'garrafa', 'saco'
] as const;

export type Unit = typeof UNITS[number];
