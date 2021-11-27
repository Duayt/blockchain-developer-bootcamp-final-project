const { expect } = require("chai");

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
});
