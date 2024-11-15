import { ethers } from 'ethers';
import { CHAIN_CONFIGS } from '@/utils/chains';

export const deployEVMContract = async ({
  chainId,
  privateKey,
  abi,
  bytecode,
  constructorArgs,
  onSuccess,
  onError
}) => {
  try {
    // Find chain config
    const chainConfig = Object.values(CHAIN_CONFIGS).find(
      config => config.chainId === chainId && config.isEVM
    );
    
    if (!chainConfig) {
      throw new Error(`Unsupported EVM chain ID: ${chainId}`);
    }

    // Setup provider and wallet
    const provider = new ethers.providers.JsonRpcProvider(chainConfig.rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    // Verify network
    const network = await provider.getNetwork();
    if (network.chainId !== chainId) {
      throw new Error(`Connected to wrong network. Expected ${chainId}, got ${network.chainId}`);
    }

    // Deploy contract
    const contractFactory = new ethers.ContractFactory(abi, bytecode, wallet);
    const contract = await contractFactory.deploy(...constructorArgs);
    await contract.deployed();

    // Generate explorer URL
    const explorerUrl = `${chainConfig.explorerUrl}/address/${contract.address}`;

    // Prepare deployment data
    const deploymentData = {
      chainId,
      contractAddress: contract.address,
      abi,
      bytecode,
      blockExplorerUrl: explorerUrl,
      deploymentDate: new Date().toISOString()
    };

    onSuccess?.(deploymentData);
    return deploymentData;

  } catch (error) {
    onError?.(error);
    throw error;
  }
};