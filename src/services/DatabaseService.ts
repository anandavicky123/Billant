import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Transaction {
  id?: number;
  category: string;
  account: string;
  amount: number;
  notes: string;
  date: string;
  type: 'income' | 'expense';
}

class DatabaseService {
  private TRANSACTIONS_KEY = 'billant_transactions';
  private ID_COUNTER_KEY = 'billant_id_counter';

  async initDatabase(): Promise<void> {
    try {
      // Initialize counter if it doesn't exist
      const counter = await AsyncStorage.getItem(this.ID_COUNTER_KEY);
      if (counter === null) {
        await AsyncStorage.setItem(this.ID_COUNTER_KEY, '0');
      }
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  private async getNextId(): Promise<number> {
    try {
      const counter = await AsyncStorage.getItem(this.ID_COUNTER_KEY);
      const nextId = parseInt(counter || '0', 10) + 1;
      await AsyncStorage.setItem(this.ID_COUNTER_KEY, nextId.toString());
      return nextId;
    } catch (error) {
      console.error('Error getting next ID:', error);
      throw error;
    }
  }

  async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<void> {
    try {
      const transactions = await this.getAllTransactions();
      const newTransaction: Transaction = {
        ...transaction,
        id: await this.getNextId(),
      };

      transactions.push(newTransaction);
      await AsyncStorage.setItem(
        this.TRANSACTIONS_KEY,
        JSON.stringify(transactions),
      );
      console.log('Transaction added successfully:', newTransaction.id);
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  async getAllTransactions(): Promise<Transaction[]> {
    try {
      const transactionsData = await AsyncStorage.getItem(
        this.TRANSACTIONS_KEY,
      );
      if (transactionsData === null) {
        return [];
      }

      const transactions: Transaction[] = JSON.parse(transactionsData);
      // Sort by date descending
      return transactions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  }

  async getTransactionsByMonth(
    year: number,
    month: number,
  ): Promise<Transaction[]> {
    try {
      const allTransactions = await this.getAllTransactions();

      return allTransactions.filter(transaction => {
        const txDate = new Date(transaction.date);
        return txDate.getMonth() === month && txDate.getFullYear() === year;
      });
    } catch (error) {
      console.error('Error getting transactions by month:', error);
      throw error;
    }
  }

  async deleteTransaction(id: number): Promise<void> {
    try {
      const transactions = await this.getAllTransactions();
      const filteredTransactions = transactions.filter(t => t.id !== id);
      await AsyncStorage.setItem(
        this.TRANSACTIONS_KEY,
        JSON.stringify(filteredTransactions),
      );
      console.log('Transaction deleted successfully:', id);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  async updateTransaction(
    id: number,
    updatedTransaction: Omit<Transaction, 'id'>,
  ): Promise<void> {
    try {
      const transactions = await this.getAllTransactions();
      const index = transactions.findIndex(t => t.id === id);

      if (index !== -1) {
        transactions[index] = { ...updatedTransaction, id };
        await AsyncStorage.setItem(
          this.TRANSACTIONS_KEY,
          JSON.stringify(transactions),
        );
        console.log('Transaction updated successfully:', id);
      } else {
        throw new Error('Transaction not found');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  async clearAllTransactions(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.TRANSACTIONS_KEY);
      await AsyncStorage.setItem(this.ID_COUNTER_KEY, '0');
      console.log('All transactions cleared');
    } catch (error) {
      console.error('Error clearing transactions:', error);
      throw error;
    }
  }
}

export default new DatabaseService();
