import React from "react";

// We'll use ethers to interact with the Ethereum network and our contract
import { ethers } from "ethers";

// We import the contract's artifacts and address here, as we are going to be
// using them with ethers
import TokenArtifact from "../contracts/MockToken.json";
import ContractArtifact from "../contracts/Hodler.json";

// import kovanContractAddress from "../contracts/kovan-addresses.json";
// import localContractAddress from "../contracts/local-addresses.json";
// All the logic of this dapp is contained in the Dapp component.
// These other components are just presentational ones: they don't have any
// logic. They just render HTML.
import { NoWalletDetected } from "./NoWalletDetected";
import { ConnectWallet } from "./ConnectWallet";
import { Loading } from "./Loading";
// import { Transfer } from "./Transfer";
import { Deposit } from "./Deposit";
import { Withdraw } from "./Withdraw";
import { Buy } from "./Buy";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { SuccessTransactionMessage } from "./SuccessTransactionMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";
// import { NoTokensMessage } from "./NoTokensMessage";
import { formatEther, parseEther } from "ethers/lib/utils";
// This is the Hardhat Network id, you might change it in the hardhat.config.js
// Here's a list of network ids https://docs.metamask.io/guide/ethereum-provider.html#properties
// to use when deploying to other networks.
// const HARDHAT_NETWORK_ID = '31337';

console.log("Chain id:", process.env.REACT_APP_CHAINID);
const HARDHAT_NETWORK_ID = process.env.REACT_APP_CHAINID || "1337";

let contractAddress;
// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

if (HARDHAT_NETWORK_ID === "1337") {
  contractAddress = {
    MockToken: "0xf09f34ade2d66ea69372c828454873bfa9c04556",
    Hodler: "0x18dFdAa3cf69174b3EcE77D5e3Fd8872f4eB5d9C",
  };
} else {
  // KOVAN TEST NET
  contractAddress = {
    MockToken: "0xf09f34ade2d66ea69372c828454873bfa9c04556",
    Hodler: "0x745fcF84c830734BD80b8C21F6eF22736a07BA89",
  };
}

function formatEtherFixed(balance, decimals) {
  let res = formatEther(balance);
  res = (+res).toFixed(decimals);
  return res;
}
// This component is in charge of doing these things:
//   1. It connects to the user's wallet
//   2. Initializes ethers and the Token contract
//   3. Polls the user balance to keep it updated.
//   4. Transfers tokens by sending transactions
//   5. Renders the whole application
//
// Note that (3) and (4) are specific of this sample application, but they show
// you how to keep your Dapp and contract's state in sync,  and how to send a
// transaction.
export class Dapp extends React.Component {
  constructor(props) {
    super(props);

    // We store multiple things in Dapp's state.
    // You don't need to follow this pattern, but it's an useful example.
    this.initialState = {
      // The info of the token (i.e. It's Name and symbol)
      tokenData: undefined,
      // The user's address and balance
      selectedAddress: undefined,
      tokenBalance: undefined,
      ethBalance: undefined,

      // The Hodler contract data
      hodlerData: undefined,
      hodlerInfo: undefined,
      // The ID about transactions being sent, and any possible error with them
      txBeingSent: undefined,
      txSucceed: undefined,
      txIsSuccess: undefined,
      transactionError: undefined,
      networkError: undefined,
      timestamp: undefined,
      isLocked: undefined,
    };

    this.state = this.initialState;
  }

  render() {
    // Ethereum wallets inject the window.ethereum object. If it hasn't been
    // injected, we instruct the user to install MetaMask.
    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }

    // The next thing we need to do, is to ask the user to connect their wallet.
    // When the wallet gets connected, we are going to save the users's address
    // in the component's state. So, if it hasn't been saved yet, we have
    // to show the ConnectWallet component.
    //
    // Note that we pass it a callback that is going to be called when the user
    // clicks a button. This callback just calls the _connectWallet method.
    if (!this.state.selectedAddress) {
      return (
        <ConnectWallet
          connectWallet={() => this._connectWallet()}
          networkError={this.state.networkError}
          dismiss={() => this._dismissNetworkError()}
        />
      );
    }

    // If the token data or the user's balance hasn't loaded yet, we show
    // a loading component.
    if (
      !this.state.tokenData ||
      !this.state.ethBalance ||
      !this.state.hodlerData
    ) {
      return <Loading />;
    }

    // If everything is loaded, we render the application.
    return (
      <div className="container p-4">
        <div className="row">
          <div className="col-12">
            <h1>Welcome to the Hodler service!</h1>
            <p float="center">
              <img
                src="https://user-images.githubusercontent.com/28585719/135728318-f0c39a20-7720-4948-b52e-8ef7c7011ad2.png"
                height="200"
                alt="Just hodl it"
              />
              <img
                src="https://user-images.githubusercontent.com/28585719/135728337-0f91cfd2-4ab0-4b2f-838d-6be9cee72d8d.png"
                height="200"
                alt="CZ you wont be rich if you dont hodl"
              />
            </p>

            <hr />
            <h3>
              Wallet info: <b>{this.state.selectedAddress}</b>
            </h3>
            <p>
              <b>Eth balance:</b> {formatEtherFixed(this.state.ethBalance, 3)}
            </p>
            <p>
              <b>{this.state.tokenData.symbol}:</b>
              {formatEtherFixed(this.state.tokenBalance, 2)}
              <br />({this.state.tokenData.address})
            </p>
            <p>
              <b>Hodler contract info:</b>
              <br />
              address: {this.state.hodlerData.address}
              <br />
              target token: {this.state.hodlerData.targetTokenAddress}
              <br />
              router address: {this.state.hodlerData.routerAddress}
            </p>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col-12">
            {/* 
              Sending a transaction isn't an immidiate action. You have to wait
              for it to be mined.
              If we are waiting for one, we show a message here.
            */}
            {this.state.txBeingSent && (
              <WaitingForTransactionMessage txHash={this.state.txBeingSent} />
            )}

            {/* 
              Sending a transaction can fail in multiple ways. 
              If that happened, we show a message here.
            */}
            {this.state.transactionError && (
              <TransactionErrorMessage
                message={this._getRpcErrorMessage(this.state.transactionError)}
                dismiss={() => this._dismissTransactionError()}
              />
            )}
            {this.state.txIsSuccess && (
              <SuccessTransactionMessage
                message={"Success:" + this.state.txSucceed.transactionHash}
                dismiss={() => this._dismissSuccessTransaction()}
              />
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div>
              {/* showing info */}
              <h4>Hodler Info</h4>
              <p>
                Deposited balance:{" "}
                {formatEtherFixed(this.state.hodlerInfo.balance, 2)}
                <br />
                Target token balance:{" "}
                {formatEtherFixed(this.state.hodlerInfo.tokenBalance, 2)}
                <br />
                Last deposited:{" "}
                {this.state.hodlerInfo.lastDeposit.toString() === "0"
                  ? "Have not deposited yet"
                  : this.state.hodlerInfo.lastDeposit.toString()}
                <br />
                Wen Withdraw?:{" "}
                {this.state.hodlerInfo.nextUnlock.toString() === "0"
                  ? "Have not deposited yet"
                  : this.state.hodlerInfo.nextUnlock.toString()}
                <br />
                Now: {this.state.timestamp}
              </p>

              <hr></hr>
              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <Deposit
                  deposit={(to, locktime) => this._deposit(to, locktime)}
                />
                <Buy buy={(amount) => this._buy(amount)} />
                <div>
                  <Withdraw
                    buttonMessage={"Withdraw Eth"}
                    withdraw={() => this._withdrawEth()}
                    disabled={this.state.isLocked}
                  />
                  <br></br>
                  <Withdraw
                    buttonMessage={"Withdraw " + this.state.tokenData.symbol}
                    withdraw={() => this._withdrawToken()}
                    disabled={this.state.isLocked}
                  />
                </div>
              </div>
              <hr></hr>
              <p>
                This project is for blockchain-developer-bootcamp-final-project
                {"   "}
                <a href="https://github.com/Duayt/blockchain-developer-bootcamp-final-project">
                  Github
                </a>
              </p>
              <span>
                Author:{" "}
                <a href="https://www.linkedin.com/in/tanawat-chiewhawan/">
                  Tanawat Chiewhawan
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    // We poll the user's balance, so we have to stop doing that when Dapp
    // gets unmounted
    this._stopPollingData();
  }

  getDate = () => {
    var timestamp = Math.round(new Date().getTime() / 1000);
    this.setState({ timestamp });
  };
  async _connectWallet() {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = await window.ethereum.enable();

    // Once we have the address, we can initialize the application.

    // First we check the network
    if (!this._checkNetwork()) {
      return;
    }

    this._initialize(selectedAddress);

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      this._stopPollingData();
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state
      if (newAddress === undefined) {
        return this._resetState();
      }

      this._initialize(newAddress);
    });

    // We reset the dapp state if the network is changed
    window.ethereum.on("networkChanged", ([networkId]) => {
      this._stopPollingData();
      this._resetState();
    });
  }

  _initialize(userAddress) {
    // This method initializes the dapp

    // We first store the user's address in the component's state
    this.setState({
      selectedAddress: userAddress,
    });

    // Then, we initialize ethers, fetch the token's data, and start polling
    // for the user's balance.

    // Fetching the token data and the user's balance are specific to this
    // sample project, but you can reuse the same initialization pattern.
    this._intializeEthers();
    this._getTokenData();
    this._getContractData();
    this._startPollingData();
  }

  async _intializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    // When, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
    this._token = new ethers.Contract(
      contractAddress.MockToken,
      TokenArtifact.abi,
      this._provider.getSigner(0)
    );

    this._contract = new ethers.Contract(
      contractAddress.Hodler,
      ContractArtifact.abi,
      this._provider.getSigner(0)
    );
  }

  // The next two methods are needed to start and stop polling data. While
  // the data being polled here is specific to this example, you can use this
  // pattern to read any data from your contracts.
  //
  // Note that if you don't need it to update in near real time, you probably
  // don't need to poll it. If that's the case, you can just fetch it when you
  // initialize the app, as we do with the token data.
  _startPollingData() {
    this._pollDataInterval = setInterval(() => this._updateBalance(), 1000);

    // We run it once immediately so we don't have to wait for it
    this._updateBalance();
  }

  _stopPollingData() {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }

  // The next two methods just read from the contract and store the results
  // in the component state.
  async _getTokenData() {
    const name = await this._token.name();
    const symbol = await this._token.symbol();
    const address = await this._token.address;

    this.setState({ tokenData: { name, symbol, address } });
  }

  // Get hodler contract data
  async _getContractData() {
    const targetTokenAddress = await this._contract.targetToken();
    const routerAddress = await this._contract.uniswapRouter();
    const address = await this._contract.address;
    this.setState({
      hodlerData: { routerAddress, targetTokenAddress, address },
    });
  }

  async _updateBalance() {
    const tokenBalance = await this._token.balanceOf(
      this.state.selectedAddress
    );
    const ethBalance = await this._provider.getBalance(
      this.state.selectedAddress
    );
    const hodlerInfo = await this._contract.hodlerInfo(
      this.state.selectedAddress
    );

    this.getDate();
    // console.log(this.state.timestamp)
    // console.log(hodlerInfo.nextUnlock.toNumber())
    // console.log(await (await this._provider.getBlock(await this._provider.getBlockNumber())).timestamp)

    const isLocked = this.state.timestamp < hodlerInfo.nextUnlock.toNumber();
    // console.log(isLocked);
    this.setState({ tokenBalance, ethBalance, hodlerInfo, isLocked });
  }

  // This method sends an ethereum transaction to transfer tokens.
  // While this action is specific to this application, it illustrates how to
  // send a transaction.
  async _transferTokens(to, amount) {
    // Sending a transaction is a complex operation:
    //   - The user can reject it
    //   - It can fail before reaching the ethereum network (i.e. if the user
    //     doesn't have ETH for paying for the tx's gas)
    //   - It has to be mined, so it isn't immediately confirmed.
    //     Note that some testing networks, like Hardhat Network, do mine
    //     transactions immediately, but your dapp should be prepared for
    //     other networks.
    //   - It can fail once mined.
    //
    // This method handles all of those things, so keep reading to learn how to
    // do it.

    try {
      // If a transaction fails, we save that error in the component's state.
      // We only save one such error, so before sending a second transaction, we
      // clear it.
      this._dismissTransactionError();

      // We send the transaction, and save its hash in the Dapp's state. This
      // way we can indicate that we are waiting for it to be mined.
      const tx = await this._token.transfer(to, parseEther(amount.toString()));
      this.setState({
        txBeingSent: tx.hash,
        txIsSuccess: undefined,
      });

      // We use .wait() to wait for the transaction to be mined. This method
      // returns the transaction's receipt.
      const receipt = await tx.wait();

      // The receipt, contains a status flag, which is 0 to indicate an error.
      if (receipt.status === 0) {
        // We can't know the exact error that made the transaction fail when it
        // was mined, so we throw this generic one.
        throw new Error("Transaction failed");
      } else {
        this.setState({ txIsSuccess: true, txSucceed: receipt });
      }

      // If we got here, the transaction was successful, so you may want to
      // update your state. Here, we update the user's balance.
      await this._updateBalance();
    } catch (error) {
      // We check the error code to see if this error was produced because the
      // user rejected a tx. If that's the case, we do nothing.
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      // Other errors are logged and stored in the Dapp's state. This is used to
      // show them to the user, and for debugging.
      console.error(error);
      this.setState({ txIsSuccess: false, transactionError: error });
    } finally {
      // If we leave the try/catch, we aren't sending a tx anymore, so we clear
      // this part of the state.
      this.setState({ txBeingSent: undefined });
    }
  }

  // Deposit
  async _deposit(amount, locktime) {
    try {
      this._dismissTransactionError();

      const tx = await this._contract.deposit(locktime, {
        value: parseEther(amount.toString()),
      });
      this.setState({
        txBeingSent: tx.hash,
        txIsSuccess: undefined,
      });
      const receipt = await tx.wait();
      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      } else {
        this.setState({ txIsSuccess: true, txSucceed: receipt });
      }
      await this._updateBalance();
    } catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }
      console.error(error);
      this.setState({ txIsSuccess: false, transactionError: error });
    } finally {
      this.setState({ txBeingSent: undefined });
    }
  }
  // Buy function
  async _buy(amount) {
    try {
      this._dismissTransactionError();

      const tx = await this._contract.buy(parseEther(amount.toString()));
      this.setState({
        txBeingSent: tx.hash,
        txIsSuccess: undefined,
      });
      const receipt = await tx.wait();
      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      } else {
        this.setState({ txIsSuccess: true, txSucceed: receipt });
      }
      await this._updateBalance();
    } catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }
      console.error(error);
      this.setState({ txIsSuccess: false, transactionError: error });
    } finally {
      this.setState({ txBeingSent: undefined });
    }
  }
  // WithdrawEth
  async _withdrawEth() {
    try {
      this._dismissTransactionError();

      const tx = await this._contract.withdraw();
      this.setState({
        txBeingSent: tx.hash,
        txIsSuccess: undefined,
      });
      const receipt = await tx.wait();
      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      } else {
        this.setState({ txIsSuccess: true, txSucceed: receipt });
      }
      await this._updateBalance();
    } catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }
      console.error(error);
      this.setState({ txIsSuccess: false, transactionError: error });
    } finally {
      this.setState({ txBeingSent: undefined });
    }
  }

  // Withdrawtoken
  async _withdrawToken() {
    try {
      this._dismissTransactionError();

      const tx = await this._contract.withdrawToken();
      this.setState({
        txBeingSent: tx.hash,
        txIsSuccess: undefined,
      });
      const receipt = await tx.wait();
      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      } else {
        this.setState({ txIsSuccess: true, txSucceed: receipt });
      }
      await this._updateBalance();
    } catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }
      console.error(error);
      this.setState({ txIsSuccess: false, transactionError: error });
    } finally {
      this.setState({ txBeingSent: undefined });
    }
  }

  // This method just clears part of the state.
  _dismissTransactionError() {
    this.setState({ transactionError: undefined });
  }

  // this method clear success tx
  _dismissSuccessTransaction() {
    this.setState({ txIsSuccess: undefined });
  }
  // This method just clears part of the state.
  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  // This is an utility method that turns an RPC error into a human readable
  // message.
  _getRpcErrorMessage(error) {
    if (error.data) {
      return error.data.message;
    }

    return error.message;
  }

  // This method resets the state
  _resetState() {
    this.setState(this.initialState);
  }

  // This method checks if Metamask selected network is Localhost:8545
  _checkNetwork() {
    if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
      return true;
    }
    if (HARDHAT_NETWORK_ID === "1337") {
      this.setState({
        networkError: "Please connect Metamask to Localhost:8545",
      });
    } else {
      this.setState({
        networkError: "Please connect Metamask to Kovan test net",
      });
    }
    return false;
  }
}
