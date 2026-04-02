import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../store/AuthContext';
import AuthStack   from './AuthStack';
import BottomTabs  from './BottomTabs';

/**
 * Switches between auth flow and main app based on token presence.
 * Shows a full-screen spinner while AsyncStorage is being read on boot.
 */
export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0B1120', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#4F8EF7" />
      </View>
    );
  }

  return isAuthenticated ? <BottomTabs /> : <AuthStack />;
}
