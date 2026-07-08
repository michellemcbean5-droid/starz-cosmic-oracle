import { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';

export function useAuth() {
  const store = useAuthStore();

  useEffect(() => {
    store.loadUser();
  }, []);

  return store;
}
