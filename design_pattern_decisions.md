# Design pattern decisions

## Inter-Contract Execution 
-  `ISwapRouter` interface was imported from uniswapv3 for inter contract execution to the Dex on kovan testnet

## Inheritance and Interfaces 
- SafeERC20 was used from Openzeppelin to ensure token transfer is within the standard also MockToken.sol was inherit from `ERC20` Openzeppelin plugin

# Access Control Design Patterns

- `AccessControl` was used to control minting role in the MockToken
