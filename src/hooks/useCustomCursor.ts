import { useState, useEffect } from 'react';

export interface CursorState {
  x: number;
  y: number;
  isHovered: boolean;
  hoverType: 'default' | 'link' | 'project' | 'view' | 'drag';
  cursorText: string;
}

export function useCustomCursor() {
  const [cursorState, setCursorState] = useState<CursorState>({
    x: -100,
    y: -100,
    isHovered: false,
    hoverType: 'default',
    cursorText: '',
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable custom cursor on non-touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      setCursorState((prev) => ({
        ...prev,
        x: e.clientX,
        y: e.clientY,
      }));
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const setHoverState = (
    isHovered: boolean,
    hoverType: CursorState['hoverType'] = 'default',
    cursorText = ''
  ) => {
    setCursorState((prev) => ({
      ...prev,
      isHovered,
      hoverType,
      cursorText,
    }));
  };

  return { cursorState, isVisible, setHoverState };
}
