// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("nftMetaTxModule", (m) => {

  const nft = m.contract("MetaTxNFT", ["FORWARDER_CONTRACT_ADDRESS", "MYNft","NFT_CONTRACT_OWNER"]);

  return { nft };
});
