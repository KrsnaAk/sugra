export interface ArcConfiguration {
  readonly name: 'Arc';
  /** Add the verified Arc chain id once it is supplied. */
  readonly chainId: number | null;
  /** Add the official explorer origin once one is selected. */
  readonly explorerUrl: string | null;
  /** Optional verified ERC-20 address for displaying a real USDC balance. */
  readonly usdcAddress: `0x${string}` | null;
}

export interface SugraConfiguration {
  readonly name: 'SUGRA';
  readonly website: 'SUGRA.WORLD';
  readonly tagline: 'THE WORLD OF SUGARS';
  readonly tokenSymbol: '$SUGRA';
  readonly tokenDeployed: boolean;
  readonly contractAddress: `0x${string}` | null;
  readonly chain: ArcConfiguration;
  readonly tokenomics: {
    readonly totalSupply: string | null;
    readonly liquidity: string | null;
    readonly tax: string | null;
    readonly teamAllocation: string | null;
  };
  readonly links: {
    readonly x: string | null;
    readonly telegram: string | null;
    readonly discord: string | null;
    readonly buy: string | null;
  };
}

/**
 * One centralized, deployment-safe configuration surface.
 * Populate only with verified values when SUGRA is actually deployed.
 */
export const SUGRA_CONFIG: SugraConfiguration = {
  name: 'SUGRA',
  website: 'SUGRA.WORLD',
  tagline: 'THE WORLD OF SUGARS',
  tokenSymbol: '$SUGRA',
  tokenDeployed: false,
  contractAddress: null,
  chain: {
    name: 'Arc',
    chainId: null,
    explorerUrl: null,
    usdcAddress: null,
  },
  tokenomics: {
    totalSupply: null,
    liquidity: null,
    tax: null,
    teamAllocation: null,
  },
  links: {
    x: null,
    telegram: null,
    discord: null,
    buy: null,
  },
};

export function isSugraLive(): boolean {
  return SUGRA_CONFIG.tokenDeployed && Boolean(SUGRA_CONFIG.contractAddress);
}

export function deploymentStatus(): 'NOT YET DEPLOYED' | 'LIVE' {
  return isSugraLive() ? 'LIVE' : 'NOT YET DEPLOYED';
}

export function configuredValue(value: string | number | null | undefined): string {
  return value === null || value === undefined || value === '' ? 'TBD' : String(value);
}

export function contractExplorerUrl(): string | null {
  if (!isSugraLive() || !SUGRA_CONFIG.chain.explorerUrl || !SUGRA_CONFIG.contractAddress) {
    return null;
  }

  return `${SUGRA_CONFIG.chain.explorerUrl.replace(/\/$/, '')}/address/${SUGRA_CONFIG.contractAddress}`;
}
