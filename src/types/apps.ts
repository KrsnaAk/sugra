import type { LucideIcon } from 'lucide-react';

export type AppId =
  | 'sugra'
  | 'lore'
  | 'tokenomics'
  | 'buy'
  | 'gallery'
  | 'community'
  | 'faq'
  | 'contract'
  | 'wallet'
  | 'activity'
  | 'terminal'
  | 'world';

export interface AppDefinition {
  id: AppId;
  name: string;
  eyebrow: string;
  icon: LucideIcon;
  accent: string;
  width: number;
  height: number;
  description: string;
}

export interface ManagedWindow {
  id: AppId;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
}
