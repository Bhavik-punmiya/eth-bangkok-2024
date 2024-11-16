import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";

export const sdk = new CoinbaseWalletSDK({
  appName: "ContractAi",
  appChainIds: [84532],
});
