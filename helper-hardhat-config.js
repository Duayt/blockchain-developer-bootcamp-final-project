const MORALIS_API = process.env.MORALIS_API || "";

const networkConfig = {
  default: {
    name: "hardhat",
    fee: "100000000000000000",
    keyHash:
      "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
    jobId: "29fa9aa13bf1468788b7cc4a500a45b8",
    fundAmount: "1000000000000000000",
    url: "",
    forkUrl: "",
  },
  31337: {
    name: "localhost",
    fee: "100000000000000000",
    keyHash:
      "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
    jobId: "29fa9aa13bf1468788b7cc4a500a45b8",
    fundAmount: "1000000000000000000",
    url: "",
    forkUrl: "",
  },
  42: {
    name: "kovan",
    linkToken: "0xa36085F69e2889c224210F603D836748e7dC0088",
    ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
    keyHash:
      "0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4",
    vrfCoordinator: "0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9",
    oracle: "0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e",
    jobId: "29fa9aa13bf1468788b7cc4a500a45b8",
    fee: "100000000000000000",
    fundAmount: "1000000000000000000",
    url: `https://speedy-nodes-nyc.moralis.io/${MORALIS_API}/eth/kovan`,
    forkUrl: `https://speedy-nodes-nyc.moralis.io/${MORALIS_API}/eth/kovan/archive`,
    forkBlockNumber: 28577500, // mocked token was listed @28577077
  },
  4: {
    name: "rinkeby",
    linkToken: "0x01be23585060835e02b77ef475b0cc51aa1e0709",
    ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    keyHash:
      "0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311",
    vrfCoordinator: "0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B",
    oracle: "0x7AFe1118Ea78C1eae84ca8feE5C65Bc76CcF879e",
    jobId: "6d1bfe27e7034b1d87b5270556b17277",
    fee: "100000000000000000",
    fundAmount: "1000000000000000000",
    url: "",
    forkUrl: "",
  },
  1: {
    name: "mainnet",
    linkToken: "0x514910771af9ca656af840dff83e8264ecf986ca",
    fundAmount: "0",
    url: `https://speedy-nodes-nyc.moralis.io/${MORALIS_API}/eth/mainnet`,
    forkUrl: `https://speedy-nodes-nyc.moralis.io/${MORALIS_API}/eth/mainnet/archive`,
    forkBlockNumber: 13202450,
  },
  5: {
    name: "goerli",
    linkToken: "0x326c977e6efc84e512bb9c30f76e30c160ed06fb",
    fundAmount: "0",
    url: "",
    forkUrl: "",
  },
  97: {
    name: "bsctest",
    url: `https://speedy-nodes-nyc.moralis.io/${MORALIS_API}/bsc/testnet`,
    forkUrl: `https://speedy-nodes-nyc.moralis.io/${MORALIS_API}/bsc/testnet/archive`,
    forkBlockNumber: 11150656,
  },
  56: {
    name: "bsc",
    url: `https://speedy-nodes-nyc.moralis.io/${MORALIS_API}/bsc/mainnet`,
    forkUrl: `https://speedy-nodes-nyc.moralis.io/${MORALIS_API}/bsc/mainnet/archive`,
    forkBlockNumber: 9809198,
  },
};

const developmentChains = ["hardhat", "localhost"];

const tokens = {
  KOVAN: {
    DAI: "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa",
    ETH: "0xd0A1E359811322d97991E03f863a0C30C2cF029C",
    MOCK: "0xf09f34ade2d66ea69372c828454873bfa9c04556",
  },
  MAINNET: {
    DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    ETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  },
};
module.exports = Object.freeze({
  NETWORK_CONFIG: networkConfig,
  UNISWAPV3_ROUTER: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
  UNISWAPV3_QUOTER: "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6",
  TOKENS: tokens,
});
