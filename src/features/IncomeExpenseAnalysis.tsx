import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions,
  PanResponder,
  Animated,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PieChart } from 'react-native-chart-kit';
import DatabaseService, { Transaction } from '../services/DatabaseService';

const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Other'];
const accounts = ['Cash', 'Bank'];

const emojiMap: Record<string, string> = {
  Food: '🍔',
  Transport: '🚌',
  Shopping: '🛍️',
  Bills: '💡',
  Other: '🔖',
  Cash: '💵',
  Bank: '🏦',
};

const IncomeExpenseAnalysis = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [category, setCategory] = useState(categories[0]);
  const [account, setAccount] = useState(accounts[0]);
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>(
    'expense',
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  // Refs for month scroller only (year is now a date picker)
  const monthScrollRef = React.useRef<ScrollView>(null);

  // Reset month/year to current when component is mounted (or tab is switched)
  // Replace the existing useEffect with this fixed version:

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);

    // Scroll to center current month only
    setTimeout(() => {
      if (monthScrollRef.current) {
        monthScrollRef.current.scrollTo({
          x: (currentMonth - 2) * 64, // 64 is approx button width+margin
          animated: true,
        });
      }
    }, 300); // Wait for render
  }, []); // Empty dependency array - only run on mount

  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);

    // Scroll to center current month
    setTimeout(() => {
      if (monthScrollRef.current) {
        monthScrollRef.current.scrollTo({
          x: (currentMonth - 2) * 64, // 64 is approx button width+margin
          animated: true,
        });
      }
    }, 300); // Wait for render
  }, []); // Empty dependency array - only run on mount

  // Also add this new useEffect to handle scrolling when user selects different months:
  useEffect(() => {
    // Only scroll if the selected month is different from what's currently visible
    setTimeout(() => {
      if (monthScrollRef.current) {
        monthScrollRef.current.scrollTo({
          x: Math.max(0, (selectedMonth - 2) * 64), // Ensure we don't scroll to negative values
          animated: true,
        });
      }
    }, 100);
  }, [selectedMonth]);
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense'>(
    'all',
  );
  const [showTransactionDateModal, setShowTransactionDateModal] =
    useState(false);
  const [transactionDate, setTransactionDate] = useState(new Date());
  const [yearInputText, setYearInputText] = useState(
    new Date().getFullYear().toString(),
  );
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Floating button position
  const pan = useState(new Animated.ValueXY())[0];
  const [dragEnabled, setDragEnabled] = useState(false);
  const dragTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const screenWidth = Dimensions.get('window').width;

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const loadTransactions = useCallback(async () => {
    try {
      const allTransactions = await DatabaseService.getTransactionsByMonth(
        selectedYear,
        selectedMonth,
      );
      setTransactions(allTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      Alert.alert('Error', 'Failed to load transactions');
    }
  }, [selectedMonth, selectedYear]);

  const loadAvailableYears = useCallback(async () => {
    try {
      // Get all transactions to find unique years
      const allTransactions = await DatabaseService.getAllTransactions();
      const uniqueYears = [
        ...new Set(allTransactions.map(t => new Date(t.date).getFullYear())),
      ];

      // If no transactions exist, show current year only
      if (uniqueYears.length === 0) {
        const currentYear = new Date().getFullYear();
        setAvailableYears([currentYear]);
      } else {
        // Sort years in descending order (newest first)
        setAvailableYears(uniqueYears.sort((a, b) => b - a));
      }
    } catch (error) {
      console.error('Error loading available years:', error);
      // Fallback to current year
      const currentYear = new Date().getFullYear();
      setAvailableYears([currentYear]);
    }
  }, []);

  const initializeApp = useCallback(async () => {
    try {
      await DatabaseService.initDatabase();
      await loadAvailableYears();
      await loadTransactions();
    } catch (error) {
      console.error('Error initializing app:', error);
      Alert.alert('Error', 'Failed to initialize database');
    }
  }, [loadTransactions, loadAvailableYears]);

  // Initialize database and load transactions
  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  // Load transactions when month/year changes
  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Ensure selected year is valid when available years change
  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      // If current selected year is not available, select the most recent year
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === 'all') return true;
    return transaction.type === activeTab;
  });

  // Calculate totals for display
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Pan responder for floating button
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => dragEnabled,
    onPanResponderMove: (evt, gestureState) => {
      if (dragEnabled) {
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(evt, gestureState);
      }
    },
    onPanResponderRelease: () => {
      pan.extractOffset();
      setDragEnabled(false);
    },
  });

  const addTransaction = async () => {
    if (!amount.trim()) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    const transaction: Omit<Transaction, 'id'> = {
      amount: parseFloat(amount),
      category,
      account,
      notes: notes.trim(),
      type: transactionType,
      date: transactionDate.toISOString(),
    };

    try {
      await DatabaseService.addTransaction(transaction);
      await loadTransactions();
      await loadAvailableYears(); // Reload available years after adding transaction
      setModalVisible(false);
      resetForm();
    } catch (error) {
      console.error('Error adding transaction:', error);
      Alert.alert('Error', 'Failed to add transaction');
    }
  };

  const resetForm = () => {
    setAmount('');
    setNotes('');
    setCategory(categories[0]);
    setAccount(accounts[0]);
    setTransactionType('expense');
    const newDate = new Date();
    setTransactionDate(newDate);
    setYearInputText(newDate.getFullYear().toString());
  };

  const openModal = () => {
    resetForm();
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredTransactions}
        keyExtractor={item => item.id?.toString() || '0'}
        ListHeaderComponent={() => (
          <View>
            {/* Month-Year Selector */}
            <View style={styles.monthYearSelector}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.monthScroll}
                ref={monthScrollRef}
              >
                {months.map((month, index) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.monthButton,
                      selectedMonth === index && styles.selectedMonthButton,
                    ]}
                    onPress={() => setSelectedMonth(index)}
                  >
                    <Text
                      style={[
                        styles.monthText,
                        selectedMonth === index && styles.selectedMonthText,
                      ]}
                    >
                      {month.substring(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.yearRow}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.yearScroll}
                >
                  {availableYears.map(year => (
                    <TouchableOpacity
                      key={year}
                      style={[
                        styles.yearButton,
                        selectedYear === year && styles.selectedYearButton,
                      ]}
                      onPress={() => setSelectedYear(year)}
                    >
                      <Text
                        style={[
                          styles.yearText,
                          selectedYear === year && styles.selectedYearText,
                        ]}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Summary Cards */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Total Income</Text>
                <Text style={styles.incomeAmount}>
                  +${totalIncome.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Total Expense</Text>
                <Text style={styles.expenseAmount}>
                  -${totalExpense.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>Net Balance</Text>
                <Text
                  style={[
                    styles.balanceAmount,
                    totalIncome - totalExpense >= 0
                      ? styles.positiveBalance
                      : styles.negativeBalance,
                  ]}
                >
                  ${(totalIncome - totalExpense).toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Charts Section - only show for income and expense tabs */}
            {(activeTab === 'income' || activeTab === 'expense') && (
              <View style={styles.chartContainer}>
                <Text style={styles.chartTitle}>
                  {activeTab === 'income' ? 'Income' : 'Expense'} by Category
                </Text>
                <PieChart
                  data={categories
                    .map(cat => ({
                      name: cat,
                      population: filteredTransactions
                        .filter(t => t.category === cat && t.type === activeTab)
                        .reduce((sum, t) => sum + t.amount, 0),
                      color: `hsl(${categories.indexOf(cat) * 60}, 70%, 50%)`,
                      legendFontColor: '#7F7F7F',
                      legendFontSize: 12,
                    }))
                    .filter(item => item.population > 0)}
                  width={screenWidth - 32}
                  height={200}
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                />
              </View>
            )}

            {/* Transactions List Header */}
            <Text style={styles.transactionsTitle}>Recent Transactions</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View style={styles.transactionHeader}>
              <Text style={styles.transactionCategory}>
                {emojiMap[item.category]} {item.category}
              </Text>
              <Text
                style={[
                  styles.transactionAmount,
                  item.type === 'income'
                    ? styles.positiveBalance
                    : styles.negativeBalance,
                ]}
              >
                {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
              </Text>
            </View>
            <Text style={styles.transactionAccount}>
              {emojiMap[item.account]} {item.account}
            </Text>
            {item.notes && (
              <Text style={styles.transactionNotes}>📝 {item.notes}</Text>
            )}
            <Text style={styles.transactionDate}>{item.date}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Bottom Navigation - Fixed Position */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={[
            styles.navButton,
            activeTab === 'all' && styles.activeNavButton,
          ]}
          onPress={() => setActiveTab('all')}
        >
          <Text
            style={[
              styles.navButtonText,
              activeTab === 'all' && styles.activeNavButtonText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButton,
            activeTab === 'income' && styles.activeNavButton,
          ]}
          onPress={() => setActiveTab('income')}
        >
          <Text
            style={[
              styles.navButtonText,
              activeTab === 'income' && styles.activeNavButtonText,
            ]}
          >
            Income
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButton,
            activeTab === 'expense' && styles.activeNavButton,
          ]}
          onPress={() => setActiveTab('expense')}
        >
          <Text
            style={[
              styles.navButtonText,
              activeTab === 'expense' && styles.activeNavButtonText,
            ]}
          >
            Expense
          </Text>
        </TouchableOpacity>
      </View>

      {/* Floating Add Button */}
      <Animated.View
        style={[
          styles.floatingButton,
          dragEnabled && {
            opacity: 0.8,
            transform: [
              { scale: 0.95 },
              { translateX: pan.x },
              { translateY: pan.y },
            ],
          },
          !dragEnabled && {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={styles.floatingButtonTouchable}
          activeOpacity={0.7}
          onPress={() => {
            if (!dragEnabled) openModal();
          }}
          onPressIn={() => {
            if (!dragEnabled) {
              dragTimeoutRef.current = setTimeout(() => {
                setDragEnabled(true);
              }, 500);
            }
          }}
          onPressOut={() => {
            if (dragTimeoutRef.current) {
              clearTimeout(dragTimeoutRef.current);
              dragTimeoutRef.current = null;
            }
          }}
        >
          <Text style={styles.floatingButtonText}>+</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Add Transaction Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Transaction</Text>
            <ScrollView
              style={styles.modalScrollContent}
              contentContainerStyle={styles.scrollContentContainer}
              showsVerticalScrollIndicator={false}
            >
              {/* Transaction Date Selection */}
              <TouchableOpacity
                style={styles.customDateButton}
                onPress={() => setShowTransactionDateModal(true)}
              >
                <Text style={styles.customDateButtonText}>
                  Date: {transactionDate.toDateString()} at{' '}
                  {transactionDate.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </TouchableOpacity>

              {/* Transaction Type Toggle */}
              <View style={styles.typeToggle}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    transactionType === 'expense' && styles.activeTypeButton,
                  ]}
                  onPress={() => setTransactionType('expense')}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      transactionType === 'expense' &&
                        styles.activeTypeButtonText,
                    ]}
                  >
                    Expense
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    transactionType === 'income' && styles.activeTypeButton,
                  ]}
                  onPress={() => setTransactionType('income')}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      transactionType === 'income' &&
                        styles.activeTypeButtonText,
                    ]}
                  >
                    Income
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Category Selection */}
              <Text style={styles.label}>Category</Text>
              <View style={styles.row}>
                {categories.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.chip,
                      category === cat && styles.selectedChip,
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={styles.chipText}>
                      {emojiMap[cat]} {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Account Selection */}
              <Text style={styles.label}>Account</Text>
              <View style={styles.row}>
                {accounts.map(acc => (
                  <TouchableOpacity
                    key={acc}
                    style={[
                      styles.chip,
                      account === acc && styles.selectedChip,
                    ]}
                    onPress={() => setAccount(acc)}
                  >
                    <Text style={styles.chipText}>
                      {emojiMap[acc]} {acc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Amount Input */}
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter amount"
                keyboardType="numeric"
              />

              {/* Notes Input */}
              <Text style={styles.label}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.notesInput]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes..."
                multiline
                textAlignVertical="top"
              />

              {/* Modal Buttons */}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={addTransaction}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Transaction Date Modal */}
      <Modal
        visible={showTransactionDateModal}
        animationType="slide"
        transparent
      >
        <View style={styles.modalContainer}>
          <View style={styles.dateModalContent}>
            <Text style={styles.modalTitle}>Select Transaction Date</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.datePickerContainer}>
                <Text style={styles.datePickerLabel}>Month:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {months.map((month, index) => (
                    <TouchableOpacity
                      key={month}
                      style={[
                        styles.datePickerItem,
                        transactionDate.getMonth() === index &&
                          styles.selectedDatePickerItem,
                      ]}
                      onPress={() =>
                        setTransactionDate(
                          new Date(
                            transactionDate.getFullYear(),
                            index,
                            transactionDate.getDate(),
                          ),
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.datePickerText,
                          transactionDate.getMonth() === index &&
                            styles.selectedDatePickerText,
                        ]}
                      >
                        {month.substring(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.datePickerContainer}>
                <Text style={styles.datePickerLabel}>Year:</Text>
                <TextInput
                  style={styles.yearInput}
                  value={yearInputText}
                  onChangeText={text => {
                    setYearInputText(text);
                    // Only update the date when user types a valid 4-digit year
                    if (text.length === 4) {
                      const year = parseInt(text, 10);
                      if (!isNaN(year) && year >= 1900 && year <= 2100) {
                        setTransactionDate(
                          new Date(
                            year,
                            transactionDate.getMonth(),
                            transactionDate.getDate(),
                            transactionDate.getHours(),
                            transactionDate.getMinutes(),
                          ),
                        );
                      }
                    }
                  }}
                  onFocus={() => {
                    // When focused, sync the text with the current date year
                    setYearInputText(transactionDate.getFullYear().toString());
                  }}
                  placeholder="Enter year (e.g., 2024)"
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>

              <View style={styles.datePickerContainer}>
                <Text style={styles.datePickerLabel}>Time:</Text>
                <TouchableOpacity
                  style={styles.timePickerButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={styles.timePickerText}>
                    {transactionDate.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                  <Text style={styles.timePickerIcon}>🕐</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setShowTransactionDateModal(false)}
                >
                  <Text style={styles.addButtonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowTransactionDateModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={transactionDate}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) {
              setTransactionDate(selectedTime);
            }
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    paddingBottom: 100,
  },
  monthYearSelector: {
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  monthScroll: {
    marginBottom: 8,
  },
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yearScroll: {
    flex: 1,
    marginTop: 4,
  },
  yearPickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1565c0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 8,
  },
  yearPickerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  yearPickerArrow: {
    fontSize: 16,
  },
  customButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginLeft: 8,
  },
  customButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  monthButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedMonthButton: {
    backgroundColor: '#1565c0',
  },
  monthText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedMonthText: {
    color: 'white',
    fontWeight: 'bold',
  },
  yearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  selectedYearButton: {
    backgroundColor: '#1565c0',
  },
  yearText: {
    fontSize: 12,
    color: '#666',
  },
  selectedYearText: {
    color: 'white',
    fontWeight: 'bold',
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  incomeAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F44336',
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  positiveBalance: {
    color: '#4CAF50',
  },
  negativeBalance: {
    color: '#F44336',
  },
  chartContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  transactionsContainer: {
    flex: 1,
    margin: 16,
    marginTop: 0,
    marginBottom: 0,
  },
  transactionItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionAccount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  transactionNotes: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  activeNavButton: {
    backgroundColor: '#1565c0',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeNavButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    right: 30,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1565c0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  floatingButtonTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    minHeight: 400,
    padding: 0,
    overflow: 'hidden',
  },
  modalScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    minHeight: 200,
  },
  scrollContentContainer: {
    paddingVertical: 24,
  },
  dateModalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '90%',
    maxHeight: '70%',
    padding: 0,
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 0,
    textAlign: 'center',
    color: '#333',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  customDateButton: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  customDateButtonText: {
    color: '#1565c0',
    fontWeight: '500',
  },
  typeToggle: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTypeButton: {
    backgroundColor: '#1565c0',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTypeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 12,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    margin: 4,
    backgroundColor: '#f9f9f9',
  },
  selectedChip: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1565c0',
  },
  chipText: {
    fontSize: 14,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#1565c0',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  datePickerContainer: {
    marginBottom: 16,
  },
  datePickerLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  datePickerItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
  },
  selectedDatePickerItem: {
    backgroundColor: '#1565c0',
  },
  datePickerText: {
    fontSize: 14,
    color: '#666',
  },
  selectedDatePickerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  yearInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
    width: 60,
    marginHorizontal: 4,
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1565c0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  timePickerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timePickerIcon: {
    fontSize: 18,
    marginLeft: 8,
  },
  timeSeparator: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 8,
    color: '#333',
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#333',
    paddingHorizontal: 16,
  },
});

export default IncomeExpenseAnalysis;
