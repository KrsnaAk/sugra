import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -40, y: -40, active: false });
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!query.matches) return;
    document.body.classList.add('has-custom-cursor');
    const move = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const onControl = Boolean(target?.closest('button, a, input, [role="button"]'));
      setPosition({ x: event.clientX, y: event.clientY, active: true });
      setInteractive(onControl || document.body.style.cursor === 'pointer');
    };
    const leave = () => setPosition((previous) => ({ ...previous, active: false }));
    const reset = () => setInteractive(false);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    document.addEventListener('pointerover', move as EventListener, { passive: true });
    document.addEventListener('pointerout', reset);
    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      document.removeEventListener('pointerover', move as EventListener);
      document.removeEventListener('pointerout', reset);
    };
  }, []);

  return <div className={`sugra-cursor${position.active ? ' is-visible' : ''}${interactive ? ' is-interactive' : ''}`} style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }} aria-hidden="true"><span /><i /></div>;
}
