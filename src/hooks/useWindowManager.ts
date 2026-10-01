import { useCallback, useEffect, useRef, useState } from 'react';
import { APP_BY_ID } from '../data/apps';
import type { AppId, ManagedWindow } from '../types/apps';

interface DragState {
  id: AppId;
  pointerX: number;
  pointerY: number;
  originX: number;
  originY: number;
}

export interface WindowManager {
  windows: ManagedWindow[];
  activeId: AppId | null;
  openApp: (id: AppId) => void;
  closeApp: (id: AppId) => void;
  focusApp: (id: AppId) => void;
  minimizeApp: (id: AppId) => void;
  toggleMaximize: (id: AppId) => void;
  beginDrag: (id: AppId, pointerX: number, pointerY: number) => void;
}

const TOP_GUTTER = 58;
const BOTTOM_GUTTER = 88;
const SIDE_GUTTER = 12;

export function useWindowManager(): WindowManager {
  const [windows, setWindows] = useState<ManagedWindow[]>([]);
  const zCounter = useRef(10);
  const drag = useRef<DragState | null>(null);

  const focusApp = useCallback((id: AppId) => {
    const zIndex = ++zCounter.current;
    setWindows((current) => current.map((item) => item.id === id
      ? { ...item, isMinimized: false, zIndex }
      : item));
  }, []);

  const openApp = useCallback((id: AppId) => {
    const zIndex = ++zCounter.current;
    setWindows((current) => {
      const existing = current.find((item) => item.id === id);
      if (existing) {
        return current.map((item) => item.id === id
          ? { ...item, isMinimized: false, zIndex }
          : item);
      }

      const definition = APP_BY_ID[id];
      const viewportWidth = typeof window === 'undefined' ? 1440 : window.innerWidth;
      const viewportHeight = typeof window === 'undefined' ? 900 : window.innerHeight;
      const width = Math.min(definition.width, Math.max(320, viewportWidth - SIDE_GUTTER * 2));
      const height = Math.min(definition.height, Math.max(300, viewportHeight - TOP_GUTTER - BOTTOM_GUTTER));
      const offset = current.length % 5;
      const centerX = Math.round((viewportWidth - width) / 2);
      const centerY = Math.round((viewportHeight - height) / 2);
      const x = Math.max(SIDE_GUTTER, Math.min(centerX + offset * 26, viewportWidth - width - SIDE_GUTTER));
      const y = Math.max(TOP_GUTTER + 10, Math.min(centerY + offset * 24, viewportHeight - height - BOTTOM_GUTTER));

      return [...current, {
        id,
        x,
        y,
        width,
        height,
        zIndex,
        isMinimized: false,
        isMaximized: false,
      }];
    });
  }, []);

  const closeApp = useCallback((id: AppId) => {
    setWindows((current) => current.filter((item) => item.id !== id));
  }, []);

  const minimizeApp = useCallback((id: AppId) => {
    setWindows((current) => current.map((item) => item.id === id ? { ...item, isMinimized: true } : item));
  }, []);

  const toggleMaximize = useCallback((id: AppId) => {
    const zIndex = ++zCounter.current;
    setWindows((current) => current.map((item) => item.id === id
      ? { ...item, isMinimized: false, isMaximized: !item.isMaximized, zIndex }
      : item));
  }, []);

  const beginDrag = useCallback((id: AppId, pointerX: number, pointerY: number) => {
    const item = windows.find((candidate) => candidate.id === id);
    if (!item || item.isMaximized || (typeof window !== 'undefined' && window.innerWidth <= 720)) return;
    drag.current = { id, pointerX, pointerY, originX: item.x, originY: item.y };
    focusApp(id);
  }, [focusApp, windows]);

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      const currentDrag = drag.current;
      if (!currentDrag) return;
      setWindows((current) => current.map((item) => {
        if (item.id !== currentDrag.id || item.isMaximized) return item;
        const maxX = Math.max(SIDE_GUTTER, window.innerWidth - item.width - SIDE_GUTTER);
        const maxY = Math.max(TOP_GUTTER, window.innerHeight - BOTTOM_GUTTER - 30);
        return {
          ...item,
          x: Math.max(SIDE_GUTTER, Math.min(maxX, currentDrag.originX + event.clientX - currentDrag.pointerX)),
          y: Math.max(TOP_GUTTER, Math.min(maxY, currentDrag.originY + event.clientY - currentDrag.pointerY)),
        };
      }));
    };
    const endDrag = () => { drag.current = null; };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
    };
  }, []);

  const activeWindow = windows.reduce<ManagedWindow | null>((active, item) => {
    if (item.isMinimized) return active;
    return !active || item.zIndex > active.zIndex ? item : active;
  }, null);

  return {
    windows,
    activeId: activeWindow?.id ?? null,
    openApp,
    closeApp,
    focusApp,
    minimizeApp,
    toggleMaximize,
    beginDrag,
  };
}
