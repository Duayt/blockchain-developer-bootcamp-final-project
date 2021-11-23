const { expect } = require("chai");

describe("Hodler contract", function () {
  let Hodler;

  beforeEach(async function () {
    Hodler = await ethers.getContractFactory("Hodler");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    hodlerContract = await Hodler.deploy();
    await hodlerContract.deployed();

    await hodlerContract.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await hodlerContract.owner()).to.equal(owner.address);
    });
  });
});
