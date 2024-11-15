import React, { useState } from 'react';
import { readContract } from '@wagmi/core';
import { config } from "@/utils/config";
import { formatUnits } from 'viem';

// Utility function to parse ABI output
const parseOutputData = (data, outputs) => {
    if (!data || !outputs) return null;

    // Handle single output
    if (outputs.length === 1) {
        return formatValue(data, outputs[0].type);
    }

    // Handle multiple outputs
    if (Array.isArray(data)) {
        return outputs.reduce((acc, output, index) => {
            acc[output.name || `output${index}`] = formatValue(data[index], output.type);
            return acc;
        }, {});
    }

    return data;
};

// Enhanced format value function
const formatValue = (value, type) => {
    if (value === undefined || value === null) return null;

    // Handle arrays
    if (type.includes('[]')) {
        return Array.isArray(value)
            ? value.map(item => formatValue(item, type.replace('[]', '')))
            : value;
    }

    // Handle common types
    switch (type) {
        case 'address':
            return value.toLowerCase();
        case 'bool':
            return Boolean(value);
        case 'string':
            return value === '0x' ? '' : value;
        default:
            if (type.startsWith('uint')) {
                try {
                    return formatUnits(value, 0);
                } catch {
                    return value.toString();
                }
            }
            if (type.startsWith('int')) {
                return value.toString();
            }
            return value;
    }
};

// Component to render a single output value
const OutputValue = ({ value, label }) => {
    if (value === null || value === undefined) return null;

    if (Array.isArray(value)) {
        return (
            <div className="ml-2">
                <span className="font-medium">{label}:</span>
                <ul className="list-disc ml-4">
                    {value.map((item, index) => (
                        <li key={index}>{String(item)}</li>
                    ))}
                </ul>
            </div>
        );
    }

    if (typeof value === 'boolean') {
        return (
            <div className="ml-2">
                <span className="font-medium">{label}:</span>{' '}
                <span className={value ? 'text-green-600' : 'text-red-600'}>
                    {value.toString()}
                </span>
            </div>
        );
    }

    return (
        <div className="ml-2">
            <span className="font-medium">{label}:</span>{' '}
            <span className="font-mono">{String(value)}</span>
        </div>
    );
};

const ContractReadFunction = ({
                                  func,
                                  address,
                                  abi,
                                  results,
                                  setResults
                              }) => {
    const [error, setError] = useState(null);

    const inputs = results[func.name]?.inputs || {};
    const args = Object.values(inputs);
    const outputDefinition = func.outputs || [];
    const currentResult = results[func.name]?.result;

    const handleRead = async () => {
        try {
            console.log("Calling view function", func.name, "with args:", args);

            const data = await readContract(config, {
                address: address,
                abi: abi,
                functionName: func.name,
                args: args.length > 0 ? args : undefined,
                account: undefined,
                chainId: config.chainId,
            });

            console.log("Raw response:", data);

            const parsedData = parseOutputData(data, outputDefinition);

            setResults(prev => ({
                ...prev,
                [func.name]: {
                    ...prev[func.name],
                    result: parsedData,
                    error: null,
                    timestamp: Date.now()
                }
            }));

            console.log("Parsed data:", parsedData);
            setError(null);

        } catch (err) {
            console.error("Error reading contract:", err);
            const errorMessage = err.cause ? `${err.message}\nCause: ${err.cause}` : err.message;
            setError(errorMessage);

            setResults(prev => ({
                ...prev,
                [func.name]: {
                    ...prev[func.name],
                    result: null,
                    error: errorMessage,
                    timestamp: Date.now()
                }
            }));
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center space-x-2">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    onClick={handleRead}
                >
                    {`Call ${func.name}`}
                </button>
            </div>

            {error && (
                <div className="text-red-500 text-sm mt-2">
                    {error}
                </div>
            )}

            {currentResult && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <h3 className="font-semibold mb-2">Results:</h3>
                    {typeof currentResult === 'object' ? (
                        Object.entries(currentResult).map(([key, value]) => (
                            <OutputValue key={key} label={key} value={value} />
                        ))
                    ) : (
                        <OutputValue label="Output" value={currentResult} />
                    )}
                </div>
            )}
        </div>
    );
};

export default ContractReadFunction;