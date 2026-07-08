import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';
import { HomeScreen, TarotScreen, MoonScreen, PlanetsScreen, ProfileScreen } from '../screens';
import { Colors } from '../constants/colors';

const Tab = createBottomTabNavigator();

const tabBarLabelStyle = { fontSize: 11, marginBottom: 4 };

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(10, 10, 26, 0.95)',
          borderTopWidth: 1,
          borderTopColor: Colors.cardBorder,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.starGold,
        tabBarInactiveTintColor: Colors.textMuted,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={[tabBarLabelStyle, { color }]}>Horoscope</Text>
          ),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>✨</Text>,
        }}
      />
      <Tab.Screen
        name="Tarot"
        component={TarotScreen}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={[tabBarLabelStyle, { color }]}>Tarot</Text>
          ),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🔮</Text>,
        }}
      />
      <Tab.Screen
        name="Moon"
        component={MoonScreen}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={[tabBarLabelStyle, { color }]}>Moon</Text>
          ),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🌙</Text>,
        }}
      />
      <Tab.Screen
        name="Planets"
        component={PlanetsScreen}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={[tabBarLabelStyle, { color }]}>Planets</Text>
          ),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🪐</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={[tabBarLabelStyle, { color }]}>Profile</Text>
          ),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};
