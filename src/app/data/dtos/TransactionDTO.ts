export interface TransactionDTO {
  id: number;
  type: 'Receita' | 'Despesa';
  date: string;
  amount: number;
  attachments: string;
  categoryId: number;
  userId: number;
  category: {
    id: number;
    name: string;
    userId: number;
  };
}
