const { NETWORK_CONFIG } = require("../helper-hardhat-config");

task("fork", "Forking mainnet nodes")
  .addOptionalParam("chain", "The chainId", "42") //kovan
  .addOptionalParam("block", "The block number to fork from", undefined)
  .addOptionalParam("url", "The url to fork from", undefined)
  .setAction(async (taskArgs, hre) => {
    const chainId = taskArgs.chain;
    console.log("forking", NETWORK_CONFIG[chainId], chainId);
    const url = taskArgs.url || NETWORK_CONFIG[chainId].forkUrl;
    const blockNumber =
      taskArgs.block || NETWORK_CONFIG[chainId].forkBlockNumber;
    console.log("forking from ", url, blockNumber);

    await hre.run("node", {
      fork: url,
      forkBlockNumber: blockNumber,
      noDeploy: true,
    });
  });
