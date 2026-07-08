import { useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';

export function useDailyReset() {
  const user = useAuthStore((s) => s.user);
  const reset = useAuthStore((s) => s.resetDailyReadings);

  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    if (user.lastReadingResetDate !== today) {
      reset();
    }
  }, [user?.lastReadingResetDate]);
}
