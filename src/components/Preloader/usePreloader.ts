import { useState, useCallback } from 'react';

interface UsePreloaderOptions {
  forceShow?: boolean;
}

export function usePreloader(options: UsePreloaderOptions = {}) {
  const { forceShow = true } = options;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const handlePreloaderExitComplete = useCallback(() => {
    setIsLoading(false);
    setIsComplete(true);
  }, []);

  return {
    isLoading,
    isReady: true,
    isComplete,
    shouldShow: forceShow,
    onExitComplete: handlePreloaderExitComplete,
  };
}

export default usePreloader;

