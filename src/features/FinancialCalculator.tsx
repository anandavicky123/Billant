import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';

interface CalculatorItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const FinancialCalculator: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCalculator, setCurrentCalculator] = useState<string>('');

  // Calculator inputs
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [periods, setPeriods] = useState('');
  const [principal, setPrincipal] = useState('');
  const [result, setResult] = useState('');

  // TI Calculator display state
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState<string | null>(null);
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [showFunction, setShowFunction] = useState<string | null>(null);

  // TI Calculator state for financial functions
  const [N, setN] = useState(0);
  const [IY, setIY] = useState(0);
  const [PV, setPV] = useState(0);
  const [PMT, setPMT] = useState(0);
  const [FV, setFV] = useState(0);

  // TI Calculator advanced state
  const [secondFunction, setSecondFunction] = useState(false);
  const [showFullNames, setShowFullNames] = useState(false);
  const [displayStatus, setDisplayStatus] = useState({
    secondMode: false,
    invMode: false,
    hypMode: false,
    enterMode: false,
    delMode: false,
    insMode: false,
    bgnMode: false,
    radMode: false,
  });

  // Additional calculator inputs
  const [billAmount, setBillAmount] = useState('');
  const [tipPercentage, setTipPercentage] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [adBudget, setAdBudget] = useState('');
  const [clickThroughRate, setClickThroughRate] = useState('');
  const [conversionRate, setConversionRate] = useState('');
  const [fixedCosts, setFixedCosts] = useState('');
  const [variableCosts, setVariableCosts] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [taxableIncome, setTaxableIncome] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [grossSalary, setGrossSalary] = useState('');

  const [monthlyExpenses, setMonthlyExpenses] = useState('');

  const [targetAmount, setTargetAmount] = useState('');
  const [insurancePremium, setInsurancePremium] = useState('');
  const [loanBalance, setLoanBalance] = useState('');
  const [minimumPayment, setMinimumPayment] = useState('');
  const [extraPayment, setExtraPayment] = useState('');
  const [emergencyMonths, setEmergencyMonths] = useState('');
  const [autoPrice, setAutoPrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [autoLoanTerm, setAutoLoanTerm] = useState('');
  const [autoLoanRate, setAutoLoanRate] = useState('');
  const [distance, setDistance] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');
  const [fuelEfficiency, setFuelEfficiency] = useState('');
  const [homeValue, setHomeValue] = useState('');
  const [annualPropertyTax, setAnnualPropertyTax] = useState('');
  const [educationCost, setEducationCost] = useState('');
  const [yearsUntilEducation, setYearsUntilEducation] = useState('');

  const [currentIncome, setCurrentIncome] = useState('');

  const [budgetAmount, setBudgetAmount] = useState('');

  const calculatorItems: CalculatorItem[] = [
    {
      id: 'loan',
      title: 'Loan Calculator',
      description: 'Calculate monthly payments and total interest',
      icon: '🏠',
    },
    {
      id: 'compound',
      title: 'Compound Interest',
      description: 'Calculate compound interest growth',
      icon: '📈',
    },
    {
      id: 'mortgage',
      title: 'Mortgage Calculator',
      description: 'Home loan calculations',
      icon: '🏡',
    },
    {
      id: 'investment',
      title: 'Investment Return',
      description: 'Calculate ROI and investment growth',
      icon: '💰',
    },
    {
      id: 'retirement',
      title: 'Retirement Planning',
      description: 'Plan for your retirement savings',
      icon: '🏖️',
    },
    {
      id: 'tip',
      title: 'Tip Calculator',
      description: 'Calculate tips and split bills',
      icon: '💡',
    },
    {
      id: 'unitPrice',
      title: 'Unit Price Calculator',
      description: 'Compare unit prices for better deals',
      icon: '🏷️',
    },
    {
      id: 'ads',
      title: 'Ads Calculations',
      description: 'Calculate advertising costs and ROI',
      icon: '📺',
    },
    {
      id: 'breakEven',
      title: 'Break-Even Point',
      description: 'Calculate break-even analysis',
      icon: '⚖️',
    },
    {
      id: 'tax',
      title: 'Tax Calculator',
      description: 'Calculate income tax and deductions',
      icon: '🧾',
    },
    {
      id: 'salary',
      title: 'Salary Calculator',
      description: 'Convert gross to net salary',
      icon: '💼',
    },
    {
      id: 'saving',
      title: 'Saving Goal Calculator',
      description: 'Plan your savings goals',
      icon: '🎯',
    },
    {
      id: 'insurance',
      title: 'Insurance Calculator',
      description: 'Calculate insurance premiums',
      icon: '🛡️',
    },
    {
      id: 'debt',
      title: 'Debt Payoff Calculator',
      description: 'Plan debt repayment strategy',
      icon: '💳',
    },
    {
      id: 'emergency',
      title: 'Emergency Fund Calculator',
      description: 'Calculate emergency fund needs',
      icon: '🚨',
    },
    {
      id: 'auto',
      title: 'Auto Loan Calculator',
      description: 'Calculate car loan payments',
      icon: '🚗',
    },
    {
      id: 'fuel',
      title: 'Fuel Cost Calculator',
      description: 'Calculate travel fuel costs',
      icon: '⛽',
    },
    {
      id: 'property',
      title: 'Property Tax Calculator',
      description: 'Calculate property tax payments',
      icon: '🏘️',
    },
    {
      id: 'education',
      title: 'Education Fund Calculator',
      description: 'Plan for education expenses',
      icon: '🎓',
    },
    {
      id: 'budget',
      title: 'Budget Calculator',
      description: 'Create and manage budgets',
      icon: '📊',
    },
  ];

  // TI Calculator functions
  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(String(inputValue));
    } else if (operation) {
      const currentValue = parseFloat(previousValue);
      let calcResult = 0;

      switch (operation) {
        case '+':
          calcResult = currentValue + inputValue;
          break;
        case '-':
          calcResult = currentValue - inputValue;
          break;
        case '×':
          calcResult = currentValue * inputValue;
          break;
        case '÷':
          calcResult = currentValue / inputValue;
          break;
        case '^':
          calcResult = Math.pow(currentValue, inputValue);
          break;
        default:
          return;
      }

      setDisplay(String(calcResult));
      setPreviousValue(String(calcResult));
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    if (operation && previousValue !== null) {
      performOperation('=');
      setOperation(null);
      setPreviousValue(null);
      setWaitingForOperand(true);
    }
  };

  // Additional TI Calculator functions
  const toggleSign = () => {
    if (display === '0') return;
    setDisplay(display.startsWith('-') ? display.substring(1) : '-' + display);
  };

  const calculateSquareRoot = () => {
    const value = parseFloat(display);
    if (value < 0) {
      setDisplay('Error');
      return;
    }
    setShowFunction('√(');
    setDisplay(String(Math.sqrt(value)));
    setWaitingForOperand(true);
  };

  const calculateSquare = () => {
    const value = parseFloat(display);
    setShowFunction('sqr(');
    setDisplay(String(value * value));
    setWaitingForOperand(true);
  };

  const calculateReciprocal = () => {
    const value = parseFloat(display);
    if (value === 0) {
      setDisplay('Error');
      return;
    }
    setShowFunction('1/(');
    setDisplay(String(1 / value));
    setWaitingForOperand(true);
  };

  const calculatePower = () => {
    const inputValue = parseFloat(display);
    if (previousValue === null) {
      setPreviousValue(String(inputValue));
    }
    setWaitingForOperand(true);
    setOperation('^');
    setShowFunction('y^x');
  };

  const [lastCEPress, setLastCEPress] = useState(0);

  const clearEntry = () => {
    const now = Date.now();
    if (now - lastCEPress < 1000) {
      // Double press detected - reset everything
      setDisplay('0');
      setOperation(null);
      setPreviousValue(null);
      setWaitingForOperand(false);
      setShowFunction(null);
      setN(0);
      setIY(0);
      setPV(0);
      setPMT(0);
      setFV(0);
    } else {
      // Single press - just clear display
      setDisplay('0');
      setWaitingForOperand(false);
      setShowFunction(null);
    }
    setLastCEPress(now);
  };

  // TI Financial function handlers
  const handleFinancialFunction = (func: string) => {
    const currentValue = parseFloat(display);
    if (isNaN(currentValue)) return;

    switch (func) {
      case 'N':
        setN(currentValue);
        setShowFunction('N=' + currentValue);
        break;
      case 'I/Y':
        setIY(currentValue);
        setShowFunction('I/Y=' + currentValue);
        break;
      case 'PV':
        setPV(currentValue);
        setShowFunction('PV=' + currentValue);
        break;
      case 'PMT':
        setPMT(currentValue);
        setShowFunction('PMT=' + currentValue);
        break;
      case 'FV':
        setFV(currentValue);
        setShowFunction('FV=' + currentValue);
        break;
      case 'CPT':
        // CPT doesn't store a value, just triggers calculation
        setShowFunction('CPT');
        return; // Don't reset display for CPT
    }
    setWaitingForOperand(true); // Reset display for next input
  };

  // Handle 2ND function toggle
  const toggle2ndFunction = () => {
    setSecondFunction(!secondFunction);
    setDisplayStatus(prev => ({
      ...prev,
      secondMode: !prev.secondMode,
    }));
  };

  // Toggle display between short names and full names
  const toggleDisplayNames = () => {
    setShowFullNames(!showFullNames);
  };

  // Eraser function for → button
  const eraseLastDigit = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  // Get display text for function buttons
  const getButtonText = (shortName: string) => {
    if (!showFullNames) return shortName;

    const fullNames: Record<string, string> = {
      N: 'Periods',
      'I/Y': 'Interest/Year',
      PV: 'Present Value',
      PMT: 'Payment',
      FV: 'Future Value',
      INV: 'Inverse',
      LN: 'Natural Log',
      STO: 'Store',
      RCL: 'Recall',
      'CE|C': 'Clear Entry',
      CF: 'Cash Flow',
      NPV: 'Net Present Val',
      IRR: 'Internal Rate',
    };

    return fullNames[shortName] || shortName;
  };

  // Calculate FV using the provided formula
  const calculateFV = (
    nPeriods: number,
    interestYearly: number,
    presentValue: number,
    payment: number,
    paymentAtBeginning: boolean = false,
  ): number => {
    const r = interestYearly / 100 / 12;
    const factor = Math.pow(1 + r, nPeriods);

    const timingAdjustment = paymentAtBeginning ? 1 + r : 1;

    const futureValue =
      presentValue * factor + payment * ((factor - 1) / r) * timingAdjustment;

    return futureValue;
  };

  const computeFinancialValue = () => {
    try {
      // When CPT + FV is pressed, calculate FV using the current TVM variables
      const calculatedResult = calculateFV(N, IY, PV, PMT, false);
      const absoluteResult = Math.abs(calculatedResult); // Remove negative sign
      setDisplay(absoluteResult.toFixed(2));
      setFV(absoluteResult);
      setShowFunction('FV=' + absoluteResult.toFixed(2));
    } catch (error) {
      setDisplay('Error');
      setShowFunction('ERR');
    }
  };

  const openCalculator = (calculatorType: string) => {
    if (calculatorType === 'business') {
      // Business calculator is always visible, just scroll to top
      return;
    }
    setCurrentCalculator(calculatorType);
    setResult(''); // Reset result when switching calculators
    setModalVisible(true);
  };

  const calculate_function = () => {
    let calculatedResult = '';

    switch (currentCalculator) {
      case 'loan':
        if (loanAmount && interestRate && loanTerm) {
          const loanPrincipal = parseFloat(loanAmount);
          const monthlyRate = parseFloat(interestRate) / 100 / 12;
          const numberOfPayments = parseFloat(loanTerm) * 12;

          const payment =
            (loanPrincipal *
              (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

          calculatedResult = `Monthly Payment: $${payment.toFixed(2)}`;
        }
        break;

      case 'compound':
        if (principal && interestRate && periods) {
          const p = parseFloat(principal);
          const r = parseFloat(interestRate) / 100;
          const t = parseFloat(periods);

          const compound = p * Math.pow(1 + r, t);
          calculatedResult = `Future Value: $${compound.toFixed(2)}`;
        }
        break;

      case 'mortgage':
        if (loanAmount && interestRate && loanTerm) {
          const loanPrincipal = parseFloat(loanAmount);
          const monthlyRate = parseFloat(interestRate) / 100 / 12;
          const numberOfPayments = parseFloat(loanTerm) * 12;

          const payment =
            (loanPrincipal *
              (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

          const totalInterest = payment * numberOfPayments - loanPrincipal;
          calculatedResult = `Monthly Payment: $${payment.toFixed(
            2,
          )}\nTotal Interest: $${totalInterest.toFixed(2)}`;
        }
        break;

      case 'investment':
        if (principal && interestRate && periods) {
          const p = parseFloat(principal);
          const r = parseFloat(interestRate) / 100;
          const t = parseFloat(periods);

          const future = p * Math.pow(1 + r, t);
          const totalReturn = future - p;
          calculatedResult = `Future Value: $${future.toFixed(
            2,
          )}\nTotal Return: $${totalReturn.toFixed(2)}`;
        }
        break;

      case 'retirement':
        if (monthlyPayment && interestRate && periods) {
          const monthlyPmt = parseFloat(monthlyPayment);
          const monthlyRate = parseFloat(interestRate) / 100 / 12;
          const numberOfPayments = parseFloat(periods) * 12;

          const future =
            monthlyPmt *
            ((Math.pow(1 + monthlyRate, numberOfPayments) - 1) / monthlyRate);

          calculatedResult = `Retirement Fund: $${future.toFixed(2)}`;
        }
        break;

      case 'tip':
        if (billAmount && tipPercentage) {
          const bill = parseFloat(billAmount);
          const tip = parseFloat(tipPercentage) / 100;
          const tipAmount = bill * tip;
          const total = bill + tipAmount;
          calculatedResult = `Tip Amount: $${tipAmount.toFixed(
            2,
          )}\nTotal: $${total.toFixed(2)}`;
        }
        break;

      case 'unitPrice':
        if (totalPrice && quantity) {
          const price = parseFloat(totalPrice);
          const qty = parseFloat(quantity);
          const unitPrice = price / qty;
          calculatedResult = `Unit Price: $${unitPrice.toFixed(2)} per unit`;
        }
        break;

      case 'ads':
        if (adBudget && clickThroughRate && conversionRate) {
          const budget = parseFloat(adBudget);
          const ctr = parseFloat(clickThroughRate) / 100;
          const cr = parseFloat(conversionRate) / 100;
          const clicks = budget * ctr;
          const conversions = clicks * cr;
          const costPerConversion = budget / conversions;
          calculatedResult = `Estimated Clicks: ${clicks.toFixed(
            0,
          )}\nConversions: ${conversions.toFixed(
            0,
          )}\nCost per Conversion: $${costPerConversion.toFixed(2)}`;
        }
        break;

      case 'breakEven':
        if (fixedCosts && variableCosts && sellingPrice) {
          const fixed = parseFloat(fixedCosts);
          const variable = parseFloat(variableCosts);
          const selling = parseFloat(sellingPrice);
          const breakEvenUnits = fixed / (selling - variable);
          const breakEvenRevenue = breakEvenUnits * selling;
          calculatedResult = `Break-Even Units: ${breakEvenUnits.toFixed(
            0,
          )}\nBreak-Even Revenue: $${breakEvenRevenue.toFixed(2)}`;
        }
        break;

      case 'tax':
        if (taxableIncome && taxRate) {
          const income = parseFloat(taxableIncome);
          const rate = parseFloat(taxRate) / 100;
          const tax = income * rate;
          const afterTax = income - tax;
          calculatedResult = `Tax Amount: $${tax.toFixed(
            2,
          )}\nAfter Tax Income: $${afterTax.toFixed(2)}`;
        }
        break;

      case 'salary':
        if (grossSalary && taxRate) {
          const gross = parseFloat(grossSalary);
          const rate = parseFloat(taxRate) / 100;
          const netAmount = gross * (1 - rate);
          calculatedResult = `Net Salary: $${netAmount.toFixed(
            2,
          )}\nTax Deducted: $${(gross - netAmount).toFixed(2)}`;
        }
        break;

      case 'saving':
        if (targetAmount && interestRate && periods) {
          const target = parseFloat(targetAmount);
          const rate = parseFloat(interestRate) / 100 / 12;
          const months = parseFloat(periods) * 12;
          const monthlySaving =
            target / ((Math.pow(1 + rate, months) - 1) / rate);
          calculatedResult = `Monthly Savings Needed: $${monthlySaving.toFixed(
            2,
          )}`;
        }
        break;

      case 'insurance':
        if (homeValue && insurancePremium) {
          const value = parseFloat(homeValue);
          const premium = parseFloat(insurancePremium);
          const coverageRatio = (premium / value) * 100;
          calculatedResult = `Annual Premium: $${premium.toFixed(
            2,
          )}\nCoverage Ratio: ${coverageRatio.toFixed(2)}%`;
        }
        break;

      case 'debt':
        if (loanBalance && interestRate && minimumPayment && extraPayment) {
          const balance = parseFloat(loanBalance);
          const rate = parseFloat(interestRate) / 100 / 12;
          const minPay = parseFloat(minimumPayment);
          const extra = parseFloat(extraPayment);
          const totalPayment = minPay + extra;

          let months = 0;
          let currentBalance = balance;
          while (currentBalance > 0 && months < 360) {
            const interestPayment = currentBalance * rate;
            const principalPayment = totalPayment - interestPayment;
            currentBalance -= principalPayment;
            months++;
          }
          calculatedResult = `Payoff Time: ${months} months (${(
            months / 12
          ).toFixed(1)} years)\nExtra Payment Saves: ${360 - months} months`;
        }
        break;

      case 'emergency':
        if (monthlyExpenses && emergencyMonths) {
          const expenses = parseFloat(monthlyExpenses);
          const months = parseFloat(emergencyMonths);
          const emergencyFund = expenses * months;
          calculatedResult = `Emergency Fund Needed: $${emergencyFund.toFixed(
            2,
          )}`;
        }
        break;

      case 'auto':
        if (autoPrice && downPayment && autoLoanTerm && autoLoanRate) {
          const price = parseFloat(autoPrice);
          const down = parseFloat(downPayment);
          const autoLoanAmount = price - down;
          const rate = parseFloat(autoLoanRate) / 100 / 12;
          const months = parseFloat(autoLoanTerm) * 12;
          const payment =
            (autoLoanAmount * rate * Math.pow(1 + rate, months)) /
            (Math.pow(1 + rate, months) - 1);
          calculatedResult = `Monthly Payment: $${payment.toFixed(
            2,
          )}\nTotal Interest: $${(payment * months - autoLoanAmount).toFixed(
            2,
          )}`;
        }
        break;

      case 'fuel':
        if (distance && fuelPrice && fuelEfficiency) {
          const dist = parseFloat(distance);
          const price = parseFloat(fuelPrice);
          const mpg = parseFloat(fuelEfficiency);
          const gallons = dist / mpg;
          const cost = gallons * price;
          calculatedResult = `Fuel Needed: ${gallons.toFixed(
            2,
          )} gallons\nTotal Cost: $${cost.toFixed(2)}`;
        }
        break;

      case 'property':
        if (homeValue && annualPropertyTax) {
          const value = parseFloat(homeValue);
          const propertyTaxRate = parseFloat(annualPropertyTax) / 100;
          const annualTax = value * propertyTaxRate;
          const monthlyTax = annualTax / 12;
          calculatedResult = `Annual Property Tax: $${annualTax.toFixed(
            2,
          )}\nMonthly Escrow: $${monthlyTax.toFixed(2)}`;
        }
        break;

      case 'education':
        if (educationCost && yearsUntilEducation && interestRate) {
          const cost = parseFloat(educationCost);
          const years = parseFloat(yearsUntilEducation);
          const rate = parseFloat(interestRate) / 100 / 12;
          const months = years * 12;
          const monthlySaving =
            cost / ((Math.pow(1 + rate, months) - 1) / rate);
          calculatedResult = `Monthly Savings Needed: $${monthlySaving.toFixed(
            2,
          )}\nTotal Saved: $${(monthlySaving * months).toFixed(2)}`;
        }
        break;

      case 'budget':
        if (currentIncome && budgetAmount) {
          const income = parseFloat(currentIncome);
          const budget = parseFloat(budgetAmount);
          const percentage = (budget / income) * 100;
          const remaining = income - budget;
          calculatedResult = `Budget Percentage: ${percentage.toFixed(
            1,
          )}%\nRemaining Income: $${remaining.toFixed(2)}`;
        }
        break;

      default:
        calculatedResult = 'Please fill all required fields';
    }

    setResult(calculatedResult);
  };

  const renderTICalculator = () => (
    <View style={styles.tiCalculator}>
      <View style={styles.calculatorHeader}>
        <Text style={styles.calculatorBrand}>BA II Plus</Text>
        <Text style={styles.calculatorSubtitle}>TEXAS INSTRUMENTS</Text>
      </View>

      <View style={styles.calculatorDisplay}>
        {/* Status indicators row */}
        <View style={styles.statusRow}>
          <Text style={styles.statusText}>
            {displayStatus.secondMode ? '2nd ' : ''}
            {displayStatus.invMode ? 'INV ' : ''}
            {displayStatus.hypMode ? 'HYP' : ''}
          </Text>
          <Text style={styles.statusText}>
            {showFunction ? showFunction : ''}
          </Text>
          <Text style={styles.statusText}>
            {displayStatus.delMode ? '⬆⬇ ' : ''}
            {displayStatus.delMode ? 'DEL ' : ''}
            {displayStatus.insMode ? 'INS ' : ''}
            {displayStatus.bgnMode ? 'BGN ' : ''}
            {displayStatus.radMode ? 'RAD' : ''}
            {' ◀'}
          </Text>
        </View>
        {/* Main display */}
        <Text style={styles.displayText}>{display}</Text>
      </View>

      <View style={styles.calculatorButtons}>
        {/* Row 0 - Top function buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={() => {
              /* QUIT */
            }}
          >
            <Text style={styles.functionText}>QUIT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={() => {
              /* SET */
            }}
          >
            <Text style={styles.functionText}>SET</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={() => {
              /* DEL */
            }}
          >
            <Text style={styles.functionText}>DEL</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={() => {
              /* INS */
            }}
          >
            <Text style={styles.functionText}>INS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={toggleDisplayNames}
          >
            <Text style={styles.functionText}>
              {showFullNames ? 'SHORT' : 'FULL'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Row 1 - CPT, ENTER, arrows */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={() => handleFinancialFunction('CPT')}
          >
            <Text style={styles.functionText}>CPT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={() => {
              /* ENTER */
            }}
          >
            <Text style={styles.functionText}>ENTER</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={() => {
              /* UP ARROW */
            }}
          >
            <Text style={styles.functionText}>↑</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={() => {
              /* DOWN ARROW */
            }}
          >
            <Text style={styles.functionText}>↓</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={() => {
              /* ENTER */
            }}
          >
            <Text style={styles.functionText}>ENTER</Text>
          </TouchableOpacity>
        </View>

        {/* Row 2 - 2ND, CF, NPV, IRR, Arrow */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.secondButton]}
            onPress={toggle2ndFunction}
          >
            <Text style={styles.secondText}>2ND</Text>
            <Text style={styles.subText}>xP/Y</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={() => {
              /* CF */
            }}
          >
            <Text style={styles.functionText}>{getButtonText('CF')}</Text>
            <Text style={styles.subText}>P/Y</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={() => {
              /* NPV */
            }}
          >
            <Text style={styles.functionText}>{getButtonText('NPV')}</Text>
            <Text style={styles.subText}>AMORT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={() => {
              /* IRR */
            }}
          >
            <Text style={styles.functionText}>{getButtonText('IRR')}</Text>
            <Text style={styles.subText}>BGN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={eraseLastDigit}
          >
            <Text style={styles.functionText}>→</Text>
            <Text style={styles.subText}>CLR TVM</Text>
          </TouchableOpacity>
        </View>

        {/* Row 3 - N, I/Y, PV, PMT, FV */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.financialButton]}
            onPress={() => handleFinancialFunction('N')}
          >
            <Text style={styles.financialText}>{getButtonText('N')}</Text>
            <Text style={styles.subText}>k</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.financialButton]}
            onPress={() => handleFinancialFunction('I/Y')}
          >
            <Text style={styles.financialText}>{getButtonText('I/Y')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.financialButton]}
            onPress={() => handleFinancialFunction('PV')}
          >
            <Text style={styles.financialText}>{getButtonText('PV')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.financialButton]}
            onPress={() => handleFinancialFunction('PMT')}
          >
            <Text style={styles.financialText}>{getButtonText('PMT')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.financialButton]}
            onPress={() => {
              if (showFunction === 'CPT') {
                // CPT+FV pressed - calculate FV
                computeFinancialValue();
              } else {
                // Just FV pressed - handle financial function
                handleFinancialFunction('FV');
              }
            }}
          >
            <Text style={styles.financialText}>{getButtonText('FV')}</Text>
            <Text style={styles.subText}>RAND</Text>
          </TouchableOpacity>
        </View>

        {/* Row 4 - %, √x, x², 1/x, • */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={() => {
              /* % */
            }}
          >
            <Text style={styles.functionText}>%</Text>
            <Text style={styles.subText}>HYP</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={calculateSquareRoot}
          >
            <Text style={styles.functionText}>√x</Text>
            <Text style={styles.subText}>SIN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={calculateSquare}
          >
            <Text style={styles.functionText}>x²</Text>
            <Text style={styles.subText}>COS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={calculateReciprocal}
          >
            <Text style={styles.functionText}>1/x</Text>
            <Text style={styles.subText}>TAN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.operatorButton]}
            onPress={() => performOperation('÷')}
          >
            <Text style={styles.operatorText}>•</Text>
            <Text style={styles.subText}>x!</Text>
          </TouchableOpacity>
        </View>

        {/* Row 5 - INV, (, ), y^x, × */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={() => {
              /* INV */
            }}
          >
            <Text style={styles.functionText}>{getButtonText('INV')}</Text>
            <Text style={styles.subText}>e^x</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={() => {
              /* ( */
            }}
          >
            <Text style={styles.functionText}>(</Text>
            <Text style={styles.subText}>DATA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={() => {
              /* ) */
            }}
          >
            <Text style={styles.functionText}>)</Text>
            <Text style={styles.subText}>STAT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={calculatePower}
          >
            <Text style={styles.functionText}>y^x</Text>
            <Text style={styles.subText}>BOND</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.operatorButton]}
            onPress={() => performOperation('×')}
          >
            <Text style={styles.operatorText}>×</Text>
          </TouchableOpacity>
        </View>

        {/* Row 6 - LN, 7, 8, 9, - */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={() => {
              /* LN */
            }}
          >
            <Text style={styles.functionText}>{getButtonText('LN')}</Text>
            <Text style={styles.subText}>ROUND</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.numberButton]}
            onPress={() => inputNumber('7')}
          >
            <Text style={styles.numberText}>7</Text>
            <Text style={styles.subText}>DEPR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.numberButton]}
            onPress={() => inputNumber('8')}
          >
            <Text style={styles.numberText}>8</Text>
            <Text style={styles.subText}>Δ%</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.numberButton]}
            onPress={() => inputNumber('9')}
          >
            <Text style={styles.numberText}>9</Text>
            <Text style={styles.subText}>BRKEVN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.operatorButton]}
            onPress={() => performOperation('-')}
          >
            <Text style={styles.operatorText}>-</Text>
            <Text style={styles.subText}>nPr</Text>
          </TouchableOpacity>
        </View>

        {/* Row 7 - STO, 4, 5, 6, + */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={() => {
              /* STO */
            }}
          >
            <Text style={styles.functionText}>{getButtonText('STO')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.numberButton]}
            onPress={() => inputNumber('4')}
          >
            <Text style={styles.numberText}>4</Text>
            <Text style={styles.subText}>DATE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.numberButton]}
            onPress={() => inputNumber('5')}
          >
            <Text style={styles.numberText}>5</Text>
            <Text style={styles.subText}>ICONV</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.numberButton]}
            onPress={() => inputNumber('6')}
          >
            <Text style={styles.numberText}>6</Text>
            <Text style={styles.subText}>PROFIT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.operatorButton]}
            onPress={() => performOperation('+')}
          >
            <Text style={styles.operatorText}>+</Text>
            <Text style={styles.subText}>nCr</Text>
          </TouchableOpacity>
        </View>

        {/* Row 8 - RCL, 1, 2, 3, = */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={() => {
              /* RCL */
            }}
          >
            <Text style={styles.functionText}>{getButtonText('RCL')}</Text>
            <Text style={styles.subText}>CLR WORK</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.numberButton]}
            onPress={() => inputNumber('1')}
          >
            <Text style={styles.numberText}>1</Text>
            <Text style={styles.subText}>MEM</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.numberButton]}
            onPress={() => inputNumber('2')}
          >
            <Text style={styles.numberText}>2</Text>
            <Text style={styles.subText}>FORMAT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.numberButton]}
            onPress={() => inputNumber('3')}
          >
            <Text style={styles.numberText}>3</Text>
            <Text style={styles.subText}>RESET</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.equalsButton]}
            onPress={calculate}
          >
            <Text style={styles.equalsText}>=</Text>
            <Text style={styles.subText}>ANS</Text>
          </TouchableOpacity>
        </View>

        {/* Row 9 - CE|C, 0, ., +/- */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={clearEntry}
          >
            <Text style={styles.functionText}>{getButtonText('CE|C')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.numberButton]}
            onPress={() => inputNumber('0')}
          >
            <Text style={styles.numberText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.numberButton]}
            onPress={inputDecimal}
          >
            <Text style={styles.numberText}>.</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.functionButton]}
            onPress={toggleSign}
          >
            <Text style={styles.functionText}>+|-</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderCalculatorModal = () => {
    switch (currentCalculator) {
      case 'loan':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Loan Calculator</Text>
            <TextInput
              style={styles.input}
              placeholder="Loan Amount ($)"
              value={loanAmount}
              onChangeText={setLoanAmount}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Annual Interest Rate (%)"
              value={interestRate}
              onChangeText={setInterestRate}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Loan Term (years)"
              value={loanTerm}
              onChangeText={setLoanTerm}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={calculate_function}
            >
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>
            {result ? <Text style={styles.result}>{result}</Text> : null}
          </View>
        );

      case 'compound':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Compound Interest Calculator</Text>
            <TextInput
              style={styles.input}
              placeholder="Principal Amount ($)"
              value={principal}
              onChangeText={setPrincipal}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Annual Interest Rate (%)"
              value={interestRate}
              onChangeText={setInterestRate}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Time Period (years)"
              value={periods}
              onChangeText={setPeriods}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={calculate_function}
            >
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>
            {result ? <Text style={styles.result}>{result}</Text> : null}
          </View>
        );

      case 'mortgage':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Mortgage Calculator</Text>
            <TextInput
              style={styles.input}
              placeholder="Home Price ($)"
              value={loanAmount}
              onChangeText={setLoanAmount}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Annual Interest Rate (%)"
              value={interestRate}
              onChangeText={setInterestRate}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Loan Term (years)"
              value={loanTerm}
              onChangeText={setLoanTerm}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={calculate_function}
            >
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>
            {result ? <Text style={styles.result}>{result}</Text> : null}
          </View>
        );

      case 'investment':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Investment Return Calculator</Text>
            <TextInput
              style={styles.input}
              placeholder="Initial Investment ($)"
              value={principal}
              onChangeText={setPrincipal}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Annual Return Rate (%)"
              value={interestRate}
              onChangeText={setInterestRate}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Investment Period (years)"
              value={periods}
              onChangeText={setPeriods}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={calculate_function}
            >
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>
            {result ? <Text style={styles.result}>{result}</Text> : null}
          </View>
        );

      case 'retirement':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Retirement Planning Calculator
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Monthly Contribution ($)"
              value={monthlyPayment}
              onChangeText={setMonthlyPayment}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Annual Return Rate (%)"
              value={interestRate}
              onChangeText={setInterestRate}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Years to Retirement"
              value={periods}
              onChangeText={setPeriods}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={calculate_function}
            >
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>
            {result ? <Text style={styles.result}>{result}</Text> : null}
          </View>
        );

      case 'tip':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tip Calculator</Text>
            <TextInput
              style={styles.input}
              placeholder="Bill Amount ($)"
              value={billAmount}
              onChangeText={setBillAmount}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Tip Percentage (%)"
              value={tipPercentage}
              onChangeText={setTipPercentage}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={calculate_function}
            >
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>
            {result ? <Text style={styles.result}>{result}</Text> : null}
          </View>
        );

      case 'unitPrice':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Unit Price Calculator</Text>
            <TextInput
              style={styles.input}
              placeholder="Total Price ($)"
              value={totalPrice}
              onChangeText={setTotalPrice}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={calculate_function}
            >
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>
            {result ? <Text style={styles.result}>{result}</Text> : null}
          </View>
        );

      case 'ads':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ads Calculations</Text>
            <TextInput
              style={styles.input}
              placeholder="Ad Budget ($)"
              value={adBudget}
              onChangeText={setAdBudget}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Click Through Rate (%)"
              value={clickThroughRate}
              onChangeText={setClickThroughRate}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Conversion Rate (%)"
              value={conversionRate}
              onChangeText={setConversionRate}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={calculate_function}
            >
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>
            {result ? <Text style={styles.result}>{result}</Text> : null}
          </View>
        );

      case 'breakEven':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Break-Even Point Calculator</Text>
            <TextInput
              style={styles.input}
              placeholder="Fixed Costs ($)"
              value={fixedCosts}
              onChangeText={setFixedCosts}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Variable Cost per Unit ($)"
              value={variableCosts}
              onChangeText={setVariableCosts}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Selling Price per Unit ($)"
              value={sellingPrice}
              onChangeText={setSellingPrice}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={calculate_function}
            >
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>
            {result ? <Text style={styles.result}>{result}</Text> : null}
          </View>
        );

      case 'tax':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tax Calculator</Text>
            <TextInput
              style={styles.input}
              placeholder="Taxable Income ($)"
              value={taxableIncome}
              onChangeText={setTaxableIncome}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Tax Rate (%)"
              value={taxRate}
              onChangeText={setTaxRate}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={calculate_function}
            >
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>
            {result ? <Text style={styles.result}>{result}</Text> : null}
          </View>
        );

      case 'salary':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Salary Calculator</Text>
            <TextInput
              style={styles.input}
              placeholder="Gross Salary ($)"
              value={grossSalary}
              onChangeText={setGrossSalary}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Tax Rate (%)"
              value={taxRate}
              onChangeText={setTaxRate}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={calculate_function}
            >
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>
            {result ? <Text style={styles.result}>{result}</Text> : null}
          </View>
        );

      case 'saving':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Saving Goal Calculator</Text>
            <TextInput
              style={styles.input}
              placeholder="Target Amount ($)"
              value={targetAmount}
              onChangeText={setTargetAmount}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Annual Interest Rate (%)"
              value={interestRate}
              onChangeText={setInterestRate}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Time Period (years)"
              value={periods}
              onChangeText={setPeriods}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={calculate_function}
            >
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>
            {result ? <Text style={styles.result}>{result}</Text> : null}
          </View>
        );

      case 'insurance':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Insurance Calculator</Text>
            <TextInput
              style={styles.input}
              placeholder="Home Value ($)"
              value={homeValue}
              onChangeText={setHomeValue}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Insurance Premium ($)"
              value={insurancePremium}
              onChangeText={setInsurancePremium}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={calculate_function}
            >
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>
            {result ? <Text style={styles.result}>{result}</Text> : null}
          </View>
        );

      case 'debt':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Debt Payoff Calculator</Text>
            <TextInput
              style={styles.input}
              placeholder="Loan Balance ($)"
              value={loanBalance}
              onChangeText={setLoanBalance}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Annual Interest Rate (%)"
              value={interestRate}
              onChangeText={setInterestRate}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Minimum Payment ($)"
              value={minimumPayment}
              onChangeText={setMinimumPayment}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Extra Payment ($)"
              value={extraPayment}
              onChangeText={setExtraPayment}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={calculate_function}
            >
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>
            {result ? <Text style={styles.result}>{result}</Text> : null}
          </View>
        );

      case 'emergency':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Emergency Fund Calculator</Text>
            <TextInput
              style={styles.input}
              placeholder="Monthly Expenses ($)"
              value={monthlyExpenses}
              onChangeText={setMonthlyExpenses}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Emergency Months"
              value={emergencyMonths}
              onChangeText={setEmergencyMonths}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={calculate_function}
            >
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>
            {result ? <Text style={styles.result}>{result}</Text> : null}
          </View>
        );

      case 'auto':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Auto Loan Calculator</Text>
            <TextInput
              style={styles.input}
              placeholder="Auto Price ($)"
              value={autoPrice}
              onChangeText={setAutoPrice}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Down Payment ($)"
              value={downPayment}
              onChangeText={setDownPayment}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Loan Term (years)"
              value={autoLoanTerm}
              onChangeText={setAutoLoanTerm}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Interest Rate (%)"
              value={autoLoanRate}
              onChangeText={setAutoLoanRate}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={calculate_function}
            >
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>
            {result ? <Text style={styles.result}>{result}</Text> : null}
          </View>
        );

      case 'fuel':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Fuel Cost Calculator</Text>
            <TextInput
              style={styles.input}
              placeholder="Distance (miles)"
              value={distance}
              onChangeText={setDistance}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Fuel Price per Gallon ($)"
              value={fuelPrice}
              onChangeText={setFuelPrice}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Fuel Efficiency (MPG)"
              value={fuelEfficiency}
              onChangeText={setFuelEfficiency}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={calculate_function}
            >
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>
            {result ? <Text style={styles.result}>{result}</Text> : null}
          </View>
        );

      case 'property':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Property Tax Calculator</Text>
            <TextInput
              style={styles.input}
              placeholder="Home Value ($)"
              value={homeValue}
              onChangeText={setHomeValue}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Annual Property Tax Rate (%)"
              value={annualPropertyTax}
              onChangeText={setAnnualPropertyTax}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={calculate_function}
            >
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>
            {result ? <Text style={styles.result}>{result}</Text> : null}
          </View>
        );

      case 'education':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Education Fund Calculator</Text>
            <TextInput
              style={styles.input}
              placeholder="Education Cost ($)"
              value={educationCost}
              onChangeText={setEducationCost}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Years Until Education"
              value={yearsUntilEducation}
              onChangeText={setYearsUntilEducation}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Expected Return Rate (%)"
              value={interestRate}
              onChangeText={setInterestRate}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={calculate_function}
            >
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>
            {result ? <Text style={styles.result}>{result}</Text> : null}
          </View>
        );

      case 'budget':
        return (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Budget Calculator</Text>
            <TextInput
              style={styles.input}
              placeholder="Current Income ($)"
              value={currentIncome}
              onChangeText={setCurrentIncome}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Budget Amount ($)"
              value={budgetAmount}
              onChangeText={setBudgetAmount}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.calculateButton}
              onPress={calculate_function}
            >
              <Text style={styles.calculateButtonText}>Calculate</Text>
            </TouchableOpacity>
            {result ? <Text style={styles.result}>{result}</Text> : null}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.header}>💼 Business Calculator</Text>

      {/* Texas Instruments Business Calculator */}
      {renderTICalculator()}

      <Text style={styles.sectionTitle}>Financial Calculators</Text>

      <View style={styles.grid}>
        {calculatorItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.gridItem}
            onPress={() => openCalculator(item.id)}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {renderCalculatorModal()}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.calculateButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 16,
    color: '#333',
  },
  // TI Calculator Styles
  tiCalculator: {
    backgroundColor: '#2c3e50',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  calculatorHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  calculatorBrand: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  calculatorSubtitle: {
    color: '#bdc3c7',
    fontSize: 12,
    letterSpacing: 3,
  },
  calculatorDisplay: {
    backgroundColor: '#34495e',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    minHeight: 80,
    justifyContent: 'space-between',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  statusText: {
    color: '#95a5a6',
    fontSize: 8,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  displayText: {
    color: '#2ecc71',
    fontSize: 24,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  calculatorButtons: {
    gap: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  button: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  numberButton: {
    backgroundColor: '#ecf0f1',
  },
  numberText: {
    color: '#2c3e50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  operatorButton: {
    backgroundColor: '#e67e22',
  },
  operatorText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  functionButton: {
    backgroundColor: '#95a5a6',
  },
  functionText: {
    color: '#2c3e50',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subText: {
    color: '#7f8c8d',
    fontSize: 8,
    marginTop: 2,
  },
  equalsButton: {
    backgroundColor: '#27ae60',
  },
  equalsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  zeroButton: {
    flex: 1,
  },
  // Grid Styles
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    color: '#333',
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalContent: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    width: '100%',
    fontSize: 16,
  },
  calculateButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  result: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  backButton: {
    backgroundColor: '#6c757d',
    borderRadius: 8,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  // TI Calculator specific styles
  secondButton: {
    backgroundColor: '#f39c12',
  },
  secondText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  financialButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  financialText: {
    color: '#2c3e50',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 10,
  },
  activeButton: {
    backgroundColor: '#3498db',
  },
});

export default FinancialCalculator;
