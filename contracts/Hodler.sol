//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';

interface IUniswapRouter is ISwapRouter {
    function refundETH() external payable;
}

contract Hodler {
 using SafeERC20 for IERC20;

// <owner>
address public owner;

// // stable coin token address (USDT on ETH)
// IERC20 public  usd =IERC20(0xdAC17F958D2ee523a2206206994597C13D831ec7);
// // target token (WBTC on ETH)
// IERC20 public targetToken =IERC20(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599);

// Kovan
// // stable coin token address (USDT on ETH)
// IERC20 public  dai =IERC20(0xdAC17F958D2ee523a2206206994597C13D831ec7);
// // target token (WBTC on ETH)
// IERC20 public targetToken =IERC20(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599);


address private constant WETH9 = 0xd0A1E359811322d97991E03f863a0C30C2cF029C;

//Uniswap V3 router
 IUniswapRouter public constant uniswapRouter = IUniswapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

//<User Eth Balance>
mapping(address=> uint256) public Balance;

//<User target token Balance>
mapping(address=> uint256) public tokenBalance;

//<User token withdrawal timelock>
mapping(address=> uint256) public tokenTimeLock;

//<pump threadshold for selling in percent*100>
mapping(address=> uint256) public pumpTarget;

//<dump threadshold for buying in percent*100>
mapping(address=> uint256) public dumpTarget; // buy da dip!


/* 
 * Events
 */

// log deposit
// log buy
// log withdraw



/* 
 * Modifiers
 */

// check balance
// check timelock withdraw
// check buy condition
// check buy price with balance
// check sell condition



constructor(){
    owner = msg.sender;    
}


// deposit usd tokens

function deposit(uint256 _amount) view public {
    // deposit usd tokens
    console.log("Hodler:===== deposit() ====");
    console.log("arg: ",_amount);
}

function buy(uint256 _amount) view public {
    // buy target token with _amount of usd
    console.log("Hodler:===== buy() ====");
    console.log("arg: ",_amount);
    
}


function sell(uint256 _targetAmount) view public {
    // sell target token amount
    console.log("Hodler:===== sell() ====");
    console.log("arg: ",_targetAmount);

}


function withdrawUsd(uint256 _amount) view public {
    // withdraw the deposited usd tokens
    console.log("Hodler:===== withdraw() ====");
    console.log("arg: ",_amount);

}


function withdrawTarget(uint256 _targetAmount) view public {
    // withdraw the target tokens
    console.log("Hodler:===== withdrawTarget() ====");
    console.log("arg: ",_targetAmount);

}

function checkLastCandle() view public{
    // check token yesterday price (candle) if red or green
    console.log("Hodler:===== checkLastCandle() ====");

}

// function getEstimatedETHforDAI(uint daiAmount) external payable returns (uint256) {
//     address tokenIn = WETH9;
//     address tokenOut = multiDaiKovan;
//     uint24 fee = 3000;
//     uint160 sqrtPriceLimitX96 = 0;

//     return quoter.quoteExactOutputSingle(
//         tokenIn,
//         tokenOut,
//         fee,
//         daiAmount,
//         sqrtPriceLimitX96
//     );
//   }

}
