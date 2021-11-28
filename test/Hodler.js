const { expect } = require("chai");
const { ethers } = require("hardhat");
const { NETWORK_CONFIG, TOKENS } = require("../helper-hardhat-config");

const resetNetwork = async () => {
  console.log("forking network");
  await network.provider.request({
    method: "hardhat_reset",
    params: [
      {
        forking: {
          jsonRpcUrl: NETWORK_CONFIG[42].forkUrl,
          blockNumber: NETWORK_CONFIG[42].forkBlockNumber,
        },
      },
    ],
  });
};

const getBlockTimestamp = async (_blockNumber) =>
  (await ethers.provider.getBlock(_blockNumber)).timestamp;

describe("Hodler contract", function () {
  let Hodler;
  let hodler;
  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    await deployments.fixture(["hodler"]);
    Hodler = await deployments.get("Hodler");
    hodler = await ethers.getContractAt("Hodler", Hodler.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await hodler.owner()).to.equal(owner.address);
    });
  });

  describe("Deposit", function () {
    it("Should able to call deposit", async function () {
      const lockSecond = 5;
      const deposit = 1;
      await hodler.connect(owner).deposit(lockSecond, { value: deposit });
    });
    it("Should revert if locksecond too large", async function () {
      const lockSecond = "999999999999999999";
      const deposit = 1;

      await expect(
        hodler.connect(owner).deposit(lockSecond, { value: deposit })
      ).to.be.revertedWith("Lock take too long!");
    });
    it("Should emit correct log event", async function () {
      const lockSecond = 5;
      const deposit = 1;

      const tx = await hodler
        .connect(owner)
        .deposit(lockSecond, { value: deposit });
      await expect(tx)
        .to.emit(hodler, "LogDepositMade")
        .withArgs(
          owner.address,
          deposit,
          (await getBlockTimestamp(tx.blockNumber)) + lockSecond
        );
    });

    it("Should able to deposit eth and update balance and info", async function () {
      const lockSecond = 5;
      const deposit = 1;
      const initialAmount = await ethers.provider.getBalance(hodler.address);
      const tx = await hodler
        .connect(owner)
        .deposit(lockSecond, { value: deposit });
      const afterAmount = await ethers.provider.getBalance(hodler.address);

      // contract should gain eth
      expect(afterAmount.sub(initialAmount)).to.equal(deposit);

      // info should correct
      const info = await hodler.hodlerInfo(owner.address);
      expect(info.balance).to.equal(deposit);
      expect(info.tokenBalance).to.equal(0);
      expect(info.nextUnlock).to.equal(
        (await getBlockTimestamp(tx.blockNumber)) + lockSecond
      );
      expect(info.lastDeposit).to.equal(
        await getBlockTimestamp(tx.blockNumber)
      );
    });
    it("Should able to call deposit multiple time and not update next unlock", async function () {
      const lockSecond = 5;
      const deposit = 1;
      const tx = await hodler
        .connect(owner)
        .deposit(lockSecond, { value: deposit });
      const info = await hodler.hodlerInfo(owner.address);
      const initialNextUnlock = info.nextUnlock;

      const tx2 = await hodler
        .connect(owner)
        .deposit(lockSecond, { value: deposit });
      const info2 = await hodler.hodlerInfo(owner.address);

      expect(initialNextUnlock).to.eq(info2.nextUnlock);
    });
  });

  describe("Withdraw", function () {
    let lockSecond = 5;
    let deposit = 1;
    let txDeposit;
    beforeEach(async function () {
      txDeposit = await hodler
        .connect(owner)
        .deposit(lockSecond, { value: deposit });
    });
    it("Should able to call withdraw after time passed the lock", async function () {
      await network.provider.send("evm_increaseTime", [10]);
      await network.provider.send("evm_mine");

      await hodler.connect(owner).withdraw();
    });

    it("Should withdraw with should clear the balance, update balance", async function () {
      await network.provider.send("evm_increaseTime", [10]);
      await network.provider.send("evm_mine");
      const beforeAmount = await ethers.provider.getBalance(hodler.address);

      await hodler.connect(owner).withdraw();
      const afterAmount = await ethers.provider.getBalance(hodler.address);

      expect(beforeAmount.sub(afterAmount)).to.equal(deposit);
      const info = await hodler.hodlerInfo(owner.address);
      expect(info.balance).to.eq(0);
      expect(info.tokenBalance).to.equal(0);
      expect(info.nextUnlock).to.equal(
        (await getBlockTimestamp(txDeposit.blockNumber)) + lockSecond
      );
      expect(info.lastDeposit).to.equal(
        await getBlockTimestamp(txDeposit.blockNumber)
      );
    });

    it("Should failed if not passed the unlocked time", async function () {
      await network.provider.send("evm_increaseTime", [2]);
      await network.provider.send("evm_mine");

      await expect(hodler.connect(owner).withdraw()).to.be.revertedWith(
        "HODLER! Can not withdraw yet!"
      );
    });
  });

  describe.only("Buy", function () {
    let lockSecond = 5;
    let deposit = ethers.utils.parseEther("0.5");
    let buyAmount = ethers.utils.parseEther("0.001");
    let txDeposit;
    let mockToken;
    beforeEach(async function () {
      await resetNetwork(); // required to forked mainnet
      await deployments.fixture(["hodler"]);
      Hodler = await deployments.get("Hodler");
      hodler = await ethers.getContractAt("Hodler", Hodler.address);
      mockToken = await ethers.getContractAt("MockToken", TOKENS.KOVAN.MOCK);

      txDeposit = await hodler
        .connect(owner)
        .deposit(lockSecond, { value: deposit });
    });
    it("Should able to execute buy function", async function () {
      // const infoBefore = await hodler.hodlerInfo(owner.address);
      // const ownerBalance = await ethers.provider.getBalance(owner.address);
      // console.log(ownerBalance.toString());
      await hodler.connect(owner).buy(buyAmount);
      // await hodler.connect(owner).buy(buyAmount);
    });

    // it("Should able to buy target token and increase balance", async function () {
    //   const infoBefore = await hodler.hodlerInfo(owner.address);
    //   await hodler.connect(owner).buy(buyAmount);
    //   // const infoAfter = await hodler.hodlerInfo(owner.address);

    //   // expect balance in the hodler is reduce
    //   // expect(infoBefore.balance.sub(infoAfter.balance)).to.eq(buyAmount);
    // });
  });
});

describe("test forking", function () {
  resetNetwork();
  it("Should reset block to 28577500", async function () {
    const [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    let currentBlock = await ethers.provider.getBlockNumber();
    expect(currentBlock).to.equal(28577500);
    console.log((await ethers.provider.getBalance(owner.address)).toString());
  });
});
