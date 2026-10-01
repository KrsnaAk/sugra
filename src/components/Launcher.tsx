import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { APP_LIST } from '../data/apps';
import type { AppId } from '../types/apps';

interface LauncherProps {
  open: boolean;
  openApps: AppId[];
  onLaunch: (id: AppId) => void;
  onClose: () => void;
}

export default function Launcher({ open, openApps, onLaunch, onClose }: LauncherProps) {
  const [query, setQuery] = useState('');
  const filteredApps = useMemo(() => APP_LIST.filter((app) => `${app.name} ${app.eyebrow}`.toLowerCase().includes(query.toLowerCase())), [query]);

  const launch = (id: AppId) => {
    onLaunch(id);
    onClose();
    setQuery('');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button className="launcher-scrim" type="button" aria-label="Close launcher" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.section className="launcher-panel" role="dialog" aria-modal="true" aria-label="SUGRA application launcher" initial={{ opacity: 0, y: 16, scale: 0.97, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, y: 12, scale: 0.98, filter: 'blur(5px)' }} transition={{ duration: 0.2, ease: [0.2, 0.78, 0.2, 1] }}>
            <div className="launcher-heading"><div><span className="micro-label">SUGRA OS / APPLICATIONS</span><h2>CHOOSE A WINDOW.</h2></div><button type="button" className="launcher-close" aria-label="Close launcher" onClick={onClose}><X size={16} /></button></div>
            <label className="launcher-search"><Search size={15} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find an application" aria-label="Search applications" /><span>⌘ K</span></label>
            <div className="launcher-grid">
              {filteredApps.map((app, index) => {
                const Icon = app.icon;
                return <motion.button key={app.id} type="button" className={`launcher-app${openApps.includes(app.id) ? ' is-open' : ''}`} onClick={() => launch(app.id)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.16, delay: Math.min(index * 0.015, 0.12) }}>
                  <span className="launcher-icon" style={{ '--app-accent': app.accent } as CSSProperties}><Icon size={19} strokeWidth={1.7} /></span><span className="launcher-app-copy"><strong>{app.name}</strong><small>{app.eyebrow}</small></span>{openApps.includes(app.id) ? <i className="launcher-open-dot" /> : <ArrowUpRight className="launcher-arrow" size={13} />}
                </motion.button>;
              })}
              {!filteredApps.length && <div className="launcher-no-results">NO MATCHES <span>Try another name.</span></div>}
            </div>
            <div className="launcher-footer"><span><i />12 APPLICATIONS</span><span>BUILT FOR THE SUGAR WORLD</span></div>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
}
