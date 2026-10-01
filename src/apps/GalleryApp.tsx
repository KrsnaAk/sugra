import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

type GalleryCategory = 'archive' | 'characters' | 'world' | 'art';
type ArtStyle = 'orb' | 'cube' | 'eye' | 'world';
interface GalleryAsset {
  id: string;
  title: string;
  category: GalleryCategory;
  url?: string;
  media: 'image' | 'video';
  style?: ArtStyle;
  supplied: boolean;
}

const importedAssets = import.meta.glob('../assets/sugra/**/*.{png,jpg,jpeg,webp,svg,gif,mp4,webm}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const proceduralStudies: GalleryAsset[] = [
  { id: 'orb-study', title: 'SUGAR SIGNAL 001', category: 'archive', media: 'image', style: 'orb', supplied: false },
  { id: 'cube-study', title: 'CUBE / SOFT FORM', category: 'characters', media: 'image', style: 'cube', supplied: false },
  { id: 'eye-study', title: 'EYE / OPEN CIRCUIT', category: 'art', media: 'image', style: 'eye', supplied: false },
  { id: 'world-study', title: 'WORLD / MAGENTA FIELD', category: 'world', media: 'image', style: 'world', supplied: false },
];

function categoryFor(filename: string): GalleryCategory {
  const name = filename.toLowerCase();
  if (/character|cube|eye|creature/.test(name)) return 'characters';
  if (/world|banner|background|environment|landscape/.test(name)) return 'world';
  if (/archive|collection|sugra|logo|orb/.test(name)) return 'archive';
  return 'art';
}

function titleFor(path: string): string {
  return path.split('/').pop()?.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) ?? 'SUGRA ARTWORK';
}

const suppliedAssets: GalleryAsset[] = Object.entries(importedAssets).map(([path, url]) => {
  const extension = path.split('.').pop()?.toLowerCase() ?? '';
  return {
    id: path,
    title: titleFor(path),
    category: categoryFor(path),
    url,
    media: extension === 'mp4' || extension === 'webm' ? 'video' : 'image',
    supplied: true,
  };
});

const FILTERS: { id: GalleryCategory | 'random'; label: string }[] = [
  { id: 'archive', label: 'ARCHIVE' },
  { id: 'characters', label: 'CHARACTERS' },
  { id: 'world', label: 'WORLD' },
  { id: 'art', label: 'ART' },
  { id: 'random', label: 'RANDOM' },
];

function ArtworkStudy({ style }: { style?: ArtStyle }) {
  return (
    <div className={`artwork-study study-art--${style ?? 'orb'}`} aria-hidden="true">
      <div className="study-grain" />
      {style === 'orb' && <><div className="study-orbit study-orbit-a" /><div className="study-orbit study-orbit-b" /><div className="study-orb-core"><span className="study-eye"><i /></span></div><span className="study-spec" /></>}
      {style === 'cube' && <><div className="study-cube-main"><span className="cube-face cube-front"><i /></span><span className="cube-face cube-side" /><span className="cube-face cube-top" /></div><span className="cube-satellite cube-satellite-one" /><span className="cube-satellite cube-satellite-two" /></>}
      {style === 'eye' && <><div className="study-eye-large"><i /><b /></div><div className="eye-radar eye-radar-one" /><div className="eye-radar eye-radar-two" /><span className="eye-scanline" /></>}
      {style === 'world' && <><div className="study-landscape"><span /><span /><span /></div><div className="world-ring world-ring-one" /><div className="world-ring world-ring-two" /><div className="world-sun" /></>}
      <span className="study-mark">S / W</span>
    </div>
  );
}

function AssetVisual({ asset }: { asset: GalleryAsset }) {
  if (!asset.url) return <ArtworkStudy style={asset.style} />;
  if (asset.media === 'video') return <video src={asset.url} muted autoPlay loop playsInline aria-label={asset.title} />;
  return <img src={asset.url} alt={asset.title} loading="lazy" />;
}

export default function GalleryApp() {
  const [filter, setFilter] = useState<GalleryCategory>('archive');
  const [selected, setSelected] = useState<GalleryAsset | null>(null);
  const assets = useMemo(() => [...suppliedAssets, ...proceduralStudies], []);
  const visibleAssets = assets.filter((asset) => filter === 'archive' || asset.category === filter);
  const selectedIndex = selected ? assets.findIndex((asset) => asset.id === selected.id) : -1;

  const moveSelection = (direction: number) => {
    if (!selected || assets.length === 0) return;
    const nextIndex = (selectedIndex + direction + assets.length) % assets.length;
    setSelected(assets[nextIndex] ?? null);
  };

  useEffect(() => {
    if (!selected) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
      if (event.key === 'ArrowRight') moveSelection(1);
      if (event.key === 'ArrowLeft') moveSelection(-1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selected, selectedIndex]);

  const chooseFilter = (id: GalleryCategory | 'random') => {
    if (id === 'random') {
      const pool = assets.filter((asset) => asset.supplied);
      const candidates = pool.length ? pool : proceduralStudies;
      setSelected(candidates[Math.floor(Math.random() * candidates.length)] ?? null);
      return;
    }
    setFilter(id);
  };

  return (
    <div className="gallery-app">
      <div className="gallery-toolbar">
        <div className="gallery-tabs" role="tablist" aria-label="Gallery categories">
          {FILTERS.map((item) => (
            <button
              type="button"
              key={item.id}
              role="tab"
              aria-selected={item.id === filter}
              className={`gallery-tab${item.id === filter ? ' is-selected' : ''}`}
              onClick={() => chooseFilter(item.id)}
            >{item.label}{item.id === 'random' && <span>↗</span>}</button>
          ))}
        </div>
        <div className="gallery-count"><span>{String(visibleAssets.length).padStart(2, '0')}</span> OBJECTS</div>
      </div>
      {suppliedAssets.length === 0 && <div className="asset-source-note"><span className="asset-signal" />SOURCE ART NOT FOUND IN CHECKOUT <i>·</i> PROCEDURAL STUDIES SHOWN</div>}
      <div className="gallery-grid" role="tabpanel">
        {visibleAssets.map((asset, index) => (
          <motion.button
            layout
            type="button"
            className={`gallery-card${asset.supplied ? '' : ' is-procedural'}`}
            key={asset.id}
            onClick={() => setSelected(asset)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, delay: Math.min(index * 0.035, 0.2) }}
            aria-label={`Open artwork: ${asset.title}`}
          >
            <span className="gallery-visual"><AssetVisual asset={asset} /><i className="gallery-card-index">{String(index + 1).padStart(2, '0')}</i><span className="gallery-card-open"><ArrowRight size={17} /></span></span>
            <span className="gallery-card-meta"><span><strong>{asset.title}</strong><small>{asset.supplied ? asset.category.toUpperCase() : 'PROCEDURAL STUDY'}</small></span><span className="gallery-meta-arrow">↗</span></span>
          </motion.button>
        ))}
      </div>
      <div className="gallery-footnote"><span className="tiny-orbit" />{suppliedAssets.length ? `${suppliedAssets.length} source asset${suppliedAssets.length === 1 ? '' : 's'} discovered` : 'Original scene studies · not supplied source artwork'}<span className="gallery-footnote-right">SELECT AN OBJECT TO EXPAND</span></div>

      {createPortal(
        <AnimatePresence>
        {selected && (
          <motion.div key={selected.id} className="art-viewer" role="dialog" aria-modal="true" aria-label={`${selected.title} viewer`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
            <motion.div className="art-viewer-panel" initial={{ opacity: 0, scale: 0.96, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 10 }} transition={{ duration: 0.24 }}>
              <div className="art-viewer-toolbar"><span className="micro-label">SUGRA ARCHIVE / {selected.supplied ? 'SOURCE ART' : 'SCENE STUDY'}</span><button type="button" className="viewer-close" aria-label="Close artwork viewer" onClick={() => setSelected(null)}><X size={18} /></button></div>
              <div className="art-viewer-image"><AssetVisual asset={selected} /></div>
              <div className="art-viewer-details"><div><span className="micro-label">{selected.category.toUpperCase()}</span><h2>{selected.title}</h2><p>{selected.supplied ? 'Original file from the SUGRA asset archive.' : 'An original procedural study made from the world’s scene geometry. Replaceable by supplied SUGRA artwork.'}</p></div><div className="viewer-controls"><button type="button" aria-label="Previous artwork" onClick={() => moveSelection(-1)}><ChevronLeft size={19} /></button><button type="button" aria-label="Next artwork" onClick={() => moveSelection(1)}><ChevronRight size={19} /></button></div></div>
              <div className="viewer-progress"><span style={{ width: `${selectedIndex >= 0 ? ((selectedIndex + 1) / assets.length) * 100 : 0}%` }} /></div>
            </motion.div>
            <button className="viewer-edge viewer-edge-left" type="button" aria-label="Previous artwork" onClick={() => moveSelection(-1)}><ArrowLeft size={17} /></button>
            <button className="viewer-edge viewer-edge-right" type="button" aria-label="Next artwork" onClick={() => moveSelection(1)}><ArrowRight size={17} /></button>
          </motion.div>
        )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}
