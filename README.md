# Project README

## **SmartContractBot**

### **Description**
SmartContractBot is an advanced platform designed to streamline the process of writing, compiling, deploying, and auditing smart contracts. The tool uses AI-driven agents to assist users in creating robust smart contracts by providing documentation, real-time suggestions, and insights. With full support for multiple blockchains, including **Morph** and **Flow**, this platform offers a one-stop solution for decentralized application (dApp) developers to easily manage their smart contract workflow. It enables end-to-end interactions with the Morph Holesky testnet and Flow testnet, simplifying smart contract creation and deployment for developers of all levels.

![eth global bangkok ](https://github.com/user-attachments/assets/89cb635f-b069-4256-a307-3654789ddd24)


### **Technologies Used**
- **Blockchain**: 
  - **Morph Holesky Testnet**: End-to-end integration for smart contract deployment and interaction with Morph's zkEVM and modular design.
  - **Flow Testnet**: Added smart contract auditing features to provide a comprehensive solution for writing, compiling, and deploying contracts.
  - **Polygon PoS**: Deployed for AI-enhanced smart contract auditing and decentralized applications.

- **Backend**: 
  - **Node.js & Express**: Handles all backend operations, including managing smart contract deployment, auditing, and interaction with blockchain networks.
  - **AWS Lambda**: Used for backend serverless functions, ensuring scalability.

- **Frontend**: 
  - **React & Next.js**: Provides a dynamic, user-friendly interface for interacting with the smart contract tool, including contract creation, deployment, and auditing functions.
  - **TailwindCSS**: For rapid and responsive UI design.

- **AI Integration**: 
  - Integrated an AI agent to assist in the creation, writing, and auditing of smart contracts, offering real-time documentation and insights during the development process.

### **Sponsors and Integration**

- **Morph**: 
  - We integrated **Morph’s agent** to assist users in creating smart contracts and interacting with the Morph Holesky testnet. This integration ensures seamless deployment and interaction with the Morph blockchain ecosystem, providing users with an AI-backed solution for managing contracts from start to finish.

- **Flow**: 
  - Collaborated with **Flow mentors** to implement a smart contract **auditing feature**. By incorporating Flow’s capabilities, we’ve transformed the platform into a complete solution for writing, compiling, deploying, and auditing smart contracts. This integration makes the platform a one-stop solution for developers working with Flow’s testnet.

- **Polygon**: 
  - For **Polygon**, the project incorporates **AI-enhanced smart contract auditing** to improve the process of contract validation and deployment. With this functionality, users can deploy their contracts on Polygon’s PoS network, ensuring they are secure and optimized. The platform enables AI-powered contract analysis and validation, which is crucial for improving the security and reliability of smart contracts.

---

### **Setup Instructions**

1. **Frontend**:
   - Clone the repository and run the following commands in the root directory:
     ```bash
     npm i
     cd frontend
     ```
   - Complete the `env.local` file with your project’s environment settings.
   - Start the frontend development server with:
     ```bash
     npm run dev
     ```
     This will start the React/Next.js app on the specified port.

2. **Backend**:
   - The backend is built using Node.js and AWS Lambda. To run it locally, you can convert it to an Express.js project and follow these steps:
     - Ensure you have Node.js installed.
     - From the root directory, run:
       ```bash
       node app
       ```
     - The server will start, handling requests for smart contract deployment, auditing, and interaction.

3. **Blockchain Deployment**:
   - **Morph**: Make sure your smart contract is deployed on the **Morph Holesky Testnet** and is ready for interaction.
   - **Flow**: Deploy your smart contracts to the **Flow Testnet** for full auditing and contract management.
   - **Polygon**: Ensure the smart contract is compatible with **Polygon PoS** and deployed for auditing and AI-enhanced functionality.

### **Additional Requirements**:
- Deploy the application on the **Morph Holesky testnet**, **Flow Testnet**, and **Polygon PoS**.
- Submit a **working video demo** showcasing the platform’s key functionalities such as smart contract writing, deployment, and auditing.
- Provide detailed **documentation** with setup instructions and a user guide, and leave constructive **feedback** on the development experience.
