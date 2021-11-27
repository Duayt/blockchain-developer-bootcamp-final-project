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
* Force user to buy only when the candle is red (buy the dip), and sell only major pump thredshold (green candle)
* Time lock, cannnot sell or withdraw for certain period

## **More idea** 
* Auto Dollar-Cost Averaging , keep buying weekly or monthly or at dip
* Dead man switch or Beneficiary protocol, so your hodling stash could transfer ownership in longterm.
* May be a customizable input for different tokens or scenario like, 1 year hodling etc.
* Chaotic ape trading - Buy random token just for fun!

# **Example workflow**
1. User could deposit stable coin to a contract but might not able to withdraw out within a specific period
2. The contract could may be call to check daily gains (red or green candles) [Update] move price check to frontend instead, criteria check within buy seem costly 
3. Those stable coin could only be used to buy specific token from a DEX only in  a certain dip!
4. Token position could not be sold to within certain period of time or if the green candle is not huge enough [Update] might force this on frontend instead


# **Environment variables**
API for archival node fork from https://moralis.io/

```
MORALIS_API=
MNEMONIC=
```
# **How to run this project locally:**
## **Prerequisites**
- Node.js >= v14
- Hardhat
- npm
- `git checkout main`



## **Contract**
- Run npm install in project root to install all dependency
- Update moralis api in the .env with API key
- Run testnet forking with `npx hardhat fork` 
- Run test with `npx hardhat test`
- Run local deployment with `npx hardhat deploy --network localhost`
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
- [ ] Last candle price check may be an Oracle
- [ ] Timelock
- [ ] App


# **Resouces**

* https://soliditydeveloper.com/uniswap3
* https://kovan.etherscan.io/address/0xE592427A0AEce92De3Edee1F18E0157C05861564#writeProxyContract
* 