import type { AppId } from '../types/apps';
import GalleryApp from './GalleryApp';
import TerminalApp from './TerminalApp';
import WalletApp from './WalletApp';
import WorldMapApp from './WorldMapApp';
import { ActivityApp, BuyApp, ContractApp, LoreApp, SugraApp, TokenomicsApp } from './SystemApps';
import { CommunityApp, FaqApp } from './CommunityFaqApps';

interface AppContentProps {
  appId: AppId;
  onLaunch: (id: AppId) => void;
  onNotify: (title: string, message: string) => void;
  onWalletStateChange: (connected: boolean) => void;
}

export default function AppContent({ appId, onLaunch, onNotify, onWalletStateChange }: AppContentProps) {
  switch (appId) {
    case 'sugra': return <SugraApp onLaunch={onLaunch} onNotify={onNotify} />;
    case 'lore': return <LoreApp />;
    case 'tokenomics': return <TokenomicsApp />;
    case 'buy': return <BuyApp />;
    case 'gallery': return <GalleryApp />;
    case 'community': return <CommunityApp />;
    case 'faq': return <FaqApp />;
    case 'contract': return <ContractApp onLaunch={onLaunch} onNotify={onNotify} />;
    case 'wallet': return <WalletApp onNotify={onNotify} onConnectionChange={onWalletStateChange} />;
    case 'activity': return <ActivityApp />;
    case 'terminal': return <TerminalApp onLaunch={onLaunch} />;
    case 'world': return <WorldMapApp onLaunch={onLaunch} />;
    default: return null;
  }
}
