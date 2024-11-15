import { http, createConfig } from "@wagmi/core";
import {
  mainnet,
  sepolia,
  baseSepolia,
  optimismSepolia,
} from "@wagmi/core/chains";

// use NODE_ENV to not have to change config based on where it's deployed
export const NEXT_PUBLIC_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://onchain-app-template.vercel.app";
// Add your API KEY from the Coinbase Developer Portal
export const NEXT_PUBLIC_ONCHAINKIT_API_KEY =
  process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY;
export const NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
export const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY;

export const config = createConfig({
  chains: [baseSepolia, optimismSepolia],
  transports: {
    [baseSepolia.id]: http(),
    [optimismSepolia.id]: http(),
  },
});
