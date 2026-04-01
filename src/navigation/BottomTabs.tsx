import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { BottomTabParamList } from './types';

import DashboardScreen from '../screens/Dashboard';
import TransactionsScreen from '../screens/Transactions';
import ReconciliationScreen from '../screens/Reconciliation';
import AlertsScreen from '../screens/Alerts';
import SettingsScreen from '../screens/Settings';

const Tab = createBottomTabNavigator<BottomTabParamList>();

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const TAB_ICONS: Record<keyof BottomTabParamList, { active: IconName; inactive: IconName }> = {
  Dashboard:      { active: 'view-dashboard',       inactive: 'view-dashboard-outline' },
  Transactions:   { active: 'swap-horizontal-bold', inactive: 'swap-horizontal' },
  Reconciliation: { active: 'scale-balance',        inactive: 'scale-balance' },
  Alerts:         { active: 'bell',                 inactive: 'bell-outline' },
  Settings:       { active: 'cog',                  inactive: 'cog-outline' },
};

const TAB_BAR_HEIGHT = 56; // visible content height (icon + label)

export default function BottomTabs() {
  const insets = useSafeAreaInsets();

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
              height: TAB_BAR_HEIGHT + insets.bottom,
              paddingBottom: insets.bottom + 4,
            },
          ],
          tabBarActiveTintColor: '#4F8EF7',
          tabBarInactiveTintColor: '#7A8499',
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
      <Tab.Screen name="Settings"       component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0F1724',
    borderTopWidth: 0,
    paddingTop: 6,
    elevation: 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});


