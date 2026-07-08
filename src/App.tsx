import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './navigation';
import { useAuth } from './hooks/useAuth';
import { useDailyReset } from './hooks/useDailyReset';
import { ErrorBoundary } from './components';

export default function App() {
  useAuth();
  useDailyReset();

  return (
    <ErrorBoundary>
      <StatusBar style="light" />
      <RootNavigator />
    </ErrorBoundary>
  );
}
