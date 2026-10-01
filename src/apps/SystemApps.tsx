import { ArrowDownRight, ArrowUpRight, Check, Copy, ExternalLink, MoveUpRight, Sparkles, Waves } from 'lucide-react';
import { useState } from 'react';
import { SUGRA_CONFIG, configuredValue, contractExplorerUrl, deploymentStatus, isSugraLive } from '../config/sugra';
import { APP_BY_ID } from '../data/apps';
import type { AppId } from '../types/apps';
import SuGraMark from '../components/SuGraMark';

interface AppActionProps {
  onLaunch: (id: AppId) => void;
  onNotify: (title: string, message: string) => void;
}

function StatusChip({ children, live = false }: { children: string; live?: boolean }) {
  return <span className={`status-chip${live ? ' is-live' : ''}`}><i />{children}</span>;
}

export function SugraApp({ onLaunch }: AppActionProps) {
  return (
    <div className="content-page sugra-home">
      <div className="sugra-home-orb"><span className="orb-halo" /><SuGraMark size={78} /></div>
      <p className="micro-label">A SMALL INTRODUCTION / 001</p>
      <h1 className="display-title">THE WORLD<br /><span>OF SUGARS</span></h1>
      <p className="lead-copy">A strange place to land. A softer signal in a louder world.</p>
      <div className="lore-route compact-route">
        <div className="route-stop"><span>ARGUS.WORLD</span><small>THE WORLD OF EYES</small></div>
        <span className="route-arrow"><MoveUpRight size={15} /></span>
        <div className="route-stop route-stop-current"><span>SUGRA.WORLD</span><small>THE WORLD OF SUGARS</small></div>
      </div>
      <div className="sugra-home-footer">
        <StatusChip>{deploymentStatus()}</StatusChip>
        <button className="text-action" type="button" onClick={() => onLaunch('world')}>EXPLORE THE WORLD <ArrowUpRight size={14} /></button>
      </div>
      <span className="ghost-index">SU—001</span>
    </div>
  );
}

export function LoreApp() {
  return (
    <div className="content-page lore-page">
      <div className="app-page-heading"><span className="micro-label">THE ONLY LORE</span><span className="page-index">01 / 02</span></div>
      <div className="lore-word lore-argus"><span className="lore-eye" aria-hidden="true"><i /></span><div><h2>ARGUS.WORLD</h2><p>THE WORLD OF EYES</p></div></div>
      <div className="lore-transition"><span /><div className="transition-mark"><ArrowDownRight size={19} /></div><span /></div>
      <div className="lore-word lore-sugra"><SuGraMark size={60} /><div><h2>SUGRA.WORLD</h2><p>THE WORLD OF SUGARS</p></div></div>
      <p className="lore-note">ARGUS <span>→</span> SUGRA</p>
      <p className="fine-print">One simple connection. No bigger mythology needed.</p>
    </div>
  );
}

export function TokenomicsApp() {
  const entries = [
    ['TOTAL SUPPLY', configuredValue(SUGRA_CONFIG.tokenomics.totalSupply)],
    ['LIQUIDITY', configuredValue(SUGRA_CONFIG.tokenomics.liquidity)],
    ['TAX', configuredValue(SUGRA_CONFIG.tokenomics.tax)],
    ['TEAM ALLOCATION', configuredValue(SUGRA_CONFIG.tokenomics.teamAllocation)],
  ];

  return (
    <div className="content-page token-page">
      <div className="app-page-heading"><span className="micro-label">TOKEN INFORMATION</span><StatusChip live={isSugraLive()}>{deploymentStatus()}</StatusChip></div>
      <div className="token-identity"><div className="token-orb-mini"><SuGraMark size={48} /></div><div><span className="token-symbol">{SUGRA_CONFIG.tokenSymbol}</span><p>Onchain details appear here when verified.</p></div><span className="chain-tag">ARC <i /></span></div>
      <div className="token-grid">
        {entries.map(([label, value], index) => (
          <div className="token-metric" key={label}>
            <span className="metric-index">0{index + 1}</span><span className="metric-label">{label}</span><strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="token-contract-row"><span>CONTRACT</span><strong>{SUGRA_CONFIG.contractAddress ?? 'TBD'}</strong></div>
      <div className="honesty-note"><Waves size={16} /><p>No token data is published yet. Values will be updated from verified deployment details.</p></div>
    </div>
  );
}

export function BuyApp() {
  const live = isSugraLive();
  const buyUrl = live ? SUGRA_CONFIG.links.buy : null;
  const canBuy = Boolean(buyUrl);
  return (
    <div className="content-page buy-page">
      <div className="buy-glow" />
      <div className="buy-symbol-orb"><SuGraMark size={66} /></div>
      <p className="micro-label">A SAFE DOOR, WHEN IT EXISTS</p>
      <h2>{SUGRA_CONFIG.tokenSymbol}<br /><span>{live ? 'OFFICIAL LINKS' : 'COMING TO ARC'}</span></h2>
      <StatusChip live={live}>{deploymentStatus()}</StatusChip>
      <div className="buy-details">
        <div><span>CONTRACT</span><strong>{SUGRA_CONFIG.contractAddress ?? 'TBD'}</strong></div>
        <div><span>BUY</span><strong>{canBuy ? 'OFFICIAL LINK' : live ? 'LINK NOT CONFIGURED' : 'NOT AVAILABLE YET'}</strong></div>
      </div>
      {canBuy && buyUrl
        ? <a className="primary-action buy-link-action" href={buyUrl} target="_blank" rel="noreferrer">OPEN OFFICIAL BUY LINK<span><ArrowUpRight size={15} /></span></a>
        : <button className="primary-action disabled-action" type="button" disabled aria-disabled="true">{live ? 'OFFICIAL LINK NOT CONFIGURED' : 'NOT AVAILABLE YET'}<span><ArrowUpRight size={15} /></span></button>}
      <p className="fine-print">No trading link is active. Check the contract app after a verified launch.</p>
    </div>
  );
}

export function ContractApp({ onNotify }: AppActionProps) {
  const [copied, setCopied] = useState(false);
  const address = SUGRA_CONFIG.contractAddress;
  const explorerUrl = contractExplorerUrl();

  const copyAddress = async () => {
    if (!address || !isSugraLive()) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      onNotify('CONTRACT COPIED', 'The verified address is on your clipboard.');
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      onNotify('COPY UNAVAILABLE', 'Clipboard access is unavailable in this browser.');
    }
  };

  return (
    <div className="content-page contract-page">
      <div className="app-page-heading"><span className="micro-label">NETWORK RECORD</span><span className="chain-tag">ARC <i /></span></div>
      <div className="contract-seal"><SuGraMark size={53} /><div><span>CONTRACT</span><h2>{SUGRA_CONFIG.name}</h2></div></div>
      <div className="address-display"><span className="address-label">{address && isSugraLive() ? 'VERIFIED ADDRESS' : 'CONTRACT ADDRESS'}</span><code>{address && isSugraLive() ? address : 'TBD'}</code><span className="address-status"><i />{deploymentStatus()}</span></div>
      <div className="contract-actions">
        <button className="secondary-action" type="button" onClick={copyAddress} disabled={!address || !isSugraLive()}><span>{copied ? <Check size={15} /> : <Copy size={15} />}</span>{copied ? 'COPIED' : 'COPY'}</button>
        {explorerUrl ? <a className="secondary-action" href={explorerUrl} target="_blank" rel="noreferrer"><span><ExternalLink size={15} /></span>VIEW ON EXPLORER</a> : <button className="secondary-action" type="button" disabled><span><ExternalLink size={15} /></span>VIEW ON EXPLORER</button>}
      </div>
      <div className="verified-empty"><span className="empty-orbit"><i /></span><p>A verified address will appear here after deployment.</p></div>
    </div>
  );
}

export function ActivityApp() {
  return (
    <div className="content-page activity-page">
      <div className="app-page-heading"><span className="micro-label">ONCHAIN SIGNAL</span><span className="live-indicator"><i /> WAITING FOR DEPLOYMENT</span></div>
      <div className="activity-empty-visual"><div className="activity-radar"><span /><span /><span /><i /></div><div className="activity-beam" /></div>
      <div className="activity-copy"><span className="micro-label">{SUGRA_CONFIG.name} ACTIVITY</span><h2>QUIET, FOR NOW.</h2><p>{isSugraLive() ? 'An Arc activity source has not been configured yet.' : 'No SUGRA onchain activity yet.'}</p></div>
      <div className="activity-footnote"><span>NETWORK</span><strong>ARC</strong><span>DATA SOURCE</span><strong>{isSugraLive() ? 'NOT AVAILABLE' : 'NOT DEPLOYED'}</strong></div>
    </div>
  );
}

export function NotFoundApp({ id }: { id: AppId }) {
  const app = APP_BY_ID[id];
  return <div className="content-page"><div className="app-page-heading"><span className="micro-label">{app.eyebrow}</span></div><h2 className="display-title">{app.name}</h2><p className="lead-copy">{app.description}</p><div className="honesty-note"><Sparkles size={16} /><p>This application is ready to receive verified SUGRA data.</p></div></div>;
}
