import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './navigation';
import { useAuth } from './hooks/useAuth';
import { useDailyReset } from './hooks/useDailyReset';

export default function App() {
  useAuth();
  useDailyReset();

  return (
    <>
      <StatusBar style="light" />
      <RootNavigator />
    </>
  );
}
