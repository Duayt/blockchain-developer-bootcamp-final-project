# blockchain-developer-bootcamp-final-project

# **Hodler Service**
Goal: One day this contract will make someone a crypto millionaires in the long run....
<p float="center">
<img src="https://user-images.githubusercontent.com/28585719/135728318-f0c39a20-7720-4948-b52e-8ef7c7011ad2.png" height="200" />
<img src="https://user-images.githubusercontent.com/28585719/135728337-0f91cfd2-4ab0-4b2f-838d-6be9cee72d8d.png" height="200" />
</p>

# **Problem**
Crypto market is volatile with high intensity of fear vs greed. I think it is hard sometime to be a real Hodler - [Hold on for deal life]( https://www.investopedia.com/terms/h/hodl.asp) when there is a big crashes in the market, however those day are likely to provide the highest gain if you buy the dip. 

# **Solution**
A smart contract service to help discipline and force you to be a hodler!. the contract will be connected to an existing dex but with hodling oriented features:
* User could deposit ETH but could not withdraw before a specific set of time
* User could used the deposited eth to buy target token and it is also timelocked
* In the future, this could be update to use price oracle to force user to buy at dip or sell at the pump


# **Example workflow**
1. User could deposit eth to a contract but might not able to withdraw out within a specific period using timelock feature.
2. User could only use the deposit eth to buy a specific token only from UniswapV3 dex
3. Both ETH, and specific token could only be withdrawn after specify timelockperiod

Future: The contract could may be call to check daily gains (red or green candles)  move price check to frontend instead, criteria check within buy seem costly 

# **Environment variables**
API for archival node fork from [Moralis](https://moralis.io/)
```
MORALIS_API=
MNEMONIC=
```
# **How to run this project locally:**
## **Prerequisites**
- Node.js >= v14
- Hardhat (plugin: hardhat-deploy, hardhat-etherscan)
- npm
- `git checkout main`

## **Mocking Environment**
To test the Dex , i have deployed a mocked token on Kovan with step below
- MockToken was deployed on kovan with `npx hardhat deploy --tags token --network kovan`
- Token address `0xf09F34Ade2D66EA69372C828454873bFa9c04556`
- Token was verified with command:`npx hardhat verify --network kovan 0xf09F34Ade2D66EA69372C828454873bFa9c04556`
- Manually minted: 1,000,000 tokens
- Pool created with 0.48 ETH: 1,000,000 tokens
  - [Uniswap Web](https://app.uniswap.org/#/add/ETH/0xf09F34Ade2D66EA69372C828454873bFa9c04556/500)
  - [Liqudiity Transaction](https://kovan.etherscan.io/tx/0xc29e5ad0c1f3475a358477853050e5ebd33b69fba370f75c1fc59df66f0121cc)
  - [Pool Address](https://kovan.etherscan.io/address/0x0b3977134f3343565f569aa6d37bbb9e4680ae6f)
  - Block: 28577077, forked block for local dev 28577078
## **Contract**
- Run npm install in project root to install all dependency
- Update moralis api in the .env with API key
- Run testnet forking with `npx hardhat fork` (Forking the DEX with liquidity)
- Run test with `npx hardhat test`
- Run local deployment with `npx hardhat deploy --tags main --network localhost`
- Development network id is 31337 change it in metamask

## **Frontend**
- `cd frontend`
- `npm install`
- `npm start`
- Open `http:/localhost:3000`
    

# **TODO**
- [x] Setup project
- [ ] DEX interface eg. UNISWAP, SUSHISWAP
  - [ ] Buy function
  - [ ] Sell function
- [ ] Timelock
- [ ] App

## **More idea** 
* Price reading data in the future.
* Auto Dollar-Cost Averaging , keep buying weekly or monthly or at dip
* Dead man switch or Beneficiary protocol, so your hodling stash could transfer ownership in longterm.
* May be a customizable input for different tokens or scenario like, 1 year hodling etc.
* Chaotic ape trading - Buy random token just for fun!

# **Resouces**

* https://soliditydeveloper.com/uniswap3
* https://docs.uniswap.org/protocol/guides/swaps/single-swaps
* https://jamesbachini.com/uniswap-v3-trading-bot/
* https://docs.uniswap.org/sdk/guides/creating-a-trade