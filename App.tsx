/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  useColorScheme,
  Modal,
  ScrollView,
  Animated,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import IncomeExpenseAnalysis from './src/features/IncomeExpenseAnalysis';
import FinancialCalculator from './src/features/FinancialCalculator';
import ShoppingList from './src/features/ShoppingList';
import About from './src/features/About';

type TitleBarProps = {
  title: string;
  onMenuPress?: () => void;
};

function TitleBar({ title, onMenuPress }: TitleBarProps) {
  return (
    <View style={styles.titleBar}>
      <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
        <Text style={styles.menuButtonText}>☰</Text>
      </TouchableOpacity>
      <Text style={styles.titleText}>{title}</Text>
      <View style={styles.spacer} />
    </View>
  );
}

function AnalysisScreen() {
  return (
    <View style={styles.screenContainer}>
      <IncomeExpenseAnalysis />
    </View>
  );
}

function CalculatorScreen() {
  return (
    <View style={styles.screenContainer}>
      <FinancialCalculator />
    </View>
  );
}

function ShoppingScreen() {
  return (
    <View style={styles.screenContainer}>
      <ShoppingList />
    </View>
  );
}

function AboutScreen() {
  return (
    <View style={styles.screenContainer}>
      <About />
    </View>
  );
}

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentScreen, setCurrentScreen] = useState<
    'Analysis' | 'Calculator' | 'Shopping' | 'About'
  >('Analysis');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-300))[0]; // Start off-screen

  // Animate drawer
  useEffect(() => {
    if (isMenuVisible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: -300,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [isMenuVisible, slideAnim]);

  const screens = {
    Analysis: AnalysisScreen,
    Calculator: CalculatorScreen,
    Shopping: ShoppingScreen,
    About: AboutScreen,
  };

  const menuItems = [
    { name: 'Income & Expense Analysis', screen: 'Analysis' as const },
    { name: 'Financial Calculator', screen: 'Calculator' as const },
    { name: 'Shopping List', screen: 'Shopping' as const },
    { name: 'About', screen: 'About' as const },
  ];

  // Removed edge swipe gesture

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    flex: 1,
  };

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <View style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={'#1565c0'}
        />

        <TitleBar
          title={
            menuItems.find(item => item.screen === currentScreen)?.name || ''
          }
          onMenuPress={() => setIsMenuVisible(true)}
        />

        <View style={styles.screenContainer}>{screens[currentScreen]()}</View>

        <Modal
          visible={isMenuVisible}
          transparent={true}
          animationType="none"
          onRequestClose={() => setIsMenuVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setIsMenuVisible(false)}
          >
            <Animated.View
              style={[
                styles.menuContainer,
                isDarkMode ? styles.darkBackground : styles.lightBackground,
                {
                  transform: [{ translateX: slideAnim }],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.menuCloseArea}
                onPress={() => setIsMenuVisible(false)}
              />
              <ScrollView style={styles.menuContent}>
                <Text
                  style={[
                    styles.menuTitle,
                    isDarkMode ? styles.darkText : styles.lightText,
                  ]}
                >
                  Menu
                </Text>
                {menuItems.map(item => (
                  <TouchableOpacity
                    key={item.screen}
                    style={[
                      styles.menuItem,
                      currentScreen === item.screen && styles.activeMenuItem,
                    ]}
                    onPress={() => {
                      setCurrentScreen(item.screen);
                      setIsMenuVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.menuItemText,
                        isDarkMode ? styles.darkText : styles.lightText,
                        currentScreen === item.screen &&
                          styles.activeMenuItemText,
                      ]}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  // Removed fullScreenSwipeArea
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1565c0',
  },
  menuButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  titleText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#00e5ff',
    borderRadius: 20,
    padding: 8,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  spacer: {
    width: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  menuContainer: {
    width: '80%',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuCloseArea: {
    height: 80,
  },
  menuContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingTop: 20,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  activeMenuItem: {
    backgroundColor: '#1565c0',
  },
  menuItemText: {
    fontSize: 16,
  },
  activeMenuItemText: {
    color: 'white',
    fontWeight: 'bold',
  },
  screenContainer: {
    flex: 1,
  },
  gestureContainer: {
    flex: 1,
  },
  appContainer: {
    flex: 1,
  },
  darkBackground: {
    backgroundColor: '#2D2D2D',
  },
  lightBackground: {
    backgroundColor: '#FFFFFF',
  },
  darkText: {
    color: '#FFFFFF',
  },
  lightText: {
    color: '#000000',
  },
  edgeSwipeArea: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 80,
    zIndex: 1,
  },
});

export default App;
