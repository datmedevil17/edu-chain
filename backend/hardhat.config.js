require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition-ethers");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_URL, // Sepolia RPC URL
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    lineaSepolia: {
      url: process.env.LINEA_SEPOLIA_URL, // Linea Sepolia RPC URL
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    arbitrumSepolia: {
      url: process.env.ARBITRUM_SEPOLIA_URL, // Arbitrum Sepolia RPC URL
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};
