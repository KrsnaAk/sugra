import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useWindowManager } from '../hooks/useWindowManager';
import { WindowManagerView } from '../components/AppWindow';
import type { AppId } from '../types/apps';

function WindowHarness() {
  const manager = useWindowManager();
  const launch = (id: AppId) => manager.openApp(id);
  return (
    <>
      <button type="button" onClick={() => launch('sugra')}>Launch SUGRA</button>
      <button type="button" onClick={() => launch('lore')}>Launch LORE</button>
      <WindowManagerView
        windows={manager.windows}
        activeId={manager.activeId}
        onFocus={manager.focusApp}
        onClose={manager.closeApp}
        onMinimize={manager.minimizeApp}
        onToggleMaximize={manager.toggleMaximize}
        onBeginDrag={manager.beginDrag}
        onLaunch={launch}
        onNotify={() => undefined}
        onWalletStateChange={() => undefined}
      />
    </>
  );
}

afterEach(() => cleanup());

describe('SUGRA OS window manager', () => {
  it('opens SUGRA, closes it, then opens a fresh SUGRA window again', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    render(<WindowHarness />);
    await user.click(screen.getByRole('button', { name: 'Launch SUGRA' }));
    expect(screen.getByRole('dialog', { name: 'SUGRA application window' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close SUGRA' }));
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'SUGRA application window' })).not.toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: 'Launch SUGRA' }));
    expect(screen.getByRole('dialog', { name: 'SUGRA application window' })).toBeInTheDocument();
  });

  it('keeps multiple apps open and brings the clicked window to the front', async () => {
    const user = (await import('@testing-library/user-event')).default.setup();
    render(<WindowHarness />);
    await user.click(screen.getByRole('button', { name: 'Launch SUGRA' }));
    await user.click(screen.getByRole('button', { name: 'Launch LORE' }));
    const sugra = screen.getByRole('dialog', { name: 'SUGRA application window' });
    const lore = screen.getByRole('dialog', { name: 'LORE application window' });
    expect(sugra).toBeInTheDocument();
    expect(lore).toBeInTheDocument();
    expect(lore).toHaveAttribute('data-active', 'true');
    fireEvent.pointerDown(sugra);
    expect(sugra).toHaveAttribute('data-active', 'true');
  });
});
