import {
  Activity,
  BarChart3,
  BookOpen,
  CircleHelp,
  FileBadge,
  Globe2,
  Images,
  ShoppingBag,
  Sparkles,
  Terminal,
  Users,
  Wallet,
} from 'lucide-react';
import type { AppDefinition, AppId } from '../types/apps';

export const APP_LIST: AppDefinition[] = [
  { id: 'sugra', name: 'SUGRA', eyebrow: 'THE ORB', icon: Sparkles, accent: '#f06de0', width: 570, height: 500, description: 'A small introduction to the world of sugars.' },
  { id: 'lore', name: 'LORE', eyebrow: 'ARGUS → SUGRA', icon: BookOpen, accent: '#a980ff', width: 560, height: 460, description: 'The world of eyes becomes the world of sugars.' },
  { id: 'tokenomics', name: 'TOKENOMICS', eyebrow: '$SUGRA / ARC', icon: BarChart3, accent: '#ff7bd5', width: 590, height: 530, description: 'Verified token details, when available.' },
  { id: 'buy', name: 'BUY', eyebrow: 'COMING TO ARC', icon: ShoppingBag, accent: '#ff66b7', width: 560, height: 460, description: 'A safe purchase path after deployment.' },
  { id: 'gallery', name: 'GALLERY', eyebrow: 'DIGITAL ARCHIVE', icon: Images, accent: '#c07bff', width: 760, height: 590, description: 'A living archive of SUGRA imagery.' },
  { id: 'community', name: 'COMMUNITY', eyebrow: 'SIGNAL ROOM', icon: Users, accent: '#f180c7', width: 590, height: 460, description: 'Official community links, when configured.' },
  { id: 'faq', name: 'FAQ', eyebrow: 'QUICK ANSWERS', icon: CircleHelp, accent: '#ff93d9', width: 570, height: 520, description: 'Short answers about SUGRA and its status.' },
  { id: 'contract', name: 'CONTRACT', eyebrow: 'ARC / ADDRESS', icon: FileBadge, accent: '#e397ff', width: 570, height: 455, description: 'The verified contract address and explorer.' },
  { id: 'wallet', name: 'WALLET', eyebrow: 'ARC CONNECTION', icon: Wallet, accent: '#bd8bff', width: 560, height: 480, description: 'Connect an injected wallet without fabricating balances.' },
  { id: 'activity', name: 'ACTIVITY', eyebrow: 'ONCHAIN SIGNAL', icon: Activity, accent: '#ff79d0', width: 580, height: 450, description: 'SUGRA activity will appear after deployment.' },
  { id: 'terminal', name: 'TERMINAL', eyebrow: 'COMMAND LINE', icon: Terminal, accent: '#f065db', width: 630, height: 480, description: 'Explore SUGRA.WORLD with working commands.' },
  { id: 'world', name: 'WORLD', eyebrow: 'NAVIGATION', icon: Globe2, accent: '#a688ff', width: 700, height: 540, description: 'A navigable map of the SUGRA environment.' },
];

export const APP_BY_ID = Object.fromEntries(APP_LIST.map((app) => [app.id, app])) as Record<AppId, AppDefinition>;

export const QUICK_LAUNCH: AppId[] = ['sugra', 'gallery', 'terminal', 'world'];
