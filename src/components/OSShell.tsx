import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Bell, ChevronDown, Power } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { AppId } from '../types/apps';
import type { WindowManager } from '../hooks/useWindowManager';
import { playUiTone } from '../services/sound';
import Dock from './Dock';
import Launcher from './Launcher';
import SuGraMark from './SuGraMark';
import { WindowManagerView } from './AppWindow';

export interface OsNotification {
  id: number;
  title: string;
  message: string;
}

interface OSShellProps {
  manager: WindowManager;
  notifications: OsNotification[];
  toasts: OsNotification[];
  walletConnected: boolean;
  onWalletStateChange: (connected: boolean) => void;
  onLaunch: (id: AppId) => void;
  onNotify: (title: string, message: string) => void;
  onDismissNotice: (id: number) => void;
  onClearNotices: () => void;
  onReturnToWorld: () => void;
}

export default function OSShell({ manager, notifications, toasts, walletConnected, onWalletStateChange, onLaunch, onNotify, onDismissNotice, onClearNotices, onReturnToWorld }: OSShellProps) {
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const lastNotice = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setLauncherOpen((open) => !open);
      }
      if (event.key === 'Escape' && launcherOpen) setLauncherOpen(false);
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [launcherOpen]);

  useEffect(() => {
    const currentId = notifications.at(-1)?.id ?? null;
    if (currentId !== null && currentId !== lastNotice.current) {
      lastNotice.current = currentId;
      playUiTone('notify', soundEnabled);
    }
  }, [notifications, soundEnabled]);

  const launch = (id: AppId) => {
    const wasOpen = manager.windows.some((item) => item.id === id && !item.isMinimized);
    onLaunch(id);
    if (!wasOpen) playUiTone('open', soundEnabled);
    setLauncherOpen(false);
  };

  const close = (id: AppId) => {
    manager.closeApp(id);
    playUiTone('close', soundEnabled);
  };

  const toggleSound = () => {
    setSoundEnabled((enabled) => {
      const next = !enabled;
      if (next) playUiTone('click', true);
      return next;
    });
  };

  const openNames = manager.windows.map((item) => item.id);
  const visibleCount = manager.windows.filter((item) => !item.isMinimized).length;
  const returnToWorld = () => {
    setLauncherOpen(false);
    setNotificationsOpen(false);
    onReturnToWorld();
  };

  return (
    <motion.div className="os-shell" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
      <header className="os-topbar">
        <button type="button" className="os-back-to-world" onClick={returnToWorld} aria-label="Return to 3D world" title="Return to the world"><span className="topbar-back"><ArrowLeft size={13} /></span><SuGraMark size={24} /><span className="os-topbar-brand">SUGRA<span>OS</span></span></button>
        <div className="topbar-center"><span>PERSONAL ENVIRONMENT</span><i />REV 01</div>
        <div className="topbar-right">
          <button type="button" className={`topbar-notices${notificationsOpen ? ' is-open' : ''}`} onClick={() => setNotificationsOpen((open) => !open)} aria-expanded={notificationsOpen} aria-label="Open notifications"><Bell size={14} /><span>{notifications.length}</span><ChevronDown size={11} /></button>
          <span className="topbar-network"><i />ARC</span>
          <span className="topbar-time">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <button type="button" className="power-down" onClick={returnToWorld} aria-label="Power down SUGRA OS" title="Return to world"><Power size={14} /></button>
        </div>
      </header>

      <div className="os-desktop-label"><span className="micro-label">SUGRA OS / DESKTOP</span><span>{String(visibleCount).padStart(2, '0')} WINDOWS ACTIVE</span></div>
      {visibleCount === 0 && <motion.div className="desktop-empty" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><div className="empty-desktop-orb"><span /><span /></div><span className="micro-label">A WORLD INSIDE A SYSTEM</span><h2>WHERE TO<br /><span>GO NEXT?</span></h2><p>Open the launcher to find your way around.</p><button type="button" className="text-action" onClick={() => setLauncherOpen(true)}>OPEN APPLICATIONS <ChevronDown size={13} /></button></motion.div>}

      <WindowManagerView
        windows={manager.windows}
        activeId={manager.activeId}
        onFocus={manager.focusApp}
        onClose={close}
        onMinimize={manager.minimizeApp}
        onToggleMaximize={manager.toggleMaximize}
        onBeginDrag={manager.beginDrag}
        onLaunch={launch}
        onNotify={onNotify}
        onWalletStateChange={onWalletStateChange}
      />

      <AnimatePresence>
        {notificationsOpen && <motion.aside className="notification-center" role="dialog" aria-label="SUGRA OS notification center" initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98 }}>
          <div className="notification-center-head"><div><span className="micro-label">SUGRA OS / INBOX</span><strong>{notifications.length ? `${notifications.length} NOTICES` : 'ALL QUIET'}</strong></div><button type="button" onClick={onClearNotices} disabled={!notifications.length}>CLEAR</button></div>
          {notifications.length ? [...notifications].reverse().map((notice) => <div className="notification-center-item" key={notice.id}><i /><span><strong>{notice.title}</strong><small>{notice.message}</small></span><button type="button" aria-label={`Dismiss ${notice.title} notification`} onClick={() => onDismissNotice(notice.id)}>×</button></div>) : <div className="notification-quiet">Nothing new. The world is still here.</div>}
          <button type="button" className="notification-done" onClick={() => setNotificationsOpen(false)}>DONE</button>
        </motion.aside>}
      </AnimatePresence>

      <div className="toast-stack" aria-live="polite" aria-label="System notifications">
        <AnimatePresence initial={false}>
          {toasts.map((notice) => (
            <motion.div className="system-toast" key={notice.id} initial={{ opacity: 0, x: 18, filter: 'blur(4px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: 14 }} transition={{ duration: 0.22 }}>
              <div className="toast-mark"><SuGraMark size={29} /></div><div className="toast-copy"><span>{notice.title}</span><p>{notice.message}</p></div><button type="button" className="toast-dismiss" aria-label={`Dismiss ${notice.title} notification`} onClick={() => onDismissNotice(notice.id)}><span /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Launcher open={launcherOpen} openApps={openNames} onLaunch={launch} onClose={() => setLauncherOpen(false)} />
      <Dock
        windows={manager.windows}
        activeId={manager.activeId}
        walletConnected={walletConnected}
        launcherOpen={launcherOpen}
        soundEnabled={soundEnabled}
        onToggleLauncher={() => setLauncherOpen((open) => !open)}
        onLaunch={launch}
        onToggleSound={toggleSound}
      />
    </motion.div>
  );
}
