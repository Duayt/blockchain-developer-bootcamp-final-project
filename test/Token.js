//This test from a boiler template just to test mock token

const { expect } = require("chai");
const { ethers, deployments } = require("hardhat");

describe("Mock Token contract", function () {
  let Token;
  let token;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    await deployments.fixture(["token"]);
    Token = await deployments.get("MockToken");
    token = await ethers.getContractAt("MockToken", Token.address);
  });

  describe("Deployment", function () {
    it("Should able to mint some token", async function () {
      const toMint = ethers.utils.parseEther("1");
      await token.connect(owner).mint(owner.address, toMint);
      expect(await token.totalSupply()).to.eq(toMint);
      expect(await token.balanceOf(owner.address)).to.eq(toMint);
    });

    it("Should able to mint to other", async function () {
      const toMint = ethers.utils.parseEther("1");
      await token.connect(owner).mint(addr1.address, toMint);
      expect(await token.balanceOf(addr1.address)).to.eq(toMint);
    });

    it("Should failed if not owner try to mint", async function () {
      const toMint = ethers.utils.parseEther("1");
      await expect(
        token.connect(addr1).mint(addr1.address, toMint)
      ).to.be.revertedWith("Only minter can mint");
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      const toMint = ethers.utils.parseEther("1");

      // mint 1 token to addr1
      await token.connect(owner).mint(addr1.address, toMint);
      expect(await token.balanceOf(addr1.address)).to.eq(toMint);

      // addr1 transfer to addr2
      const senderInstance = token.connect(addr1);
      const toSend = ethers.utils.parseEther("0.4");
      await senderInstance.transfer(addr2.address, toSend);

      // Check balance
      expect(await token.balanceOf(addr2.address)).to.eq(toSend);
      expect(await token.balanceOf(addr1.address)).to.eq(toMint.sub(toSend));
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const toMint = ethers.utils.parseEther("10");

      // mint 10 token to addr1
      await token.connect(owner).mint(addr1.address, toMint);
      expect(await token.balanceOf(addr1.address)).to.eq(toMint);

      // addr1 transfer to addr2 11
      const senderInstance = token.connect(addr1);
      const toSend = ethers.utils.parseEther("11");

      // Notice await is on the expect
      await expect(
        senderInstance.transfer(addr2.address, toSend)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });
  });
});
