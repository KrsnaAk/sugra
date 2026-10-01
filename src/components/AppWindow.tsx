import { AnimatePresence, motion } from 'framer-motion';
import { Maximize2, Minimize2, Minus, X } from 'lucide-react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { APP_BY_ID } from '../data/apps';
import type { AppId, ManagedWindow } from '../types/apps';
import AppContent from '../apps/AppContent';

interface AppWindowProps {
  item: ManagedWindow;
  active: boolean;
  onFocus: (id: AppId) => void;
  onClose: (id: AppId) => void;
  onMinimize: (id: AppId) => void;
  onToggleMaximize: (id: AppId) => void;
  onBeginDrag: (id: AppId, x: number, y: number) => void;
  onLaunch: (id: AppId) => void;
  onNotify: (title: string, message: string) => void;
  onWalletStateChange: (connected: boolean) => void;
}

export function AppWindow({
  item,
  active,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onBeginDrag,
  onLaunch,
  onNotify,
  onWalletStateChange,
}: AppWindowProps) {
  const app = APP_BY_ID[item.id];
  const style: CSSProperties = item.isMaximized
    ? { left: 18, top: 4, right: 18, bottom: 4, zIndex: item.zIndex }
    : { left: item.x, top: item.y, width: item.width, height: item.height, zIndex: item.zIndex };

  const handleHeaderPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest('button')) return;
    event.preventDefault();
    onBeginDrag(item.id, event.clientX, event.clientY);
  };

  return (
    <motion.section
      className={`app-window${active ? ' is-active' : ''}${item.isMaximized ? ' is-maximized' : ''}`}
      style={style}
      role="dialog"
      aria-label={`${app.name} application window`}
      aria-modal="false"
      initial={{ opacity: 0, scale: 0.96, y: 12, filter: 'blur(6px)' }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.97, y: 10, filter: 'blur(4px)' }}
      transition={{ duration: 0.2, ease: [0.2, 0.78, 0.2, 1] }}
      onPointerDown={() => onFocus(item.id)}
      data-app-window={item.id}
      data-active={active ? 'true' : 'false'}
    >
      <header className="window-titlebar" onPointerDown={handleHeaderPointerDown} onDoubleClick={() => onToggleMaximize(item.id)}>
        <div className="window-title-wrap">
          <div className="window-app-icon" style={{ '--app-accent': app.accent } as CSSProperties}>
            <app.icon size={15} strokeWidth={1.9} aria-hidden="true" />
          </div>
          <div className="window-title-copy">
            <span className="window-title">{app.name}</span>
            <span className="window-subtitle">{app.eyebrow}</span>
          </div>
        </div>
        <div className="window-controls" aria-label={`${app.name} window controls`}>
          <button type="button" className="window-control" aria-label={`Minimize ${app.name}`} title="Minimize" onPointerDown={(event) => event.stopPropagation()} onClick={() => onMinimize(item.id)}>
            <Minus size={14} />
          </button>
          <button type="button" className="window-control" aria-label={`${item.isMaximized ? 'Restore' : 'Maximize'} ${app.name}`} title={item.isMaximized ? 'Restore' : 'Maximize'} onPointerDown={(event) => event.stopPropagation()} onClick={() => onToggleMaximize(item.id)}>
            {item.isMaximized ? <Minimize2 size={13} /> : <Maximize2 size={12} />}
          </button>
          <button type="button" className="window-control close-control" aria-label={`Close ${app.name}`} title="Close" onPointerDown={(event) => event.stopPropagation()} onClick={() => onClose(item.id)}>
            <X size={15} />
          </button>
        </div>
      </header>
      <div className="window-content">
        <AppContent appId={item.id} onLaunch={onLaunch} onNotify={onNotify} onWalletStateChange={onWalletStateChange} />
      </div>
      <div className="window-bottom-glow" style={{ '--app-accent': app.accent } as CSSProperties} />
    </motion.section>
  );
}

interface WindowManagerViewProps {
  windows: ManagedWindow[];
  activeId: AppId | null;
  onFocus: (id: AppId) => void;
  onClose: (id: AppId) => void;
  onMinimize: (id: AppId) => void;
  onToggleMaximize: (id: AppId) => void;
  onBeginDrag: (id: AppId, x: number, y: number) => void;
  onLaunch: (id: AppId) => void;
  onNotify: (title: string, message: string) => void;
  onWalletStateChange: (connected: boolean) => void;
}

export function WindowManagerView({ windows, activeId, ...handlers }: WindowManagerViewProps) {
  return (
    <div className="window-layer" aria-label="Open applications">
      <AnimatePresence initial={false} mode="popLayout">
        {windows.filter((item) => !item.isMinimized).map((item) => (
          <AppWindow key={item.id} item={item} active={item.id === activeId} {...handlers} />
        ))}
      </AnimatePresence>
    </div>
  );
}
