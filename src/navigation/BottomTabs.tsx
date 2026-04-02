import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { BottomTabParamList } from './types';
import { useTheme } from '../store/ThemeContext';

import DashboardScreen     from '../screens/Dashboard';
import TransactionsScreen  from '../screens/Transactions';
import ReconciliationScreen from '../screens/Reconciliation';
import AlertsScreen        from '../screens/Alerts';
import ProfileScreen       from '../screens/Profile';

const Tab = createBottomTabNavigator<BottomTabParamList>();

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const TAB_ICONS: Record<keyof BottomTabParamList, { active: IconName; inactive: IconName }> = {
  Dashboard:      { active: 'view-dashboard',       inactive: 'view-dashboard-outline' },
  Transactions:   { active: 'swap-horizontal-bold', inactive: 'swap-horizontal' },
  Reconciliation: { active: 'scale-balance',        inactive: 'scale-balance' },
  Alerts:         { active: 'bell',                 inactive: 'bell-outline' },
  Profile:        { active: 'account-circle',       inactive: 'account-circle-outline' },
};

const TAB_BAR_HEIGHT = 56;

export default function BottomTabs() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => {
        const icons = TAB_ICONS[route.name as keyof BottomTabParamList];
        return {
          headerShown: false,
          tabBarStyle: [
            styles.tabBar,
            {
              backgroundColor: colors.bgCard,
              height: TAB_BAR_HEIGHT + insets.bottom,
              paddingBottom: insets.bottom + 4,
              borderTopColor: colors.borderCard,
            },
          ],
          tabBarActiveTintColor:   colors.accent,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name={focused ? icons.active : icons.inactive}
              size={size ?? 24}
              color={color}
            />
          ),
        };
      }}
    >
      <Tab.Screen name="Dashboard"      component={DashboardScreen} />
      <Tab.Screen name="Transactions"   component={TransactionsScreen} />
      <Tab.Screen name="Reconciliation" component={ReconciliationScreen} />
      <Tab.Screen name="Alerts"         component={AlertsScreen} />
      <Tab.Screen name="Profile"        component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    paddingTop: 6,
    elevation: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
