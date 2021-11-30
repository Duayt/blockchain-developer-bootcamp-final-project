module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();
  // console.log("Deploying on chainId", chainId);

  const token = await deploy("MockToken", {
    from: deployer,
    log: true,
  });
};
module.exports.tags = ["all", "mocks", "token"];
