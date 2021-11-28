module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  // console.log("Deploying Hodler.sol on chainId", chainId);

  const contract = await deploy("Hodler", {
    from: deployer,
    log: true,
  });
};
module.exports.tags = ["all", "hodler", "main"];
