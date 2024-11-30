const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KnowledgeVaultToken", function () {
  let token, owner, user;

  beforeEach(async function () {
    const Token = await ethers.getContractFactory("KnowledgeVaultToken");
    [owner, user] = await ethers.getSigners();
    token = await Token.deploy(1000); // Initial supply of 1000 tokens
    
  });

  it("should have correct name and symbol", async function () {
    expect(await token.name()).to.equal("KnowledgeVaultToken");
    expect(await token.symbol()).to.equal("KVT");
  });

  it("should mint tokens correctly", async function () {
    await token.mint(user.address, 100);
    expect(await token.balanceOf(user.address)).to.equal(100);
  });

  it("should burn tokens correctly", async function () {
    await token.mint(user.address, 100);
    await token.connect(user).burn(user.address, 50);
    expect(await token.balanceOf(user.address)).to.equal(50);
  });

  it("should revert minting or burning by unauthorized addresses", async function () {
    await expect(token.connect(user).mint(user.address, 100)).to.be.reverted;
    await expect(token.connect(user).burn(owner.address, 100)).to.be.reverted;
  });

  it("should show the correct total supply after minting and burning", async function () {
    await token.mint(user.address, 200);
    await token.burn(user.address, 100);
    expect(await token.totalSupply()).to.equal(1100); // 1000 initial + 200 minted - 100 burned
  });
});
