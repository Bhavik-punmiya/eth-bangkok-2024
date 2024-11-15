import React, {useState, useEffect} from 'react';
import {Input, Button} from '@nextui-org/react';
import {ethers} from 'ethers';
import {FaTimes} from "react-icons/fa";

const ConstructorArgsModal = ({abi, onSubmit, setIsModalOpen}) => {
    const [constructorInputs, setconstructorInputs] = useState([]);
    const [constructorValues, setConstructorValues] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        // Find constructor in ABI
        const constructor = abi.find(item => item.type === 'constructor');
        if (constructor && constructor.inputs) {
            setconstructorInputs(constructor.inputs);
            // Initialize values object
            const initialValues = {};
            constructor.inputs.forEach(input => {
                initialValues[input.name] = '';
            });
            setConstructorValues(initialValues);
        }
    }, [abi]);

    const handleInputChange = (name, value) => {

        setConstructorValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        try {
            console.log(constructorValues);
            // Validate and format inputs based on their types
            const args = constructorInputs.map(input => {
                const value = constructorValues[input.name];
                console.log(value, input);
                if (!value && value !== 0) {
                    throw new Error(`${input.name} is required`);
                }

                // Handle different types
                switch (input.type) {
                    case 'address':
                        if (!ethers.utils.isAddress(value)) {
                            throw new Error(`Invalid address for ${input.name}`);
                        }
                        return value;
                    case 'string':
                        return value;
                    case 'bool':
                        return value === 'true' || value === true;
                    // Add more type handlers as needed
                    default:
                        return value;
                }
            });

            setError('');
            onSubmit(args);
        } catch (err) {
            setError(err.message);
        }
    };

    if (!constructorInputs.length) {
        return null;
    }

    return (
        <div className="left-0 top-0 fixed w-screen h-screen bg-opacity-60  bg-gray-900  flex items-center justify-center z-40">
            <div className="bg-white rounded p-5 relative">
                <button className="absolute top-3 right-3"
                onClick={()=>{setIsModalOpen(false)}}>
                    <FaTimes/>
                </button>
                <h3 className="text-lg font-semibold mb-4">Constructor Arguments</h3>
                {constructorInputs.map((input, index) => (
                    <div key={index} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {input.name} ({input.type})
                        </label>
                        <Input
                            placeholder={`Enter ${input.type}`}
                            value={constructorValues[input.name] || ''}
                            onChange={(e) => handleInputChange(input.name, e.target.value)}
                            className="w-full"
                        />
                    </div>
                ))}
                {error && (
                    <div className="text-red-500 text-sm mb-4">{error}</div>
                )}
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    className="w-full"
                >
                    Set Constructor Arguments and Deploy
                </Button>
            </div>
        </div>
    );
};

export default ConstructorArgsModal;