"use client";
import { Avatar } from "@nextui-org/react";
import React, { useState } from "react";
import WalletConnectButton from "@/components/WalletConnectButton";
import { useAccount } from "wagmi";
import Chat from "@/components/chat";
import SecondaryNavbar from "@/components/SecondaryNavbar";

export default function ChatPage({setAgentResponse}) {
  const account = useAccount();

  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 3)}...${address.slice(-3)}`;
  };

  return (
    <div className="h-full">
      <div className="flex gap-5 w-full px-5 justify-between items-center">
        {/* 
        <div className="flex items-center space-x-4 w-fit bg-gray-100 p-4 rounded-lg  shadow-md mx-auto">
          <Avatar isBordered radius="md" src="/chain/base-logo.png" />
          <div className="flex-grow">
            {account.isConnected ? (
              <div className="flex items-center justify-between">
                <span className="text-green-600 font-semibold mr-5">
                  Connected
                </span>
                <span className="text-gray-600 text-sm">
                  {shortenAddress(account?.address)}
                </span>
              </div>
            ) : (
              <span className="text-gray-600">Not connected</span>
            )}
          </div>
          <WalletConnectButton /> 
        </div> */}

        {/* <SecondaryNavbar /> */}
      </div>
      <div className="">
        <Chat setAgentResponse={setAgentResponse} />
      </div>
    </div>
  );
}
