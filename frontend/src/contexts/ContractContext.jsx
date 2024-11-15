"use client";
import React, { createContext, useState, useContext } from "react";

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [contractState, setContractState] = useState({
    abi: null,
    bytecode: null,
    address: null,
    isCompiled: false,
    isDeployed: false,
  });

  return (
    <ContractContext.Provider value={{ contractState, setContractState }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContractState = () => useContext(ContractContext);

/*
{
    "abi": [
        {
            "inputs": [],
            "name": "get",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "x",
                    "type": "uint256"
                }
            ],
            "name": "set",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ],
    "bytecode": "6080604052348015600e575f5ffd5b506101298061001c5f395ff3fe6080604052348015600e575f5ffd5b50600436106030575f3560e01c806360fe47b11460345780636d4ce63c14604c575b5f5ffd5b604a60048036038101906046919060a9565b6066565b005b6052606f565b604051605d919060dc565b60405180910390f35b805f8190555050565b5f5f54905090565b5f5ffd5b5f819050919050565b608b81607b565b81146094575f5ffd5b50565b5f8135905060a3816084565b92915050565b5f6020828403121560bb5760ba6077565b5b5f60c6848285016097565b91505092915050565b60d681607b565b82525050565b5f60208201905060ed5f83018460cf565b9291505056fea2646970667358221220cf1534e5e81f95f152fc8392583e91fe1092c4464e19f460ba7c0c57c326112a64736f6c634300081b0033",
    "address": "0xd8e5B00C3d95AAD14D7DBE5AEC294098c8c643ef",
    "isCompiled": true,
    "isDeployed": true,
    "blockExplorerUrl": "https://sepolia.basescan.org/address/0xd8e5B00C3d95AAD14D7DBE5AEC294098c8c643ef"
}

 */