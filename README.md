# blockchain-developer-bootcamp-final-project

# **Hodler Service**
Goal: One day this contract will make someone a crypto millionaires in the long run....
<p float="center">
<img src="https://user-images.githubusercontent.com/28585719/135728318-f0c39a20-7720-4948-b52e-8ef7c7011ad2.png" height="200" />
<img src="https://user-images.githubusercontent.com/28585719/135728337-0f91cfd2-4ab0-4b2f-838d-6be9cee72d8d.png" height="200" />
</p>

## **Problem**
Crypto market is volatile with high intensity of fear vs greed. I think it is hard sometime to be a real Hodler - [Hold on for deal life]( https://www.investopedia.com/terms/h/hodl.asp) when there is a big crashes in the market, however those day are likely to provide the highest gain if you buy the dip. 

## **Solution**
A smart contract service to help discipline and force you to be a hodler!. the contract will be connected to an existing dex but with hodling oriented features:
* Force user to buy only when the candle is red (buy the dip), and sell only major pump thredshold (green candle)
* Time lock, cannnot sell or withdraw for certain period

## **More idea** 
* Auto Dollar-Cost Averaging , keep buying weekly or monthly or at dip
* Dead man switch or Beneficiary protocol, so your hodling stash could transfer ownership in longterm.
* May be a customizable input for different tokens or scenario like, 1 year hodling etc.
* Chaotic ape trading - Buy random token just for fun!

## **Example workflow**
1. User could deposit stable coin to a contract but might not able to withdraw out within a specific period
2. The contract could may be call to check daily gains (red or green candles)
3. Those stable coin could only be used to buy specific token from a DEX only it is a certain dip!
4. Token position could not be sold to within certain period of time or if the green candle is not hug enough

## **TODO**
- [ ] Setup project
- [ ] DEX interface eg. UNISWAP, SUSHISWAP
  - [ ] Buy function
  - [ ] Sell function
- [ ] Last candle price check may be an Oracle
- [ ] Timelock
- [ ] App
