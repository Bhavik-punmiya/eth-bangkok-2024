export const CHAIN_CONFIGS = {
    // EVM Chains
    'base-mainnet': {
      chainId: 8453,
      rpcUrl: 'https://mainnet.base.org',
      explorerUrl: 'https://basescan.org',
      isEVM: true
    },
    'base-sepolia': {
      chainId: 84532,
      rpcUrl: 'https://sepolia.base.org',
      explorerUrl: 'https://sepolia.basescan.org',
      isEVM: true
    },
    'ethereum': {
      chainId: 1,
      rpcUrl: 'https://mainnet.infura.io/v3/YOUR_KEY',
      explorerUrl: 'https://etherscan.io',
      isEVM: true
    },
    // Non-EVM Chains example
    'solana': {
      cluster: 'mainnet-beta',
      rpcUrl: 'https://api.mainnet-beta.solana.com',
      explorerUrl: 'https://explorer.solana.com',
      isEVM: false
    }
  };
  