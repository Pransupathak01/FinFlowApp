import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ReconciliationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reconciliation</Text>
      <Text style={styles.subtitle}>Match & reconcile your records</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1120',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#7A8499',
  },
});
