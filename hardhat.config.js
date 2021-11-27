require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy");
require("dotenv").config({ path: __dirname + "/.env" });

//Load task
require("./tasks/faucet");
require("./tasks/node");

//Constant variable
const MNEMONIC =
  process.env.MNEMONIC ||
  "test test test test test test test test test test test test test ";

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
      accounts: {
        mnemonic: MNEMONIC,
      },
    },
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // mainnet
      42: 0, // kovan
    },
  },
};
