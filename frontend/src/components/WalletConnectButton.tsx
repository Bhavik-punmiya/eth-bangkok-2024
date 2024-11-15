"use client";

import WalletWrapper from "./WalletWrapper";

export default function WalletConnectButton({
  text,
  className,
}: {
  text: string;
  className: string;
}) {
  return (
    <WalletWrapper
      className={className || "min-w-[90px] bg-blue-500 hover:bg-blue-600"}
      text={text || "Connect Wallet"}
      withWalletAggregator={true}
    />
  );
}
