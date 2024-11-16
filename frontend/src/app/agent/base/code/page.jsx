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

  const account = useAccount();

  const BACKEND_URL =
    "https://msl8g5vbv6.execute-api.ap-south-1.amazonaws.com/prod/api/contract/compile";
  // const BACKEND_URL = "localhost:8080/api/compile";
  const BASE_SEPOLIA_CHAIN_ID = 84532;

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
  setAgentResponse;
  //useEffect to monitor sugeestion changes and compile code
  const RenderResult = () => {
    const [ABIcopied, setABICopied] = useState(false);
    const [Bytecopied, setByteCopied] = useState(false);

    const copyToClipboard = (text, ele) => {
      console.log(contractState);
      navigator.clipboard.writeText(text);
    };

    if (!result) {
      return (
        <div className="bg-gray-100 border border-gray-400 text-black p-4 rounded">
          Compilation results will appear here.
        </div>
      );
    }
    //show the compilation error
    if (result.status === "error") {
      const error = result.message;
      return (
        <div>
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
            <h3 className="font-bold">Compilation failed!</h3>
            <p>{error}</p>
          </div>
        </div>
      );
    }

    if (result.status === "success") {
      return (
        <div>
          <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded">
            <h3 className="font-bold">Compilation Successful!</h3>
          </div>

          {/*copy abi and bytecode*/}
          {/*<div className=" p-4 rounded flex items-center space-x-4 justify-end my-2">*/}
          {/*   <Button*/}
          {/*     color="primary"*/}
          {/*     className="flex gap-2 items-center"*/}
          {/*     onClick={() => {*/}
          {/*       copyToClipboard(result.bytecode, 1);*/}
          {/*     }}*/}
          {/*   >*/}
          {/*     <h4 className="">*/}
          {/*       {Bytecopied ? "Bytecode Copied" : "Copy Bytecode"}*/}
          {/*     </h4>*/}
          {/*     {Bytecopied ? <FaClipboardCheck /> : <FaClipboard />}*/}
          {/*   </Button>*/}
          {/*   <Button*/}
          {/*     color="primary"*/}
          {/*     className="flex gap-2 items-center"*/}
          {/*     onClick={() => {*/}
          {/*       copyToClipboard(JSON.stringify(result.abi), 0);*/}
          {/*     }}*/}
          {/*   >*/}
          {/*     <h4 className="">{ABIcopied ? "ABI Copied" : "Copy ABI"}</h4>*/}
          {/*     {ABIcopied ? <FaClipboardCheck /> : <FaClipboard />}*/}
          {/*   </Button>*/}
          {/* </div>*/}
        </div>
      );
    }

    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded">
        Error while compilation!.
      </div>
    );
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

  return (
    <div className="">
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
            <CardHeader className="flex justify-between items-center px-4 py-2">
              <div className="flex items-center">
                <h2 className="text-xl font-bold">Base Agent</h2>
              </div>

              {/*compile and deploy buttons*/}
              {account?.isConnected && (
                <div className="py-2">
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
                    className="ml-4"
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

        <div className="w-1/2 ">
          <Card className="flex-grow h-full">
            {/* <div className="max-w-2xl bg-gray-100 p-4 rounded-lg shadow-md">
                            <div className="flex items-center space-x-4">
                                <Avatar isBordered radius="md" src="/chain/base-logo.png"/>
                                <div className="flex-grow">
                                    {account?.isConnected ? (
                                        <div className="flex items-center justify-between">
                      <span className="text-green-600 font-semibold">
                        Connected
                      </span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-600">Not connected</span>
                                    )}
                                </div>
                                <SecondaryNavbar/>
                            </div>
                        </div>
                        <div className="my-3 h-48 mb-14">
                            <h1 className="font-bold my-2">Describe your smart contract</h1>
                            <textarea
                                value={userPrompt}
                                onChange={(e) => setUserPrompt(e.target.value)}
                                className="w-full h-full p-4 rounded-xl border"
                                placeholder="E.g. I want to create a smart contract that allows users to create a token"
                            />
                        </div>

                        <div className="max-w-xl">
                            {account?.isConnected ? (
                                <Button
                                    disabled={inputDisabled}
                                    onClick={() => handleRunAgent(userPrompt)}
                                    color="primary"
                                >
                                    {inputDisabled ? progressMessage : "Generate code"}
                                </Button>
                            ) : (
                                <WalletConnectButton text="Connect Wallet to Generate Code"/>
                            )}
                        </div>

                        <div className="my-5">
                            <RenderResult/>
                        </div>
                        {account?.isConnected ? (
                            <ContractInteraction currChainId={BASE_SEPOLIA_CHAIN_ID}/>
                        ) : (
                            <div className="text-gray-600 ">
                                <p className="p-2 ">
                                    Please connect your wallet to compile and deploy the contract
                                </p>
                            </div>
                        )} */}

            <ChatPage setAgentResponse={setAgentResponse} />
          </Card>
        </div>
      </div>
    </div>
  );
}
