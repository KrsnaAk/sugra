import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import SuGraMark from './SuGraMark';

export default function BootScreen() {
  return (
    <motion.div className="boot-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="boot-card" initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3 }}>
        <div className="boot-card-top"><span className="boot-mini-mark"><SuGraMark size={30} /></span><span className="micro-label">WORLD SYSTEM / 001</span><span className="boot-pulse" /></div>
        <div className="boot-card-main"><p className="micro-label">LOADING ENVIRONMENT</p><h2>SUGRA<span>OS</span></h2><p>THE WORLD IS COMING ONLINE.</p></div>
        <div className="boot-progress"><span /></div>
        <div className="boot-card-footer"><span><Sparkles size={13} /> SYSTEM READYING</span><span>ARC / READY</span></div>
      </motion.div>
      <div className="boot-scanline" />
    </motion.div>
  );
}
