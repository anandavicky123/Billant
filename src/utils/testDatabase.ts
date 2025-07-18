import DatabaseService from '../services/DatabaseService';

// Test function to add sample data
export const addSampleData = async () => {
  try {
    await DatabaseService.initDatabase();

    // Add sample income transaction
    await DatabaseService.addTransaction({
      category: 'Other',
      account: 'Bank',
      amount: 1000,
      notes: 'Sample income',
      date: new Date().toISOString(),
      type: 'income',
    });

    // Add sample expense transaction
    await DatabaseService.addTransaction({
      category: 'Food',
      account: 'Cash',
      amount: 50,
      notes: 'Sample expense',
      date: new Date().toISOString(),
      type: 'expense',
    });

    console.log('Sample data added successfully');
  } catch (error) {
    console.error('Error adding sample data:', error);
  }
};

// Test function to get all transactions
export const testDatabase = async () => {
  try {
    const transactions = await DatabaseService.getAllTransactions();
    console.log('All transactions:', transactions);
    return transactions;
  } catch (error) {
    console.error('Error testing database:', error);
    return [];
  }
};
