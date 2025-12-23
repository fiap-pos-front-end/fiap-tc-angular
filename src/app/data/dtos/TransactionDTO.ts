export interface TransactionDTO {
  id: number;
  type: 'Receita' | 'Despesa';
  date: string;
  amount: string;
  attachments: string;
  categoryId: number;
  userId: number;
  category: {
    id: number;
    name: string;
    userId: number;
  };
}
