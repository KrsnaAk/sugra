import { ArrowUp, CornerDownLeft, Sparkles, TerminalSquare } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { SUGRA_CONFIG, deploymentStatus } from '../config/sugra';
import type { AppId } from '../types/apps';

interface TerminalAppProps {
  onLaunch: (id: AppId) => void;
}
interface TranscriptLine {
  command?: string;
  output: string[];
  kind?: 'system' | 'secret';
}

const START_LINES: TranscriptLine[] = [
  { output: ['SUGRA TERMINAL / REV 01', 'A small window into the world. Type `help` for commands.'], kind: 'system' },
];
const COMMANDS = ['help', 'world', 'lore', 'gallery', 'wallet', 'activity', 'network', 'contract', 'clear'];

export default function TerminalApp({ onLaunch }: TerminalAppProps) {
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<TranscriptLine[]>(START_LINES);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyCursor, setHistoryCursor] = useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' });
  }, [history]);

  const runCommand = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const raw = value.trim();
    if (!raw) return;
    const [firstWord] = raw.toLowerCase().split(/\s+/);
    const command = firstWord ?? '';
    setCommandHistory((items) => [raw, ...items].slice(0, 30));
    setHistoryCursor(-1);
    setValue('');

    if (command === 'clear') {
      setHistory([]);
      return;
    }

    const result = resolveCommand(command, onLaunch);
    setHistory((items) => [...items, { command: raw, output: result.output, kind: result.kind }]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const next = Math.min(historyCursor + 1, commandHistory.length - 1);
      setHistoryCursor(next);
      setValue(commandHistory[next] ?? '');
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = Math.max(historyCursor - 1, -1);
      setHistoryCursor(next);
      setValue(next < 0 ? '' : commandHistory[next] ?? '');
    }
  };

  return (
    <div className="terminal-app" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-topline"><span><TerminalSquare size={14} /> WORLD TERMINAL</span><span className="terminal-state"><i /> ONLINE / LOCAL</span></div>
      <div className="terminal-output" ref={outputRef} role="log" aria-live="polite" aria-label="Terminal output">
        {history.map((line, index) => (
          <div className={`terminal-entry${line.kind === 'system' ? ' is-system' : ''}${line.kind === 'secret' ? ' is-secret' : ''}`} key={`${index}-${line.command ?? 'boot'}`}>
            {line.command && <div className="terminal-command"><span>&gt;</span> {line.command}</div>}
            {line.output.map((text, outputIndex) => <p key={outputIndex}>{text}</p>)}
          </div>
        ))}
        <form className="terminal-prompt" onSubmit={runCommand}>
          <span className="prompt-mark">&gt;</span>
          <input ref={inputRef} aria-label="Enter a terminal command" autoComplete="off" spellCheck={false} value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={handleKeyDown} placeholder="type a command…" />
          <button type="submit" aria-label="Run command"><CornerDownLeft size={14} /></button>
        </form>
      </div>
      <div className="terminal-commandbar"><span>TRY</span>{COMMANDS.slice(0, 5).map((command) => <button type="button" key={command} onClick={() => { setValue(command); inputRef.current?.focus(); }}>{command}</button>)}<span className="terminal-return"><ArrowUp size={11} /> HISTORY</span></div>
      <div className="terminal-footer"><span><Sparkles size={13} /> {SUGRA_CONFIG.website}</span><span>STATUS / {deploymentStatus()}</span></div>
    </div>
  );
}

function resolveCommand(command: string, onLaunch: (id: AppId) => void): { output: string[]; kind?: 'secret' } {
  switch (command) {
    case 'help':
      return { output: ['AVAILABLE COMMANDS', 'help · world · lore · gallery · wallet · activity · network · contract · clear', 'Use ↑ and ↓ to revisit recent commands.'] };
    case 'world':
      onLaunch('world');
      return { output: ['SUGRA.WORLD', 'THE WORLD OF SUGARS', 'Opening the world map…'] };
    case 'lore':
      onLaunch('lore');
      return { output: ['ARGUS.WORLD / THE WORLD OF EYES', 'SUGRA.WORLD / THE WORLD OF SUGARS', 'ARGUS → SUGRA', 'Opening Lore…'] };
    case 'gallery':
      onLaunch('gallery');
      return { output: ['ARCHIVE READY', 'Opening Gallery…'] };
    case 'wallet':
      onLaunch('wallet');
      return { output: ['WALLET CONNECTION IS USER-INITIATED.', 'Opening Wallet…'] };
    case 'activity':
      onLaunch('activity');
      return { output: [SUGRA_CONFIG.tokenDeployed ? 'SUGRA ACTIVITY SOURCE NOT CONFIGURED.' : 'NO SUGRA ONCHAIN ACTIVITY YET.', 'Opening Activity…'] };
    case 'network':
      return { output: ['NETWORK / ARC', `CHAIN ID / ${SUGRA_CONFIG.chain.chainId ?? 'TBD'}`, 'No RPC or explorer has been configured.'] };
    case 'contract':
      return { output: ['CONTRACT / ' + (SUGRA_CONFIG.contractAddress ?? 'TBD'), 'TOKEN STATUS / ' + (SUGRA_CONFIG.tokenDeployed ? 'DEPLOYED' : 'NOT YET DEPLOYED')] };
    case 'sugar':
    case 'sugars':
    case 'sugra!':
      return { output: ['EYE CONTACT.', 'SUGAR DETECTED.', 'SUGRA IS STILL RUNNING.'], kind: 'secret' };
    default:
      return { output: [`UNKNOWN COMMAND: ${command}`, 'Type `help` to see what works.'] };
  }
}
