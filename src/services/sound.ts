type UiTone = 'open' | 'close' | 'click' | 'notify';
let audioContext: AudioContext | null = null;

/** Tiny synthesized interface tones. Audio is created only after the user opts in and interacts. */
export function playUiTone(kind: UiTone, enabled: boolean): void {
  if (!enabled || typeof window === 'undefined') return;
  const Context = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Context) return;
  try {
    audioContext ??= new Context();
    if (audioContext.state === 'suspended') void audioContext.resume();
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const tone = kind === 'notify' ? 740 : kind === 'open' ? 520 : kind === 'close' ? 320 : 440;
    oscillator.type = kind === 'notify' ? 'sine' : 'triangle';
    oscillator.frequency.setValueAtTime(tone, now);
    oscillator.frequency.exponentialRampToValueAtTime(tone * (kind === 'close' ? 0.82 : 1.13), now + 0.075);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.025, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.115);
  } catch {
    // Audio is optional; blocked or unsupported contexts never interrupt the interface.
  }
}
