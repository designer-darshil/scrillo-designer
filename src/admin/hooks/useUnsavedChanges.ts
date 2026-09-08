import { useEffect } from 'react';

/**
 * Reusable Hook to prevent accidental loss of unsaved changes
 */
export function useUnsavedChanges(
  isDirty: boolean,
  message = 'You have unsaved changes in this editor. Are you sure you want to discard them and leave?'
) {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty, message]);
}

export default useUnsavedChanges;
