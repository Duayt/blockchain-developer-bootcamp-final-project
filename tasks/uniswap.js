const SwapRouter = require("@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json");
const Pool = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const Quoter = require("@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json");

const {
  UNISWAPV3_QUOTER,
  UNISWAPV3_ROUTER,
  TOKENS,
} = require("../helper-hardhat-config");
task("dai", "fill deployer with some dai token")
  .addOptionalParam("size", "ETH size for dai", "0.001")
  .setAction(async (taskArgs, hre) => {
    console.log("fueling with DAI");
    const { deployments, getNamedAccounts, ethers } = hre;
    const { formatUnits, formatEther } = ethers.utils;
    //Get signer information
    const accounts = await hre.ethers.getSigners();
    const signer = accounts[0];
    const uniswapV3Router = await new ethers.Contract(
      UNISWAPV3_ROUTER,
      SwapRouter.abi,
      signer
    );

    console.log("----  address:  %s  ", signer.address);
    console.log(
      "----  balance:  %s eth ",
      formatEther(await ethers.provider.getBalance(signer.address))
    );
  });

task("swapMock", "swap mock token")
  .addOptionalParam("amount", "ETH size for dai", "0.01")
  .setAction(async (taskArgs, hre) => {
    console.log("fueling with DAI");
    const { deployments, getNamedAccounts, ethers } = hre;
    const { formatUnits, formatEther } = ethers.utils;
    //Get signer information
    const accounts = await hre.ethers.getSigners();
    const signer = accounts[0];
    const uniswapV3Router = await new ethers.Contract(
      UNISWAPV3_ROUTER,
      SwapRouter.abi,
      signer
    );

    const quoter = await new ethers.Contract(
      UNISWAPV3_QUOTER,
      Quoter.abi,
      signer
    );

    console.log("----  Address:  %s  ", signer.address);
    console.log(
      "----  Eth balance:  %s eth ",
      formatEther(await ethers.provider.getBalance(signer.address))
    );
    let token = await ethers.getContractAt("ERC20", TOKENS.KOVAN.MOCK);

    console.log(
      "----  Mock balance:  %s tokens ",
      formatEther(await token.balanceOf(signer.address))
    );
    const ethAmount = taskArgs.amount;
    const poolAddress = "0x0b3977134f3343565f569aa6d37bbb9e4680ae6f";
    const poolContract = new ethers.Contract(poolAddress, Pool.abi, signer);

    async function getPoolImmutables() {
      const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] =
        await Promise.all([
          poolContract.factory(),
          poolContract.token0(),
          poolContract.token1(),
          poolContract.fee(),
          poolContract.tickSpacing(),
          poolContract.maxLiquidityPerTick(),
        ]);

      const immutables = {
        factory,
        token0,
        token1,
        fee,
        tickSpacing,
        maxLiquidityPerTick,
      };
      return immutables;
    }
    async function getPoolState() {
      // note that data here can be desynced if the call executes over the span of two or more blocks.
      const [liquidity, slot] = await Promise.all([
        poolContract.liquidity(),
        poolContract.slot0(),
      ]);

      const PoolState = {
        liquidity,
        sqrtPriceX96: slot[0],
        tick: slot[1],
        observationIndex: slot[2],
        observationCardinality: slot[3],
        observationCardinalityNext: slot[4],
        feeProtocol: slot[5],
        unlocked: slot[6],
      };

      return PoolState;
    }
    const [immutables, state] = await Promise.all([
      getPoolImmutables(),
      getPoolState(),
    ]);

    console.log("---- eth amount:", ethAmount);
    const amountIn = ethers.utils.parseEther(ethAmount);

    // call the quoter contract to determine the amount out of a swap, given an amount in
    const quotedAmountOut = await quoter.callStatic.quoteExactInputSingle(
      immutables.token0,
      immutables.token1,
      immutables.fee,
      amountIn.toString(),
      0
    );
    console.log("---- token", ethers.utils.formatEther(quotedAmountOut));

    const expiryDate = Math.floor(Date.now() / 1000) + 900;
    const params = {
      tokenIn: TOKENS.KOVAN.ETH,
      tokenOut: TOKENS.KOVAN.MOCK,
      fee: 500,
      recipient: signer.address,
      deadline: expiryDate,
      amountIn: amountIn.toString(), // wei
      amountOutMinimum: quotedAmountOut,
      sqrtPriceLimitX96: 0,
    };
    const overrides = {
      value: amountIn.toString(),
    };

    let tx = await uniswapV3Router.exactInputSingle(params, overrides);

    console.log("Swapping", tx);
    console.log(
      "----  Eth balance:  %s eth ",
      formatEther(await ethers.provider.getBalance(signer.address))
    );

    console.log(
      "----  Mock balance:  %s tokens ",
      formatEther(await token.balanceOf(signer.address))
    );
  });
