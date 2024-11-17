"use client";
import { Avatar } from "@nextui-org/react";
import React, { useState } from "react";
import WalletConnectButton from "@/components/WalletConnectButton";
import { useAccount } from "wagmi";
import Chat from "@/components/chat";
import SecondaryNavbar from "@/components/SecondaryNavbar";

export default function ChatPage({ setAgentResponse }) {
  const account = useAccount();

  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 3)}...${address.slice(-3)}`;
  };

  return (
    <div className="h-full">
      <div className="flex gap-5 w-full px-5 justify-between items-center"></div>
      <div className="">
        <Chat setAgentResponse={setAgentResponse} />
      </div>
    </div>
  );
}
