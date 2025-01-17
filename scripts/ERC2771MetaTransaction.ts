import "dotenv/config";
import { ethers } from "hardhat";
import forwarderAbi from "../artifacts/contracts/forwarder.sol/TrustedForwarder.json";
import nftAbi from "../artifacts/contracts/nftMetaTx.sol/MetaTxNFT.json";
import { getDomain, ForwardRequest } from "./eip712";
import { time } from "@nomicfoundation/hardhat-network-helpers";

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC);
  if (!process.env.SPONSER_WALLET) throw new Error("Missing environment variable: SPONSER_WALLET");
  if (!process.env.USER_WALLET) throw new Error("Missing environment variable: USER_WALLET");

  const sponsorPrivateKey = process.env.SPONSER_WALLET.startsWith("0x")
    ? process.env.SPONSER_WALLET
    : `0x${process.env.SPONSER_WALLET}`;
  const userPrivateKey = process.env.USER_WALLET.startsWith("0x")
    ? process.env.USER_WALLET
    : `0x${process.env.USER_WALLET}`;

  const sponsor = new ethers.Wallet(sponsorPrivateKey, provider);
  const sender = new ethers.Wallet(userPrivateKey, provider);

  // Replace with your actual contract addresses
  const FORWARDER_ADDRESS = "";
  const NFT_CONTRACT_ADDRESS = "";

  // Create contract instances
  const forwarderRead = new ethers.Contract(FORWARDER_ADDRESS, forwarderAbi.abi, provider);
  const forwarderWrite = forwarderRead.connect(sponsor);
  const nftRead = new ethers.Contract(NFT_CONTRACT_ADDRESS, nftAbi.abi, provider);
  const nftWrite = nftRead.connect(sponsor);

  // Build the domain object using a contract call
  const domain = await getDomain(forwarderRead);

  // Prepare types for EIP-712
  const types = { ForwardRequest };

  async function createRequest(override: any = {}, signer = sender) {
    const fromAddr = await signer.getAddress();
    const data = nftRead.interface.encodeFunctionData("mint", [fromAddr]);
    const gas = 100000n;
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);
    const nonce = await forwarderRead.nonces(fromAddr);

    const request = {
      from: fromAddr,
      to: NFT_CONTRACT_ADDRESS,
      value: 0n,
      data,
      gas,
      deadline,
      nonce,
      ...override,
    };

    // Sign the typed data
    const signature = await signer.signTypedData(domain, types, request);
    return { ...request, signature };
  }

  console.log("Creating meta-transaction request...");
  const request = await createRequest();

  console.log("Executing meta-transaction...");
  const tx = await forwarderWrite.execute(request);
  await tx.wait();
  console.log("Transaction hash:", tx.hash);

  const balance = await nftRead.balanceOf(sender.address);
  console.log("NFT balance for sender:", balance.toString());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});