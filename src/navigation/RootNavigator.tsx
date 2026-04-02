import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../store/AuthContext';
import { useTheme } from '../store/ThemeContext';
import AuthStack  from './AuthStack';
import BottomTabs from './BottomTabs';

/**
 * Switches between auth flow and main app based on token presence.
 * Shows a full-screen spinner while AsyncStorage is being read on boot.
 */
export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bgBase, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return isAuthenticated ? <BottomTabs /> : <AuthStack />;
}
