// deployments/index.js
import { deployEVMContract } from './evm/deploy';
// import { deploySolanaContract } from './solana/deploy';
import { CHAIN_CONFIGS } from '@/utils/chains';

export const deployContract = async ({
  chain,
  contractData,
  constructorArgs,
  privateKey,
  onSuccess,
  onError
}) => {
  const chainConfig = CHAIN_CONFIGS[chain];
  
  if (!chainConfig) {
    throw new Error(`Unsupported chain: ${chain}`);
  }

  if (chainConfig.isEVM) {
    return deployEVMContract({
      chainId: chainConfig.chainId,
      privateKey,
      abi: contractData.abi,
      bytecode: contractData.bytecode,
      constructorArgs,
      onSuccess,
      onError
    });
  } 

  throw new Error(`No deployment implementation for chain: ${chain}`);
};