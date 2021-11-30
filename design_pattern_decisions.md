# Design pattern decisions

## Inter-Contract Execution 
-  `ISwapRouter` interface was imported from uniswapv3 for inter contract execution to the Dex on kovan testnet

## Inheritance and Interfaces 
- SafeERC20 was used from Openzeppelin to ensure token transfer is within the standard
- MockToken.sol was inherit from `ERC20` Openzeppelin plugin to align with the standard
- `Ownable` was interited to `Hodler` contract so only owner could change the token addresss

# Access Control Design Patterns

- `AccessControl` was used to control minting role in the MockToken
