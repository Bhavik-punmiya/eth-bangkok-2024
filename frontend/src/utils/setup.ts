import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";

export const sdk = new CoinbaseWalletSDK({
  appName: "Decentrix AI",
  appChainIds: [84532],
});
