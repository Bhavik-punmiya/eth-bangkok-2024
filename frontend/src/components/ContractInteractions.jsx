"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Input, Button, Accordion, AccordionItem } from "@nextui-org/react";
import { useContractState } from "@/contexts/ContractContext";
import {
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
} from "@coinbase/onchainkit/transaction";
import ContractReadFunction from "./ContractReadComp";

const ContractInteraction = ({ currChainId }) => {
  const { contractState } = useContractState();
  const { abi, address } = contractState;
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const contracts = [
    {
      address: address,
      abi: abi,
      functionName: "",
      args: [],
    },
  ];

  const handleOnStatus = useCallback((status) => {
    console.log("LifecycleStatus", status);
    if (status.statusName === "success") {
      setResults((prev) => ({
        ...prev,
        [status.functionName]: {
          ...prev[status.functionName],
          result: "Transaction successful",
        },
      }));
    }
  }, []);

  const handleInputChange = (functionName, index, value) => {
    setResults((prev) => ({
      ...prev,
      [functionName]: {
        ...prev[functionName],
        inputs: {
          ...(prev[functionName]?.inputs || {}),
          [index]: value,
        },
      },
    }));
  };

  if (!abi || !address) {
    return (
      <p className="bg-gray-100 border border-gray-400 text-black p-4 rounded">
        Please deploy a contract to interact.
      </p>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Contract Interaction</h2>
      <p className="mb-2 whitespace-pre-wrap">
        <strong>Contract Address:</strong> {address}
      </p>
      <Accordion>
        {abi
          .filter((item) => item.type === "function")
          .map((func) => {
            const isViewFunction =
              func.stateMutability === "view" ||
              func.stateMutability === "pure";
            const functionContracts = [
              {
                ...contracts[0],
                functionName: func.name,
                args: func.inputs
                  ? Object.values(results[func.name]?.inputs || {})
                  : [],
              },
            ];

            return (
              <AccordionItem key={func.name} title={func.name}>
                <div className="space-y-2">
                  {func.inputs &&
                    func.inputs.map((input, index) => (
                      <div key={index} className="flex flex-col gap-2">
                        <label
                          className="text-sm"
                          htmlFor={input.name}
                        >{`${input.name} (${input.type})`}</label>
                        <input
                          key={`${func.name}-${index}`}
                          placeholder={`Enter ${input.name}`}
                          className="mb-2 border-gray-100 bg-gray-100 py-2 px-3 rounded"
                          onChange={(e) =>
                            handleInputChange(func.name, index, e.target.value)
                          }
                        />
                      </div>
                    ))}

                  {isViewFunction ? (
                    <ContractReadFunction
                      func={func}
                      address={address}
                      abi={abi}
                      results={results}
                      setResults={setResults}
                    />
                  ) : (
                    <Transaction
                      chainId={currChainId}
                      contracts={functionContracts}
                      onStatus={handleOnStatus}
                    >
                      <TransactionButton>
                        {func.name} ({func.stateMutability})
                      </TransactionButton>
                      <TransactionSponsor />
                      <TransactionStatus>
                        <TransactionStatusLabel />
                        <TransactionStatusAction />
                      </TransactionStatus>
                    </Transaction>
                  )}
                </div>
              </AccordionItem>
            );
          })}
      </Accordion>
    </div>
  );
};

export default ContractInteraction;
