import { useState, useEffect, useCallback } from 'react';

const SESSION_STORAGE_KEY = 'scrillo_preloader_seen';

interface UsePreloaderOptions {
  minDuration?: number; // Minimum display time in ms (default: 1100ms)
  maxTimeout?: number;  // Safety timeout in ms (default: 2400ms)
  heroImageUrl?: string;
  forceShow?: boolean;
}

export function usePreloader(options: UsePreloaderOptions = {}) {
  const {
    minDuration = 1100,
    maxTimeout = 2400,
    heroImageUrl,
    forceShow = false,
  } = options;

  // Check if user has already seen preloader in this browser session
  const [shouldShow, setShouldShow] = useState<boolean>(() => {
    if (forceShow) return true;
    if (typeof window === 'undefined') return true;
    const seen = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return !seen;
  });

  const [isLoading, setIsLoading] = useState<boolean>(shouldShow);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(!shouldShow);

  useEffect(() => {
    if (!shouldShow) {
      setIsLoading(false);
      setIsComplete(true);
      return;
    }

    let isMounted = true;
    const startTime = Date.now();

    // 1. Monitor critical above-the-fold readiness (Window load + Hero image)
    const checkReadiness = () => {
      if (heroImageUrl) {
        const img = new Image();
        img.onload = () => markAssetsReady();
        img.onerror = () => markAssetsReady();
        img.src = heroImageUrl;
      } else {
        markAssetsReady();
      }
    };

    const markAssetsReady = () => {
      const elapsed = Date.now() - startTime;
      const remainingMinTime = Math.max(0, minDuration - elapsed);

      setTimeout(() => {
        if (isMounted) {
          setIsReady(true);
        }
      }, remainingMinTime);
    };

    if (document.readyState === 'complete') {
      checkReadiness();
    } else {
      window.addEventListener('load', checkReadiness, { once: true });
    }

    // 2. Safety maximum timeout to prevent blocking
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setIsReady(true);
      }
    }, maxTimeout);

    return () => {
      isMounted = false;
      window.removeEventListener('load', checkReadiness);
      clearTimeout(safetyTimer);
    };
  }, [shouldShow, minDuration, maxTimeout, heroImageUrl]);

  const handlePreloaderExitComplete = useCallback(() => {
    setIsLoading(false);
    setIsComplete(true);
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
    } catch {
      // Storage unavailable
    }
  }, []);

  return {
    isLoading,
    isReady,
    isComplete,
    shouldShow,
    onExitComplete: handlePreloaderExitComplete,
  };
}

export default usePreloader;
