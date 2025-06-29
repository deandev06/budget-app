export interface MockBudget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  icon: string;
  color: string;
}

export const mockBudgets: MockBudget[] = [
  {
    id: '1',
    category: 'Food & Dining',
    limit: 800,
    spent: 650,
    icon: 'utensils',
    color: '#F59E0B',
  },
  {
    id: '2',
    category: 'Transportation',
    limit: 400,
    spent: 320,
    icon: 'car',
    color: '#3B82F6',
  },
  {
    id: '3',
    category: 'Shopping',
    limit: 600,
    spent: 720,
    icon: 'shopping-bag',
    color: '#EF4444',
  },
  {
    id: '4',
    category: 'Entertainment',
    limit: 300,
    spent: 180,
    icon: 'gamepad-2',
    color: '#8B5CF6',
  },
  {
    id: '5',
    category: 'Healthcare',
    limit: 200,
    spent: 45,
    icon: 'heart',
    color: '#EC4899',
  },
];