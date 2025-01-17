
# Meta Transactions

## Overview
This project implements a meta-transaction-enabled NFT contract using ERC-2771. It uses a Trusted Forwarder to enable gasless transactions for end users. The project utilizes Hardhat Ignition for deploying and managing smart contracts.

## Features
- **ERC-2771 Meta Transactions**: Enables gasless transactions using a forwarder contract.
- **NFT Contract**: Supports minting and transferring NFTs.
- **EIP-712 Domain**: Provides structured data signing for secure meta-transactions.

---

## Project Structure

### Smart Contracts
1. **TrustedForwarder**: A contract that validates the meta-transaction requests.
2. **MetaTxNFT**: The main NFT contract that integrates with the Trusted Forwarder and inherits ERC2771Context.

### Scripts and Utilities
1. **Deployment Modules**:
   - `forwarder.js`: Deploys the TrustedForwarder contract.
   - `nft.js`: Deploys the MetaTxNFT contract.

2. **EIP-712 Utilities**:
   - `eip712.js`: Provides utilities to generate domain types and hash typed data.
   - `eip712-types.js`: Defines schemas for EIP-712 structured data.

3. **Helper Functions**:
   - `iterate.js`: Provides utility functions for handling arrays and objects.

---

## Understanding ERC-2771
ERC-2771 is a standard for supporting meta-transactions on Ethereum. Meta-transactions allow a third party (known as a relayer) to pay for the gas fees on behalf of the end user. This approach is especially useful for enhancing user experience, as it enables gasless interactions with blockchain applications.

### Key Components of ERC-2771:
1. **Trusted Forwarder**:
   - Acts as a middleman to validate and forward transactions on behalf of users.
   - Ensures that the transaction originates from a trusted relayer.

2. **MetaTxNFT Contract**:
   - Integrates with the Trusted Forwarder to process meta-transactions.
   - Validates the meta-transaction signature using the EIP-712 standard.

### Benefits of ERC-2771:
- **Improved User Experience**: End users are not required to hold ETH for gas fees.
- **Seamless Integration**: Developers can integrate gasless transactions without significant changes to the existing contract logic.
- **Security**: Relayers are authenticated using signatures and domain separation, reducing the risk of malicious activities.

---

## Prerequisites

1. **Node.js** (>= 14.x)
2. **Hardhat** (latest version)
3. **NPM or Yarn**

Install dependencies by running:
```bash
npm install
```

---

## Deployment

This project uses Hardhat Ignition for deploying contracts.

### Steps

1. **Compile Contracts**:
   ```bash
   npx hardhat compile
   ```

2. **Deploy TrustedForwarder**:
   Use the following command to deploy the TrustedForwarder contract:
   ```bash
   npx hardhat ignition deploy ./ignition/modules/forwarder.js --network polygonAmoy
   ```

3. **Deploy MetaTxNFT**:
   Update the `nft.js` module with the Trusted Forwarder's deployed address, then deploy the NFT contract:
   ```bash
   npx hardhat ignition deploy ./ignition/modules/nft.js --network polygonAmoy
   ```

4. **Run Meta-Transaction Script**:
   After deployment, use the following command to execute the ERC-2771 meta-transaction script:
   ```bash
   npx hardhat run scripts/ERC2771MetaTransaction.ts
   ```

### Configuration
Update the constructor arguments in `nft.js` to include:
- **FORWARDER_CONTRACT_ADDRESS**: Address of the deployed Trusted Forwarder.
- **MYNft**: Name of your NFT.
- **NFT_CONTRACT_OWNER**: Address of the owner.

---

## Running Scripts

### EIP-712 Domain Utilities
Generate the domain details for a contract:
```bash
node eip712.js
```

---

## Key Commands

### Compile
```bash
npx hardhat compile
```

### Deploy Contracts
```bash
npx hardhat ignition deploy --module <MODULE_FILE> --network <NETWORK_NAME>
```

### Run Meta-Transaction Script
```bash
npx hardhat run scripts/ERC2771MetaTransaction.ts
```

---

## Additional Information

### Libraries Used
- **ethers.js**: For interacting with Ethereum contracts.
- **Hardhat Ignition**: For managing complex deployment processes.

### Notes
- Ensure you configure the `hardhat.config.js` file to include your network details.
- Double-check the deployment addresses in your `nft.js` and `forwarder.js` files.

---

## License
This project is licensed under the MIT License.
