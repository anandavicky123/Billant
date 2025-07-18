import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const About = () => (
  <View style={styles.container}>
    <Text style={styles.header}>ℹ️ About</Text>
    <Text style={styles.text}>
      Billant is a personal finance app made by Syncertica in 2023.
    </Text>
    <Text style={styles.text}>© 2023 Syncertica</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  text: { fontSize: 16, textAlign: 'center', marginBottom: 8 },
});

export default About;
