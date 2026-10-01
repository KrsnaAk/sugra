import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

vi.mock('../components/WorldScene', () => ({
  default: ({ onOpen }: { onOpen: (id: 'sugra') => void }) => (
    <div data-testid="world-scene"><button type="button" onClick={() => onOpen('sugra')}>Open orb</button></div>
  ),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

it('boots the OS and proves the SUGRA window can close and reopen from the dock', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole('button', { name: /boot sugra os/i }));
  await waitFor(() => expect(screen.getByRole('dialog', { name: 'SUGRA application window' })).toBeInTheDocument(), { timeout: 3_500 });

  await user.click(screen.getByRole('button', { name: 'Close SUGRA' }));
  await waitFor(() => expect(screen.queryByRole('dialog', { name: 'SUGRA application window' })).not.toBeInTheDocument());

  await user.click(screen.getByRole('button', { name: 'Open SUGRA' }));
  expect(screen.getByRole('dialog', { name: 'SUGRA application window' })).toBeInTheDocument();
});
