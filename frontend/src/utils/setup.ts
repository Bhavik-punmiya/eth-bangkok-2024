import { createCoinbaseWalletSDK } from "@coinbase/wallet-sdk";

export const sdk = createCoinbaseWalletSDK({
  appName: "My App",
  appChainIds: [84532],
});
