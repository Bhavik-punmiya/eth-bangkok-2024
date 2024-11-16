"use client";
import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaCode,
  FaRobot,
  FaUser,
  FaEthereum,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import { Button } from "@nextui-org/react";
import { useContractState } from "@/contexts/ContractContext";
import ContractInteraction from "@/components/ContractInteractions";
import { useRouter, usePathname } from "next/navigation";
import { BsChatDotsFill } from "react-icons/bs";

const Sidebar = () => {
  const [chainName, setChainName] = useState(null);
  const { contractState } = useContractState();
  const [activeIcon, setActiveIcon] = useState(null);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleIconClick = (icon) => {
    if (icon === "contract") {
      setActiveIcon(activeIcon === icon ? null : icon);
    } else {
      setActiveIcon(null);
    }
  };

  useEffect(() => {
    if (pathname) {
      setChainName(pathname.split("/")[2]);
    }
  }, [pathname]);

  const SidebarIcon = ({ icon, path, iconName, label }) => (
    <div
      className="relative h-10 w-10 flex items-center justify-center m-4 rounded-md hover:bg-theme-purple focus:bg-gray-200"
      onMouseEnter={() => setHoveredIcon(iconName)}
      onMouseLeave={() => setHoveredIcon(null)}
    >
      <Button
        auto
        color="transparent"
        onClick={() => handleIconClick(iconName, path)}
        className="flex items-center justify-center"
        title={label}
      >
        {icon}
      </Button>
      {hoveredIcon === iconName && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-lg rounded whitespace-nowrap">
          {label}
        </div>
      )}
    </div>
  );

  const NestedSidebar = ({ title, children }) => (
    <div
      className="absolute top-0 w-[38vw] bg-white p-4 text-black shadow overflow-y-auto"
      style={{ height: "calc(100vh - 50px)" }}
    >
      <div className="flex h-full items-center">
        <div className="flex flex-col h-full w-full">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <div className="space-y-2">{children}</div>
        </div>

        <FaChevronLeft
          className=" cursor-pointer"
          onClick={() => handleIconClick(null)}
          size="20"
        />
      </div>
    </div>
  );

  return (
    <div
      className="fixed top-[4.5rem] left-0 w-fit m-0 flex flex-col bg-theme-purple-light  text-black  z-50 shadow-lg"
      style={{ height: "calc(100vh - 50px)" }}
    >
      {/* <SidebarIcon icon={<FaHome size="24" />} path="/" iconName="home" label="Home" />
            <SidebarIcon icon={<FaCode size="24" />} path={`/agent/${chainName}/code`} iconName="code" label="Code" />
            <SidebarIcon icon={<BsChatDotsFill size="24" />} path={`/agent/${chainName}/chat`} iconName="robot" label="Chat" />
            <SidebarIcon icon={<FaEthereum size="24" />} iconName="contract" label="Contract" />
            <SidebarIcon icon={<FaUser size="24" />} path="/dashboard" iconName="user" label="User" /> */}

      {activeIcon === "contract" ? (
        <NestedSidebar title="Contract Interaction">
          {contractState.isDeployed && contractState.abi ? (
            <div
              className="text-xs w-[125%]"
              style={{ transform: "scale(0.8)", transformOrigin: "top left" }}
            >
              <ContractInteraction />
            </div>
          ) : (
            <div
              className="p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded w-full"
              style={{ transformOrigin: "top left" }}
            >
              <p className="font-bold text-sm">No Contracts Deployed Yet</p>
              <p className="mt-2 text-xs">
                Please deploy a contract to interact with it.
              </p>
            </div>
          )}
        </NestedSidebar>
      ) : (
        <div
          className="flex h-full items-center cursor-pointer  relative w-3 bg-theme-purple-light"
          onClick={() => handleIconClick("contract")}
        >
          <div className="absolute top-7 whitespace-nowrap p-2 rounded-full flex gap-3 items-center justify-center bg-theme-purple-light">
            <p className="">Interact with contract</p>
            <FaChevronRight className=" " size="10" />
          </div>
        </div>
      )}

      {/* {activeIcon === "user" && (
        <NestedSidebar title="User">
          <Button auto color="primary">
            User Option 1
          </Button>
          <Button auto color="primary">
            User Option 2
          </Button>
        </NestedSidebar>
      )} */}
    </div>
  );
};

export default Sidebar;
