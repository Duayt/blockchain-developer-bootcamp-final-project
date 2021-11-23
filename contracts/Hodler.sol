//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
contract Hodler {
 using SafeERC20 for IERC20;

// <owner>
address public owner;

// stable coin token address (USDT on ETH)
IERC20 public  usd =IERC20(0xdAC17F958D2ee523a2206206994597C13D831ec7);
// target token (WBTC on ETH)
IERC20 public targetToken =IERC20(0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599);

//<User USD Balance>
mapping(address=> uint256) public usdBalance;

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

function deposit(uint256 _amount) public {
    // deposit usd tokens
}

function buy(uint256 _amount) public {
    // buy target token with _amount of usd
}


function sell(uint256 _targetAmount) public {
    // sell target token amount
}


function withdrawUsd(uint256 _amount) public {
    // withdraw the deposited usd tokens
}


function withdrawTarget(uint256 _targetAmount) public {
    // withdraw the target tokens
}

function checkLastCandle() public{
    // check token yesterday price (candle) if red or green
}



}
