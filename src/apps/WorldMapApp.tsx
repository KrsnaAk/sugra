import { ArrowUpRight, Boxes, CircleDot, Eye, Gem, Globe2, Terminal, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AppId } from '../types/apps';

interface WorldMapAppProps {
  onLaunch: (id: AppId) => void;
}

const locations: { id: string; name: string; description: string; icon: LucideIcon; app: AppId; x: string; y: string; number: string }[] = [
  { id: 'sugra', name: 'SUGRA', description: 'THE ORB', icon: CircleDot, app: 'sugra', x: '50%', y: '22%', number: '01' },
  { id: 'gallery', name: 'GALLERY', description: 'THE ARCHIVE', icon: Boxes, app: 'gallery', x: '22%', y: '45%', number: '02' },
  { id: 'lore', name: 'LORE', description: 'EYE CONTACT', icon: Eye, app: 'lore', x: '78%', y: '43%', number: '03' },
  { id: 'archive', name: 'ARCHIVE', description: 'SUGAR FIELD', icon: Gem, app: 'gallery', x: '35%', y: '76%', number: '04' },
  { id: 'community', name: 'COMMUNITY', description: 'SIGNAL ROOM', icon: Users, app: 'community', x: '67%', y: '76%', number: '05' },
  { id: 'terminal', name: 'TERMINAL', description: 'SYSTEM CORE', icon: Terminal, app: 'terminal', x: '50%', y: '51%', number: '06' },
];

export default function WorldMapApp({ onLaunch }: WorldMapAppProps) {
  return (
    <div className="content-page map-page">
      <div className="app-page-heading"><span className="micro-label">A NAVIGABLE REPRESENTATION</span><span className="map-coordinates">SECTOR 00 / 06</span></div>
      <div className="map-title-row"><div><h2>WORLD<br /><span>AT A GLANCE.</span></h2><p>Pick a point to open its place in SUGRA OS.</p></div><div className="map-compass"><Globe2 size={20} /><span>NORTH<br />SUGAR</span></div></div>
      <div className="world-map-canvas">
        <div className="map-rings"><span /><span /><span /><i /></div>
        <svg className="map-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M50 22 22 45 50 51 78 43 67 76 50 51 35 76 22 45" /><path d="M50 22 78 43 50 51 35 76" /></svg>
        {locations.map((location) => {
          const Icon = location.icon;
          return (
            <button key={location.id} type="button" className={`map-node map-node-${location.id}`} style={{ left: location.x, top: location.y }} onClick={() => onLaunch(location.app)} aria-label={`Open ${location.name}: ${location.description}`}>
              <span className="map-node-core"><Icon size={15} strokeWidth={1.8} /></span><span className="map-node-copy"><small>{location.number} / {location.description}</small><strong>{location.name}</strong></span><ArrowUpRight size={12} className="map-node-arrow" />
            </button>
          );
        })}
      </div>
      <div className="map-footer"><span><i /> MAP DATA IS LOCAL TO THIS EXPERIENCE</span><span>CLICK A NODE TO NAVIGATE</span></div>
    </div>
  );
}
