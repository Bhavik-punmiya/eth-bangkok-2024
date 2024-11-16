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
    'mantle-mainnet': {
      chainId: 5000,
      rpcUrl: 'https://rpc.mantle.xyz',
      explorerUrl: 'https://explorer.mantle.xyz',
      isEVM: true
    },
    'mantle-testnet': {
      chainId: 5001,
      rpcUrl: 'https://rpc.testnet.mantle.xyz',
      explorerUrl: 'https://explorer.testnet.mantle.xyz',
      isEVM: true
    },
    'morph-mainnet': {
      chainId: 2818,
      rpcUrl: 'https://rpc-quicknode.morphl2.io',
      explorerUrl: 'https://explorer.morphl2.io',
      isEVM: true
    },
    'morph-testnet': {
      chainId: 2710,
      rpcUrl: 'https://rpc-testnet.morphl2.io',
      explorerUrl: 'https://explorer-holesky.morphl2.io',
      isEVM: true
    },
    'celo-mainnet': {
      chainId: 42220,
      rpcUrl: 'https://forno.celo.org',
      explorerUrl: 'https://explorer.celo.org',
      isEVM: true
    },
    'celo-alfajores': {
      chainId: 44787,
      rpcUrl: 'https://alfajores-forno.celo-testnet.org',
      explorerUrl: 'https://alfajores-blockscout.celo-testnet.org',
      isEVM: true
    }
  };
  