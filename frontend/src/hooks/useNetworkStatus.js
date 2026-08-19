import { useState, useEffect, useCallback } from 'react';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [isSlowNetwork, setIsSlowNetwork] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Connection speed check
  const checkConnectionSpeed = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.connection) {
      const { effectiveType, rtt } = navigator.connection;
      if (effectiveType === '2g' || effectiveType === 'slow-2g' || rtt > 1500) {
        setIsSlowNetwork(true);
      } else {
        setIsSlowNetwork(false);
      }
    }
  }, []);

  const markOffline = useCallback(() => {
    setIsOnline(false);
  }, []);

  const markOnline = useCallback(() => {
    setIsOnline(true);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkConnectionSpeed();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    // Sync with browser events
    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    if (typeof navigator !== 'undefined' && navigator.connection) {
      navigator.connection.addEventListener('change', checkConnectionSpeed);
    }

    checkConnectionSpeed();

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
      if (typeof navigator !== 'undefined' && navigator.connection) {
        navigator.connection.removeEventListener('change', checkConnectionSpeed);
      }
    };
  }, [checkConnectionSpeed]);

  const retryConnection = async () => {
    setIsRetrying(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      
      const res = await fetch('http://localhost:5000/api/analytics/live?section=Boys', { 
        method: 'GET',
        signal: controller.signal 
      }).catch(() => null);

      clearTimeout(timeoutId);

      if (res && (res.ok || res.status < 500)) {
        setIsOnline(true);
      } else if (navigator.onLine) {
        // Fallback check: if browser states online, test image/health
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    } catch {
      if (navigator.onLine) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    } finally {
      setTimeout(() => setIsRetrying(false), 500);
    }
  };

  return {
    isOnline,
    isOffline: !isOnline,
    isSlowNetwork,
    isRetrying,
    retryConnection,
    markOffline,
    markOnline
  };
}
