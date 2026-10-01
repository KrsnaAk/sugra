import { Check, Copy, ExternalLink, Shield, WalletCards, Wifi } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { SUGRA_CONFIG, isSugraLive } from '../config/sugra';
import { connectInjectedWallet, injectedProvider, readErc20Balance } from '../services/arc';
import type { WalletSession } from '../services/arc';

interface WalletAppProps {
  onNotify: (title: string, message: string) => void;
  onConnectionChange: (connected: boolean) => void;
}

function shortenAddress(address: string) {
  return `${address.slice(0, 7)}…${address.slice(-5)}`;
}

export default function WalletApp({ onNotify, onConnectionChange }: WalletAppProps) {
  const [session, setSession] = useState<WalletSession | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');
  const [usdcBalance, setUsdcBalance] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const providerAvailable = Boolean(injectedProvider());
  const configuredChainId = SUGRA_CONFIG.chain.chainId;
  const connectedChainId = session ? Number.parseInt(session.chainId, 16) : null;
  const isArcNetwork = configuredChainId === null ? null : connectedChainId === configuredChainId;

  const refreshUsdcBalance = useCallback(async (activeSession: WalletSession) => {
    const tokenAddress = SUGRA_CONFIG.chain.usdcAddress;
    if (!tokenAddress) {
      setUsdcBalance(null);
      return;
    }
    if (configuredChainId !== null && Number.parseInt(activeSession.chainId, 16) !== configuredChainId) {
      setUsdcBalance(null);
      return;
    }
    const provider = injectedProvider();
    if (!provider) return;
    setBalanceLoading(true);
    try {
      setUsdcBalance(await readErc20Balance(provider, tokenAddress, activeSession.account));
    } catch {
      setUsdcBalance(null);
      setError('USDC balance could not be read from this network.');
    } finally {
      setBalanceLoading(false);
    }
  }, [configuredChainId]);

  useEffect(() => {
    let current = true;
    const provider = injectedProvider();
    if (!provider) {
      onConnectionChange(false);
      return;
    }
    void provider.request({ method: 'eth_accounts' }).then(async (accounts) => {
      const account = Array.isArray(accounts) ? accounts[0] : undefined;
      if (typeof account !== 'string') {
        if (current) onConnectionChange(false);
        return;
      }
      const chainId = await provider.request({ method: 'eth_chainId' });
      if (!current || typeof chainId !== 'string') return;
      const restored = { account: account as `0x${string}`, chainId };
      setSession(restored);
      onConnectionChange(true);
      await refreshUsdcBalance(restored);
    }).catch(() => { if (current) onConnectionChange(false); });
    return () => { current = false; };
  }, [onConnectionChange, refreshUsdcBalance]);

  useEffect(() => {
    onConnectionChange(Boolean(session));
  }, [onConnectionChange, session]);

  const handleConnect = async () => {
    setError('');
    setConnecting(true);
    try {
      const nextSession = await connectInjectedWallet();
      setSession(nextSession);
      await refreshUsdcBalance(nextSession);
      onNotify('WALLET CONNECTED', 'A real wallet account is connected to this view.');
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Wallet connection was not available.';
      setError(message);
    } finally {
      setConnecting(false);
    }
  };

  useEffect(() => {
    const provider = injectedProvider();
    if (!provider || !session) return;
    const handleAccounts = (...args: unknown[]) => {
      const accounts = args[0];
      if (!Array.isArray(accounts) || typeof accounts[0] !== 'string') {
        setSession(null);
        setUsdcBalance(null);
        return;
      }
      const next = { ...session, account: accounts[0] as `0x${string}` };
      setSession(next);
      void refreshUsdcBalance(next);
    };
    const handleChain = (...args: unknown[]) => {
      const chainId = args[0];
      if (typeof chainId !== 'string') return;
      const next = { ...session, chainId };
      setSession(next);
      setUsdcBalance(null);
      void refreshUsdcBalance(next);
    };
    provider.on?.('accountsChanged', handleAccounts);
    provider.on?.('chainChanged', handleChain);
    return () => {
      provider.removeListener?.('accountsChanged', handleAccounts);
      provider.removeListener?.('chainChanged', handleChain);
    };
  }, [refreshUsdcBalance, session]);

  const copyAddress = async () => {
    if (!session) return;
    try {
      await navigator.clipboard.writeText(session.account);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError('Clipboard access is unavailable in this browser.');
    }
  };

  const resetView = () => {
    setSession(null);
    setUsdcBalance(null);
    setError('');
  };

  return (
    <div className="content-page wallet-page">
      <div className="app-page-heading"><span className="micro-label">ARC CONNECTION</span><span className={`wallet-state${session ? ' is-connected' : ''}`}><i />{session ? 'CONNECTED' : 'NOT CONNECTED'}</span></div>
      <div className="wallet-heading"><div className="wallet-graphic"><span className="wallet-ring wallet-ring-a" /><span className="wallet-ring wallet-ring-b" /><WalletCards size={29} /></div><div><h2>{session ? 'YOUR WALLET.' : 'YOUR KEY.'}</h2><p>{session ? 'Connected to this SUGRA OS view.' : 'A real account connection, never a demo balance.'}</p></div></div>
      <div className="wallet-network-card"><span className="network-glyph"><Wifi size={15} /></span><div><span>NETWORK</span><strong>ARC</strong></div><div className="network-readiness"><i />{configuredChainId === null ? 'NETWORK ID TBD' : isArcNetwork ? 'ARC NETWORK' : 'CHECK NETWORK'}</div></div>
      {session ? (
        <div className="connected-account">
          <div className="connected-account-top"><span className="account-label">CONNECTED ACCOUNT</span><span className="connection-live"><i /> LIVE SESSION</span></div>
          <div className="account-address"><code>{shortenAddress(session.account)}</code><button type="button" aria-label="Copy wallet address" onClick={copyAddress}>{copied ? <Check size={15} /> : <Copy size={15} />}</button></div>
          <div className="account-chain"><span>CONNECTED CHAIN ID</span><code>{session.chainId}</code></div>
        </div>
      ) : (
        <div className="wallet-connect-panel"><div className="connect-orbit"><span /><span /><i /></div><div><strong>CONNECT WALLET</strong><p>{providerAvailable ? 'Request account access from your browser wallet.' : 'No injected wallet detected in this browser.'}</p></div></div>
      )}
      <div className="wallet-balance-row"><div><span className="balance-symbol">$</span><span><strong>USDC</strong><small>REAL BALANCE ONLY</small></span></div><strong className="balance-value">{!session ? '—' : balanceLoading ? 'READING…' : usdcBalance !== null ? usdcBalance : 'NOT AVAILABLE'}</strong></div>
      {session && !SUGRA_CONFIG.chain.usdcAddress && <p className="wallet-data-note">A verified Arc USDC contract address is not configured, so no USDC balance is queried or displayed.</p>}
      {session && isArcNetwork === false && <p className="wallet-warning">This account is on a different network than the configured Arc chain.</p>}
      {error && <p className="wallet-error" role="alert">{error}</p>}
      <div className="wallet-actions">
        {!session ? <button type="button" className="primary-action wallet-connect-button" onClick={handleConnect} disabled={connecting}>{connecting ? 'CONNECTING…' : 'CONNECT WALLET'}<span><ExternalLink size={15} /></span></button> : <button type="button" className="secondary-action wallet-reset" onClick={resetView}>DISCONNECT THIS VIEW</button>}
        <span className="wallet-safety"><Shield size={13} /> No approvals or transactions are requested.</span>
      </div>
      <div className="wallet-token-foot"><span>{SUGRA_CONFIG.tokenSymbol}</span><strong>{isSugraLive() ? 'DEPLOYED' : 'NOT DEPLOYED'}</strong><span>CONTRACT</span><strong>{SUGRA_CONFIG.contractAddress ?? 'TBD'}</strong></div>
    </div>
  );
}
