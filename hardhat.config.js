require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy");
require("dotenv").config({ path: __dirname + "/.env" });
require("@nomiclabs/hardhat-etherscan");
//Load task
require("./tasks/faucet");
require("./tasks/node");
require("./tasks/uniswap");
require("./tasks/accounts");

const { NETWORK_CONFIG } = require("./helper-hardhat-config");

//Constant variable
const MNEMONIC =
  process.env.MNEMONIC ||
  "test test test test test test test test test test test test test ";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 900000,
          },
        },
      },
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: {
        mnemonic: MNEMONIC,
      },
    },
    kovan: {
      chainId: 42,
      accounts: {
        mnemonic: MNEMONIC,
      },
      url: NETWORK_CONFIG[42].url,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // mainnet
      42: 0, // kovan
    },
  },

  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
