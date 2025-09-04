import { ShoppingCart, Sprout, Droplets, PartyPopper } from 'lucide-react';
import { ShoppingItem } from '../types';

export const LIST_TEMPLATES = [
  { name: 'Compra do Mês', icon: ShoppingCart, key: 'monthly' },
  { name: 'Feira da Semana', icon: Sprout, key: 'weekly_market' },
  { name: 'Produtos de Limpeza', icon: Droplets, key: 'cleaning' },
  { name: 'Festa/Churrasco', icon: PartyPopper, key: 'party' },
];

type TemplateItem = Omit<ShoppingItem, 'id' | 'createdAt' | 'isPurchased' | 'actualPrice'>;

export const TEMPLATE_ITEMS: Record<string, TemplateItem[]> = {
  monthly: [
    { name: 'Arroz Agulhinha (5kg)', quantity: 1, unit: 'pacote', estimatedPrice: 25.00, isPriority: true },
    { name: 'Feijão Carioca (1kg)', quantity: 2, unit: 'pacote', estimatedPrice: 8.00, isPriority: true },
    { name: 'Óleo de Soja (900ml)', quantity: 1, unit: 'garrafa', estimatedPrice: 7.50, isPriority: false },
    { name: 'Açúcar Refinado (1kg)', quantity: 1, unit: 'pacote', estimatedPrice: 5.00, isPriority: false },
    { name: 'Café em Pó (500g)', quantity: 1, unit: 'pacote', estimatedPrice: 15.00, isPriority: true },
    { name: 'Leite Integral (1L)', quantity: 6, unit: 'caixa', estimatedPrice: 4.50, isPriority: false },
    { name: 'Pão de Forma', quantity: 1, unit: 'pacote', estimatedPrice: 8.00, isPriority: false },
    { name: 'Manteiga com Sal (200g)', quantity: 1, unit: 'unidade', estimatedPrice: 10.00, isPriority: false },
  ],
  weekly_market: [
    { name: 'Banana Nanica', quantity: 1, unit: 'kg', estimatedPrice: 5.00, isPriority: false },
    { name: 'Maçã Gala', quantity: 1, unit: 'kg', estimatedPrice: 9.00, isPriority: false },
    { name: 'Tomate', quantity: 1, unit: 'kg', estimatedPrice: 7.00, isPriority: true },
    { name: 'Alface Crespa', quantity: 1, unit: 'unidade', estimatedPrice: 3.00, isPriority: true },
    { name: 'Cebola', quantity: 1, unit: 'kg', estimatedPrice: 6.00, isPriority: true },
    { name: 'Batata Inglesa', quantity: 1, unit: 'kg', estimatedPrice: 5.00, isPriority: false },
    { name: 'Ovos (dúzia)', quantity: 1, unit: 'unidade', estimatedPrice: 12.00, isPriority: false },
  ],
  cleaning: [
    { name: 'Detergente Líquido (500ml)', quantity: 2, unit: 'garrafa', estimatedPrice: 2.50, isPriority: true },
    { name: 'Sabão em Pó (1kg)', quantity: 1, unit: 'caixa', estimatedPrice: 15.00, isPriority: true },
    { name: 'Amaciante (2L)', quantity: 1, unit: 'garrafa', estimatedPrice: 18.00, isPriority: false },
    { name: 'Água Sanitária (1L)', quantity: 1, unit: 'garrafa', estimatedPrice: 4.00, isPriority: true },
    { name: 'Desinfetante (500ml)', quantity: 1, unit: 'garrafa', estimatedPrice: 8.00, isPriority: false },
    { name: 'Esponja de Aço', quantity: 1, unit: 'pacote', estimatedPrice: 3.00, isPriority: false },
  ],
  party: [
    { name: 'Refrigerante Cola (2L)', quantity: 2, unit: 'garrafa', estimatedPrice: 9.00, isPriority: false },
    { name: 'Suco de Laranja (1L)', quantity: 1, unit: 'caixa', estimatedPrice: 7.00, isPriority: false },
    { name: 'Água Mineral com Gás (1.5L)', quantity: 3, unit: 'garrafa', estimatedPrice: 3.00, isPriority: true },
    { name: 'Cerveja Pilsen (Lata)', quantity: 12, unit: 'lata', estimatedPrice: 3.50, isPriority: false },
    { name: 'Carvão (saco)', quantity: 1, unit: 'saco', estimatedPrice: 20.00, isPriority: true },
    { name: 'Picanha', quantity: 1.5, unit: 'kg', estimatedPrice: 80.00, isPriority: true },
    { name: 'Linguiça Toscana', quantity: 1, unit: 'kg', estimatedPrice: 25.00, isPriority: false },
  ]
};

export const COMMON_ITEMS = [
  'Arroz', 'Feijão', 'Lentilha', 'Grão de bico', 'Milho de pipoca', 'Farinha de trigo', 'Farinha de mandioca', 'Fubá', 'Aveia',
  'Macarrão espaguete', 'Macarrão parafuso', 'Lasanha',
  'Carne moída', 'Bife', 'Frango (peito)', 'Frango (coxa)', 'Linguiça', 'Salsicha', 'Ovos', 'Peixe',
  'Leite', 'Queijo mussarela', 'Queijo prato', 'Requeijão', 'Iogurte', 'Creme de leite', 'Leite condensado', 'Manteiga', 'Margarina',
  'Banana', 'Maçã', 'Laranja', 'Mamão', 'Melão', 'Uva', 'Morango', 'Limão',
  'Alface', 'Tomate', 'Cebola', 'Alho', 'Batata', 'Cenoura', 'Brócolis', 'Couve-flor', 'Abobrinha', 'Pimentão',
  'Pão francês', 'Pão de forma', 'Biscoito', 'Torrada',
  'Milho enlatado', 'Ervilha enlatada', 'Azeitona', 'Palmito', 'Atum enlatado', 'Sardinha enlatada', 'Molho de tomate',
  'Sal', 'Açúcar', 'Café', 'Óleo', 'Azeite', 'Vinagre', 'Maionese', 'Ketchup', 'Mostarda',
  'Água mineral', 'Refrigerante', 'Suco', 'Cerveja', 'Vinho',
  'Detergente', 'Sabão em pó', 'Amaciante', 'Água sanitária', 'Desinfetante', 'Esponja', 'Saco de lixo', 'Papel higiênico',
  'Sabonete', 'Shampoo', 'Condicionador', 'Creme dental', 'Escova de dentes',
];
