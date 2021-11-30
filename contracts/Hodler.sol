// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';

interface IUniswapRouter is ISwapRouter {
    function refundETH() external payable;
}

/// @title A hodler contract for saving tokens and buying the dip, for testnet only!!! there are risk of front running
/// @author Tanawat C.
/// @notice Allow user to deposit eth, locked for long term and used to buy target token
/// @dev Token address were fixed with MockedToken deployed on Kovan testnet
contract Hodler {
 using SafeERC20 for IERC20;


address public owner;

/// @notice  This is mocked token deployed on kovan network
/// @dev Can change this when deploy to other specific token eg. WBTC on main net 
IERC20 public targetToken =IERC20(0xf09F34Ade2D66EA69372C828454873bFa9c04556);

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

///@notice Emitted when user deposit eth with specified lock time
///@param accountAddress user address who made the deposit
///@param amount amount of ETH user have deposited
///@param nextUnlock timestamp for the next unlock that user could withdraw tokens and eth
event LogDepositMade(address indexed accountAddress, uint256 amount, uint256 nextUnlock);

///@notice Emitted when user made eth withdrawal
///@param amount amount of ETH user have withdrawn
event LogWithdrawalEth(address indexed accountAddress, uint256 amount);

///@notice Emitted when user call buy function to utilize ETH to buy the target token
///@param accountAddress user address who made the buy call
///@param amountIn amount of ETH user have specified to buy the target token
///@param amountOut the amount of token bought from DEX using amountIn ETH
event LogBuy(address indexed accountAddress, uint256 amountIn,uint256 amountOut);

///@notice Emitted when user made token withdrawal
///@param amount amount of token user have withdrawn
event LogWithdrawalToken(address indexed accountAddress, uint256 amount);

/* 
 * Modifiers
 */

///@dev this used to check if user have sufficient ETH deposited before buying
///@param _amount amount eth to check before buying
modifier checkBuyBalance(uint256 _amount) { 
    require(hodlerInfo[msg.sender].balance >=_amount,"Insufficient balance"); 
    _;
  }

///@dev Time lock checker if user could withdraw
modifier canWithdraw() { 
    require(hodlerInfo[msg.sender].nextUnlock <=block.timestamp,"HODLER! Can not withdraw yet!"); 
    _;
  }

///@dev Time lock checker if user provide too much second (1 year)
modifier checkMaxTimelock(uint256 _lockSecond) { 
    require(_lockSecond <=maxLock,"Lock take too long!"); 
    _;
  }



constructor(){
    owner = msg.sender;    
}

///@notice Deposit ETH into the contract and specify timelock for ETH and target token
///@param _lockSeconds number of second to locked the ETH and tokens, starting from the deposited block timestamp
function deposit( uint256 _lockSeconds) payable public checkMaxTimelock(_lockSeconds) {

    HodlerInfo storage info = hodlerInfo[msg.sender];
    //check if there were previous lock (lock not stacking)
    if (info.nextUnlock <= block.timestamp){
        info.nextUnlock = block.timestamp +_lockSeconds;
    }
    info.balance+= msg.value;
    info.lastDeposit = block.timestamp;
    emit LogDepositMade(msg.sender, msg.value,info.nextUnlock);
}

///@notice Withdraw all ETH deposit, but only if time lock allowed
///@dev can modified to take the params amount so user dont have to withdrawn all
function withdraw() public canWithdraw(){

    HodlerInfo storage info = hodlerInfo[msg.sender];
    uint256 _amount=info.balance;
    info.balance = 0;
    payable(msg.sender).transfer(_amount);
    emit LogWithdrawalEth(msg.sender,_amount);
}

///@notice Swap fixed amount of ETH with target token from Uniswap V3
///@param _amount the amount of ETH in wei user wanted to use it to buy token
///@dev can modified to take the params amount so user dont have to withdrawn all
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
    
///@notice Withdraw all Token deposit, but only if time lock allowed
///@dev can modified to take the params amount so user dont have to withdrawn all
function withdrawToken() public canWithdraw(){
    HodlerInfo storage info = hodlerInfo[msg.sender];
    uint256 _amount=info.tokenBalance;
    info.tokenBalance = 0;
    targetToken.transfer(msg.sender,_amount);
    emit LogWithdrawalToken(msg.sender,_amount);
}
}
