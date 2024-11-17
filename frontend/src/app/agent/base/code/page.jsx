"use client";
import React, { useState, useContext, useEffect } from "react";
import { Avatar, Button, Card, CardBody, CardHeader } from "@nextui-org/react";
import { ethers } from "ethers";
import SolidityEditor from "@/components/SolidityEditor";
import axios from "axios";
import WalletConnectButton from "@/components/WalletConnectButton";
import { useAccount } from "wagmi";
import { useSolidityCodeAgent } from "@/hooks/useSolidityCodeAgent";
import { Toaster, toast } from "react-hot-toast";
import { useContractState } from "@/contexts/ContractContext";
import { saveContractData, saveSolidityCode } from "@/lib/contractService";
import ContractInteraction from "@/components/ContractInteractions";
import { PRIVATE_KEY } from "@/utils/config";
import ConstructorArgsModal from "@/components/ConstructorArgsModal";
import SecondaryNavbar from "@/components/SecondaryNavbar";
import { deployContract } from "@/contracts";
import { CHAIN_CONFIGS } from "@/utils/chains";
import ChatPage from "../chat/page";
import AuditModal from "@/components/AuditModal"; // Create this file with the code above

export default function Editor() {
  const {
    agentResponse,
    handleRunAgent,
    inputDisabled,
    setAgentResponse,
    progressMessage,
  } = useSolidityCodeAgent();

  const [userPrompt, setUserPrompt] = useState("");
  const [result, setResult] = useState(null);
  const { setContractState, contractState } = useContractState();
  const [isCompiling, setCompiling] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const account = useAccount();

  const BACKEND_URL =
    "https://msl8g5vbv6.execute-api.ap-south-1.amazonaws.com/prod/api/contract/compile";
  // const BACKEND_URL = "localhost:8080/api/compile";

  useEffect(() => {
    const loadedCode = localStorage.getItem("loadedContractCode");
    if (loadedCode) {
      setAgentResponse(loadedCode);
      // Clear the stored code after loading
    }
  }, []);

  const compileCode = async () => {
    setCompiling(true);

    //if agent response is empty
    if (!agentResponse) {
      toast.error("Nothing to compile! .");
      setCompiling(false);
      return;
    }

    //if agent response contains import statements
    if (agentResponse.includes("import")) {
      toast.error("Importing contracts is not yet supported :(");
      setCompiling(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append(
        "file",
        new Blob([agentResponse], { type: "text/plain" }),
        "Contract.sol"
      );
      const response = await axios.post(BACKEND_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
      // console.log("Compilation result:---------------", response.data);
      toast.success("Contract compiled successfully!");
      if (response.data.status === "success") {
        setContractState((prevState) => ({
          ...prevState,
          abi: response.data.abi,
          bytecode: response.data.bytecode,
          isCompiled: true,
        }));
      }
    } catch (error) {
      console.error("Error compiling contract:", error.response.data);
      toast.error("Error compiling contract!");
      setResult(error.response.data);
    } finally {
      setCompiling(false);
    }
  };

  const DeployContract = async ({ constructorArgs }) => {
    console.log("Deploying contract...");
    setIsModalOpen(false);

    try {
      setIsDeploying(true);

      if (!PRIVATE_KEY) {
        toast.error("Please enter a private key");
        return;
      }

      // You can get the selected chain from your UI state
      const selectedChain = "base-sepolia"; // or from state/props

      const deploymentData = await deployContract({
        chain: selectedChain,
        contractData: {
          abi: result.abi,
          bytecode: result.bytecode,
        },
        constructorArgs,
        privateKey: PRIVATE_KEY,
        onSuccess: async (data) => {
          const solidityCode = agentResponse;
          const fileName = `Contract_${data.contractAddress}.sol`;
          const solidityFilePath = await saveSolidityCode(
            solidityCode,
            fileName
          );

          // Save additional contract data
          if (account && account?.address) {
            await saveContractData(
              {
                ...data,
                solidityFilePath,
              },
              account.address
            );
          }

          await setContractState((prevState) => ({
            ...prevState,
            address: data.contractAddress,
            isDeployed: true,
            blockExplorerUrl: data.blockExplorerUrl,
          }));

          toast.success(
            <div>
              Contract deployed successfully!
              <a
                href={data.blockExplorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 text-black-500 hover:underline"
              >
                View on Block Explorer
              </a>
            </div>,
            { duration: 5000 }
          );
        },
        onError: (error) => {
          console.error("Error deploying contract:", error);
          if (error.code === "INVALID_ARGUMENT") {
            toast.error("Invalid constructor arguments or private key");
          } else {
            toast.error(`Error deploying contract: ${error.message}`);
          }
        },
      });
    } catch (error) {
      setError(error);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleCodeChange = (code) => {
    setAgentResponse(code);
    localStorage.setItem("loadedContractCode", code);
  };

  const handleDeployContract = async () => {
    console.log("Deploying contract...");
    //check if the contract has been compiled
    if (!result || result.status !== "success") {
      toast.error("Please compile the contract successfully before deploying.");
      return;
    }

    //check if contract has constructor arguments in result.abi
    if (result.abi.filter((item) => item.type === "constructor").length > 0) {
      if (
        result.abi.filter((item) => item.type === "constructor")[0].inputs
          .length > 0
      ) {
        console.log("Constructor arguments found");
        console.log(result.abi);
        setIsModalOpen(true);
        return;
      }
    }

    //deploy contract
    await DeployContract({
      constructorArgs: [],
    });
  };

  //audit functions
  const auditCode = async () => {
    console.log("Auditing code...");
    setIsAuditModalOpen(true);
  };

  const handleAuditSelection = (method) => {
    if (method === "agent") {
      // Handle agent audit
      console.log("Starting agent audit...");
      // Add your agent audit logic here
    } else if (method === "spearbit") {
      // Handle SpearBit audit
      console.log("Starting SpearBit audit...");
      // Add your SpearBit audit logic here
    }
  };

  return (
    <div className="">
      <AuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        onSelectOption={handleAuditSelection}
        contractCode={agentResponse}
      />
      <Toaster />
      {isModalOpen && (
        <ConstructorArgsModal
          setIsModalOpen={setIsModalOpen}
          abi={result.abi}
          onSubmit={async (args) => {
            await DeployContract({ constructorArgs: args });
          }}
        />
      )}
      <div className="flex gap-2 ">
        {/*code editor part*/}
        <div className="w-1/2 flex flex-col">
          <Card className="flex-grow">
            <CardHeader className="flex justify-end items-center px-4 py-2">
              {/*compile and deploy buttons*/}
              {account?.isConnected && (
                <div className="flex items-center py-2 gap-2">
                  <Button
                    color="default"
                    onClick={auditCode}
                    isLoading={isAuditing}
                    className=""
                  >
                    {isCompiling ? "Auditing..." : "Audit contract"}
                  </Button>
                  <Button
                    color="default"
                    onClick={compileCode}
                    isLoading={isCompiling}
                    className=""
                  >
                    {isCompiling ? "Compiling..." : "Compile"}
                  </Button>
                  <Button
                    color="success"
                    onClick={handleDeployContract}
                    isLoading={isDeploying}
                    className=""
                  >
                    {isDeploying ? "Deploying..." : "Deploy"}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardBody className="px-4 h-full">
              <div
                className="h-full overflow-auto"
                style={{ maxHeight: "calc(100vh - 200px)" }}
              >
                <div className="flex flex-col h-full">
                  <div className="flex-grow h-screen">
                    <SolidityEditor
                      code={agentResponse}
                      defaultValue={"// Solidity code will appear here"}
                      onChange={handleCodeChange}
                    />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/*chat part*/}
        <div className="w-1/2 ">
          <Card className="flex-grow h-full">
            <ChatPage setAgentResponse={setAgentResponse} />
          </Card>
        </div>
      </div>
    </div>
  );
}
