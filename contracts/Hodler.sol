// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';

interface IUniswapRouter is ISwapRouter {
    function refundETH() external payable;
}

/// @title A hodler contract for saving tokens and buying the dip
/// @author Tanawat C.
/// @notice Allow user to deposit eth, locked for long term and used to buy target token
/// @dev Token address were fixed with MockedToken deployed on Kovan testnet
contract Hodler {
 using SafeERC20 for IERC20;


address public owner;

/// @notice  This is mocked token deployed on kovan network
/// @dev Can change this when deploy to other specific token eg. WBTC on main net 
IERC20 public targetToken =IERC20(0xf09F34Ade2D66EA69372C828454873bFa9c04556);

// address private constant targetToken = 0xf09F34Ade2D66EA69372C828454873bFa9c04556;

/// @dev a Wrap ETH on Kovan network,
address private constant WETH9 = 0xd0A1E359811322d97991E03f863a0C30C2cF029C;

/// @notice Uniswap V3 router address in Kovan is the same as main net
IUniswapRouter public constant uniswapRouter = IUniswapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);


/// @notice track each user hodlerInfo such as balance, timelock, last deposit, next unlock
mapping(address=> HodlerInfo) public hodlerInfo;

/// @notice max timelock to prevent user locked their fund forever
/// @dev set to 1 year for the testing only
uint256 public constant maxLock = 365 days;

struct HodlerInfo {
    uint256 balance;
    uint256 tokenBalance;
    uint256 nextUnlock;
    uint256 lastDeposit;
}

/* 
 * Events
 */

// log deposit
event LogDepositMade(address accountAddress, uint256 amount, uint256 nextUnlock);

// log withdraw
event LogWithdrawalEth(address accountAddress, uint256 amount);

// log buy
event LogBuy(address accountAddress, uint256 amountIn,uint256 amountOut);

// log withdraw
event LogWithdrawalToken(address accountAddress, uint256 amount);

/* 
 * Modifiers
 */

// check buy balance
modifier checkBuyBalance(uint256 _amount) { 
    require(hodlerInfo[msg.sender].balance >=_amount,"Insufficient balance"); 
    _;
  }

// check timelock withdraw
modifier canWithdraw() { 
    require(hodlerInfo[msg.sender].nextUnlock <=block.timestamp,"HODLER! Can not withdraw yet!"); 
    _;
  }
// check if timelock is less than max
modifier checkMaxTimelock(uint256 _lockSecond) { 
    require(_lockSecond <=maxLock,"Lock take too long!"); 
    _;
  }



constructor(){
    owner = msg.sender;    
}

function deposit( uint256 _lockSeconds) payable public checkMaxTimelock(_lockSeconds) {
    // console.log("Hodler:===== deposit() ====");
    // console.log("value: ",msg.value);
    // console.log("_lockSeconds: ",_lockSeconds);

    HodlerInfo storage info = hodlerInfo[msg.sender];
    //check if there were previous lock (lock not stacking)
    if (info.nextUnlock <= block.timestamp){
        info.nextUnlock = block.timestamp +_lockSeconds;
    }
    info.balance+= msg.value;
    info.lastDeposit = block.timestamp;
    emit LogDepositMade(msg.sender, msg.value,info.nextUnlock);
}
function withdraw() public canWithdraw(){
    // console.log("Hodler:===== withdraw() ====");
    HodlerInfo storage info = hodlerInfo[msg.sender];
    uint256 _amount=info.balance;
    info.balance = 0;
    payable(msg.sender).transfer(_amount);
    emit LogWithdrawalEth(msg.sender,_amount);
}
function buy(uint256 _amount)  external  returns(uint256 ) {
    HodlerInfo storage info = hodlerInfo[msg.sender];

    require(info.balance>=_amount,"insufficient amount to buy");
    
    info.balance -=_amount;
    uint256 deadline = block.timestamp + 15;  /// @dev using 'now' for convenience, for mainnet pass deadline from frontend!
    address tokenIn = WETH9;
    address tokenOut = address(targetToken);
    uint24 fee = 500;
    address recipient = address(this);
    uint256 amountIn = _amount;
    uint256 amountOutMinimum = 1; /// @dev risk of front running in main net!
    uint160 sqrtPriceLimitX96 = 0;
    
    ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams(
        tokenIn,
        tokenOut,
        fee,
        recipient,
        deadline,
        amountIn,
        amountOutMinimum,
        sqrtPriceLimitX96
    );

    uint256 _amountout= uniswapRouter.exactInputSingle{value: amountIn}(params);
    info.tokenBalance +=_amountout;

    emit LogBuy(msg.sender,amountIn,_amountout);
    return _amountout;
  }
    

function withdrawToken() public canWithdraw(){
    // console.log("Hodler:===== withdraw() ====");
    HodlerInfo storage info = hodlerInfo[msg.sender];
    uint256 _amount=info.tokenBalance;
    info.tokenBalance = 0;
    targetToken.transfer(msg.sender,_amount);
    emit LogWithdrawalToken(msg.sender,_amount);
}
}
