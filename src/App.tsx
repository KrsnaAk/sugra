import { AnimatePresence } from 'framer-motion';
import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import BootScreen from './components/BootScreen';
import CustomCursor from './components/CustomCursor';
import OSShell, { type OsNotification } from './components/OSShell';
import WorldIntro from './components/WorldIntro';
import { useWindowManager } from './hooks/useWindowManager';
import { SUGRA_CONFIG } from './config/sugra';
import type { AppId } from './types/apps';

const WorldScene = lazy(() => import('./components/WorldScene'));
type ViewMode = 'world' | 'booting' | 'os';

interface SceneBoundaryState {
  hasError: boolean;
}

class SceneBoundary extends Component<{ children: ReactNode }, SceneBoundaryState> {
  state: SceneBoundaryState = { hasError: false };

  static getDerivedStateFromError(): SceneBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('SUGRA world scene could not initialize:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <div className="scene-fallback" aria-label="3D scene unavailable"><div className="fallback-orb" /><span>3D WORLD / FALLBACK</span><strong>The system still works without WebGL.</strong></div>;
    }
    return this.props.children;
  }
}

export default function App() {
  const [mode, setMode] = useState<ViewMode>('world');
  const [notifications, setNotifications] = useState<OsNotification[]>([]);
  const [toasts, setToasts] = useState<OsNotification[]>([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const manager = useWindowManager();
  const notificationSequence = useRef(0);
  const bootTimer = useRef<number | null>(null);
  const toastTimers = useRef(new Map<number, number>());
  const queuedApp = useRef<AppId>('sugra');

  const notify = useCallback((title: string, message: string) => {
    const notice = { id: ++notificationSequence.current, title, message };
    setNotifications((current) => [...current, notice].slice(-8));
    setToasts((current) => [...current, notice].slice(-3));
    const timer = window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== notice.id));
      toastTimers.current.delete(notice.id);
    }, 5200);
    toastTimers.current.set(notice.id, timer);
  }, []);

  const dismissNotice = useCallback((id: number) => {
    setNotifications((current) => current.filter((notice) => notice.id !== id));
    setToasts((current) => current.filter((notice) => notice.id !== id));
    const timer = toastTimers.current.get(id);
    if (timer !== undefined) window.clearTimeout(timer);
    toastTimers.current.delete(id);
  }, []);

  const clearNotices = useCallback(() => {
    setNotifications([]);
    setToasts([]);
    toastTimers.current.forEach((timer) => window.clearTimeout(timer));
    toastTimers.current.clear();
  }, []);

  const launchApp = useCallback((id: AppId) => {
    if (mode === 'os') {
      manager.openApp(id);
      return;
    }
    queuedApp.current = id;
    if (mode === 'booting') return;
    setMode('booting');
    bootTimer.current = window.setTimeout(() => {
      const appToOpen = queuedApp.current;
      setMode('os');
      manager.openApp(appToOpen);
      notify('SUGRA OS', 'SYSTEM READY');
      if (!SUGRA_CONFIG.tokenDeployed) notify('SUGRA OS', 'TOKEN NOT DEPLOYED');
    }, 1480);
  }, [manager.openApp, mode, notify]);

  const returnToWorld = useCallback(() => {
    setMode('world');
  }, []);

  useEffect(() => () => {
    if (bootTimer.current !== null) window.clearTimeout(bootTimer.current);
    toastTimers.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  return (
    <main className={`sugra-world-app view-${mode}`}>
      <SceneBoundary>
        <Suspense fallback={<div className="world-scene-loading"><span className="loading-orb" /><span>WORLD INITIALIZING</span></div>}>
          <WorldScene focused={mode !== 'world'} onOpen={launchApp} />
        </Suspense>
      </SceneBoundary>

      <AnimatePresence mode="wait">
        {mode === 'world' && <WorldIntro key="world-intro" onEnter={launchApp} />}
      </AnimatePresence>

      <AnimatePresence>{mode === 'booting' && <BootScreen key="boot-screen" />}</AnimatePresence>

      <AnimatePresence>{mode === 'os' && <OSShell
        key="sugra-os"
        manager={manager}
        notifications={notifications}
        toasts={toasts}
        walletConnected={walletConnected}
        onWalletStateChange={setWalletConnected}
        onLaunch={launchApp}
        onNotify={notify}
        onDismissNotice={dismissNotice}
        onClearNotices={clearNotices}
        onReturnToWorld={returnToWorld}
      />}</AnimatePresence>

      <CustomCursor />
    </main>
  );
}
