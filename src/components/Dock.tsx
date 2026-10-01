import { AnimatePresence, motion } from 'framer-motion';
import { Grid2X2, Speaker, VolumeX } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { APP_BY_ID, QUICK_LAUNCH } from '../data/apps';
import type { AppId, ManagedWindow } from '../types/apps';

interface DockProps {
  windows: ManagedWindow[];
  activeId: AppId | null;
  walletConnected: boolean;
  launcherOpen: boolean;
  soundEnabled: boolean;
  onToggleLauncher: () => void;
  onLaunch: (id: AppId) => void;
  onToggleSound: () => void;
}

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  return now;
}

export default function Dock({ windows, activeId, walletConnected, launcherOpen, soundEnabled, onToggleLauncher, onLaunch, onToggleSound }: DockProps) {
  const now = useClock();
  const visibleApps = useMemo(() => {
    const visible = [...QUICK_LAUNCH];
    windows.forEach((item) => { if (!visible.includes(item.id)) visible.push(item.id); });
    return visible;
  }, [windows]);

  return (
    <div className="dock-wrap">
      <div className="dock" role="toolbar" aria-label="SUGRA OS taskbar">
        <button type="button" className={`dock-start${launcherOpen ? ' is-open' : ''}`} onClick={onToggleLauncher} aria-expanded={launcherOpen} aria-label="Open SUGRA launcher" title="Start / Applications"><Grid2X2 size={17} /><span>START</span></button>
        <span className="dock-separator" />
        <div className="dock-apps">
          <AnimatePresence initial={false}>
            {visibleApps.map((id, index) => {
              const app = APP_BY_ID[id];
              const isOpen = windows.some((item) => item.id === id);
              const isMinimized = windows.find((item) => item.id === id)?.isMinimized ?? false;
              return (
                <motion.button
                  layout
                  key={id}
                  type="button"
                  className={`dock-app${activeId === id && !isMinimized ? ' is-active' : ''}${isOpen ? ' is-open' : ''}`}
                  style={{ '--app-accent': app.accent } as CSSProperties}
                  onClick={() => onLaunch(id)}
                  aria-label={`${isOpen ? 'Focus' : 'Open'} ${app.name}`}
                  title={app.name}
                  initial={{ opacity: 0, y: 8, scale: 0.86 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.8 }}
                  transition={{ duration: 0.16, delay: Math.min(index * 0.012, 0.1) }}
                >
                  <app.icon size={17} strokeWidth={1.8} />
                  <span className="dock-app-label">{app.name}</span>
                  {isOpen && <i className="dock-open-indicator" />}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
        <div className="dock-system">
          <button type="button" className="dock-sound" onClick={onToggleSound} aria-label={soundEnabled ? 'Turn sounds off' : 'Turn sounds on'} title={soundEnabled ? 'Sounds on' : 'Sounds off'}>{soundEnabled ? <Speaker size={15} /> : <VolumeX size={15} />}</button>
          <button type="button" className={`dock-wallet${walletConnected ? ' is-connected' : ''}`} onClick={() => onLaunch('wallet')} aria-label={`Wallet ${walletConnected ? 'connected' : 'idle'}`}><i /> <span>{walletConnected ? 'WALLET' : 'WALLET IDLE'}</span></button>
          <span className="dock-network"><i />ARC</span>
          <span className="dock-clock"><strong>{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong><small>{now.toLocaleDateString([], { month: 'short', day: 'numeric' }).toUpperCase()}</small></span>
        </div>
      </div>
    </div>
  );
}
