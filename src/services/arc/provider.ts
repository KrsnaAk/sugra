export interface Eip1193Provider {
  request(args: { method: string; params?: unknown[] | object }): Promise<unknown>;
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
}

export interface WalletSession {
  account: `0x${string}`;
  chainId: string;
}

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

export function injectedProvider(): Eip1193Provider | null {
  if (typeof window === 'undefined') return null;
  return window.ethereum ?? null;
}

export async function connectInjectedWallet(): Promise<WalletSession> {
  const provider = injectedProvider();
  if (!provider) throw new Error('No injected wallet was found in this browser.');

  const accounts = await provider.request({ method: 'eth_requestAccounts' });
  const chainId = await provider.request({ method: 'eth_chainId' });
  const account = Array.isArray(accounts) ? accounts[0] : undefined;
  if (typeof account !== 'string' || typeof chainId !== 'string') {
    throw new Error('The wallet did not return a valid account and network.');
  }

  return { account: account as `0x${string}`, chainId };
}

/** Reads a real ERC-20 balance only when an explicit verified contract address is configured. */
export async function readErc20Balance(
  provider: Eip1193Provider,
  tokenAddress: `0x${string}`,
  account: `0x${string}`,
): Promise<string> {
  const paddedAccount = account.toLowerCase().replace(/^0x/, '').padStart(64, '0');
  const data = `0x70a08231${paddedAccount}`;
  const raw = await provider.request({
    method: 'eth_call',
    params: [{ to: tokenAddress, data }, 'latest'],
  });
  if (typeof raw !== 'string' || !/^0x[0-9a-f]+$/i.test(raw)) {
    throw new Error('The network did not return an ERC-20 balance.');
  }

  const decimalsRaw = await provider.request({
    method: 'eth_call',
    params: [{ to: tokenAddress, data: '0x313ce567' }, 'latest'],
  });
  const decimals = typeof decimalsRaw === 'string' ? Number.parseInt(decimalsRaw, 16) : Number.NaN;
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 36) {
    throw new Error('The token did not return valid decimals.');
  }

  const units = BigInt(raw);
  const scale = 10n ** BigInt(decimals);
  const whole = units / scale;
  const fraction = (units % scale).toString().padStart(decimals, '0').slice(0, 4).replace(/0+$/, '');
  return fraction ? `${whole}.${fraction}` : whole.toString();
}
