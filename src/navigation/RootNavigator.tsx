import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabNavigator } from './MainTabNavigator';
import { 
  BirthChartScreen, 
  SubscriptionScreen, 
  HistoryScreen,
  CompatibilityScreen,
  DreamScreen,
  NumerologyScreen,
} from '../screens';
import { Colors } from '../constants/colors';

export type RootStackParamList = {
  MainTabs: undefined;
  BirthChart: undefined;
  Subscription: undefined;
  History: undefined;
  Compatibility: undefined;
  Dream: undefined;
  Numerology: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colors.cosmicBlack },
          headerTintColor: Colors.starGold,
          headerTitleStyle: { color: Colors.textPrimary },
          contentStyle: { backgroundColor: Colors.cosmicBlack },
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="BirthChart" component={BirthChartScreen} options={{ title: 'Birth Chart' }} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} options={{ title: 'Premium' }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Reading History' }} />
        <Stack.Screen name="Compatibility" component={CompatibilityScreen} options={{ title: 'Compatibility' }} />
        <Stack.Screen name="Dream" component={DreamScreen} options={{ title: 'Dream Oracle' }} />
        <Stack.Screen name="Numerology" component={NumerologyScreen} options={{ title: 'Numerology' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
