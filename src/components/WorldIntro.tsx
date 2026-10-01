import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Boxes, Eye, Terminal } from 'lucide-react';
import { SUGRA_CONFIG, deploymentStatus } from '../config/sugra';
import type { AppId } from '../types/apps';
import SuGraMark from './SuGraMark';

interface WorldIntroProps {
  onEnter: (id: AppId) => void;
}

export default function WorldIntro({ onEnter }: WorldIntroProps) {
  return (
    <motion.div className="world-intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.015 }} transition={{ duration: 0.42 }}>
      <header className="world-topbar">
        <div className="world-brand"><SuGraMark size={31} /><span>SUGRA<span className="world-brand-dot">.</span>WORLD</span></div>
        <div className="world-top-center"><span className="top-live-dot" />A DIGITAL PLACE / 001</div>
        <div className="world-top-right"><span className="world-chain"><i />ARC</span><span className="world-deploy-status">{deploymentStatus()}</span><button type="button" onClick={() => onEnter('sugra')} className="world-enter-link">ENTER SYSTEM <ArrowUpRight size={13} /></button></div>
      </header>

      <div className="world-intro-copy">
        <motion.div className="world-eyebrow" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}><span className="eyebrow-rule" /> SUGRA / WORLD NO. 01</motion.div>
        <motion.h1 initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.55, delay: 0.08, ease: [0.2, 0.8, 0.2, 1] }}>THE WORLD<br /><span>OF <em>SUGARS</em></span></motion.h1>
        <motion.p className="world-intro-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>A strange place to land.<br />A softer signal in a louder world.</motion.p>
        <motion.div className="world-lore-stamp" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}><span>ARGUS.WORLD <small>THE WORLD OF EYES</small></span><b>→</b><span>SUGRA.WORLD <small>THE WORLD OF SUGARS</small></span></motion.div>
        <motion.div className="world-actions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
          <button type="button" className="boot-button" onClick={() => onEnter('sugra')}><span className="boot-button-icon"><SuGraMark size={24} /></span><span><strong>BOOT SUGRA OS</strong><small>ENTER THE SYSTEM</small></span><ArrowUpRight size={16} className="boot-button-arrow" /></button>
          <span className="world-touch-hint"><ArrowDown size={13} /> OR FOLLOW THE OBJECTS</span>
        </motion.div>
      </div>

      <div className="world-scene-label orb-label"><span className="label-stem" /><span><strong>THE SUGRA ORB</strong><small>CLICK TO OPEN</small></span><i>01</i></div>
      <div className="world-scene-label machine-label"><span className="label-stem" /><span><strong>THE MACHINE</strong><small>BOOT SUGRA OS</small></span><i>02</i></div>

      <div className="world-object-shortcuts" aria-label="Explore world objects">
        <button type="button" onClick={() => onEnter('gallery')}><Boxes size={14} /><span>ARCHIVE</span></button>
        <button type="button" onClick={() => onEnter('lore')}><Eye size={14} /><span>EYES</span></button>
        <button type="button" onClick={() => onEnter('terminal')}><Terminal size={14} /><span>TERMINAL</span></button>
      </div>

      <footer className="world-footer"><div><span className="footer-pip" />{SUGRA_CONFIG.website}<i> / </i>{SUGRA_CONFIG.tagline}</div><div className="world-footer-right"><span>ARC READY</span><i />TOKEN {deploymentStatus()}</div></footer>
      <div className="world-corner-code">S—W<br /><span>0×01</span></div>
    </motion.div>
  );
}
