const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KnowledgeVault", function () {
  let KnowledgeVault;
  let KnowledgeVaultToken;
  let knowledgeVault;
  let knowledgeVaultToken;
  let admin;
  let user;
  let otherUser;

  beforeEach(async function () {
    [admin, user, otherUser] = await ethers.getSigners();

    // Deploy the KnowledgeVaultToken contract
    const KnowledgeVaultTokenFactory = await ethers.getContractFactory("KnowledgeVaultToken");
    knowledgeVaultToken = await KnowledgeVaultTokenFactory.deploy();
    await knowledgeVaultToken.deployed();

    // Deploy the KnowledgeVault contract
    KnowledgeVault = await ethers.getContractFactory("KnowledgeVault");
    knowledgeVault = await KnowledgeVault.deploy(knowledgeVaultToken.address);
    
  });

  describe("Resource Submission", function () {
    it("should allow a user to submit a resource", async function () {
      const title = "Sample eBook";
      const url = "https://example.com/ebook";
      const description = "This is a test eBook resource.";
      const tags = ["test", "ebook"];
      const category = 0; // ResourceCategory.EBOOK

      await expect(
        knowledgeVault.connect(user).submitResource(title, url, description, tags, category)
      ).to.emit(knowledgeVault, "ResourceSubmitted");

      const resource = await knowledgeVault.resources(1);
      expect(resource.title).to.equal(title);
      expect(resource.url).to.equal(url);
      expect(resource.description).to.equal(description);
      expect(resource.category).to.equal(category);
      expect(resource.contributor).to.equal(user.address);
      expect(resource.upvotes).to.equal(0);
      expect(resource.downvotes).to.equal(0);
      expect(resource.approved).to.equal(false);
    });

    it("should mint an NFT for the resource", async function () {
      const title = "Sample Video";
      const url = "https://example.com/video";
      const description = "This is a test video resource.";
      const tags = ["test", "video"];
      const category = 1; // ResourceCategory.VIDEO

      await knowledgeVault.connect(user).submitResource(title, url, description, tags, category);

      const tokenId = 1;
      const owner = await knowledgeVault.ownerOf(tokenId);
      expect(owner).to.equal(user.address);
    });
  });

  describe("Resource Approval", function () {
    it("should allow admin to approve a resource", async function () {
      const title = "Test Podcast";
      const url = "https://example.com/podcast";
      const description = "This is a test podcast.";
      const tags = ["test", "podcast"];
      const category = 2; // ResourceCategory.PODCAST

      await knowledgeVault.connect(user).submitResource(title, url, description, tags, category);

      // Approve the resource
      await expect(knowledgeVault.connect(admin).approveResource(1, true))
        .to.emit(knowledgeVault, "ResourceApproved")
        .withArgs(1, true);

      const resource = await knowledgeVault.resources(1);
      expect(resource.approved).to.equal(true);
    });

    it("should not allow non-admin to approve a resource", async function () {
      const title = "Test Article";
      const url = "https://example.com/article";
      const description = "This is a test article.";
      const tags = ["test", "article"];
      const category = 3; // ResourceCategory.ARTICLE

      await knowledgeVault.connect(user).submitResource(title, url, description, tags, category);

      // Attempt to approve resource by non-admin
      await expect(knowledgeVault.connect(otherUser).approveResource(1, true))
        .to.be.revertedWith("Not authorized");
    });
  });

  describe("Resource Voting", function () {
    it("should allow users to upvote a resource", async function () {
      const title = "Test Resource";
      const url = "https://example.com/resource";
      const description = "This is a test resource.";
      const tags = ["test", "resource"];
      const category = 0; // ResourceCategory.EBOOK

      await knowledgeVault.connect(user).submitResource(title, url, description, tags, category);
      await knowledgeVault.connect(admin).approveResource(1, true);

      // Upvote the resource
      await expect(knowledgeVault.connect(otherUser).voteResource(1, true))
        .to.emit(knowledgeVault, "ResourceVoted")
        .withArgs(1, otherUser.address, true);

      const resource = await knowledgeVault.resources(1);
      expect(resource.upvotes).to.equal(1);
      expect(resource.downvotes).to.equal(0);

      const userProfile = await knowledgeVault.userProfiles(user.address);
      expect(userProfile.totalTokensEarned).to.equal(10); // Assuming reward per upvote is 10 tokens
    });

    it("should reward tokens on upvote", async function () {
      const title = "Test Video";
      const url = "https://example.com/video";
      const description = "This is a test video resource.";
      const tags = ["test", "video"];
      const category = 1; // ResourceCategory.VIDEO

      await knowledgeVault.connect(user).submitResource(title, url, description, tags, category);
      await knowledgeVault.connect(admin).approveResource(1, true);

      // Upvote the resource
      await knowledgeVault.connect(otherUser).voteResource(1, true);

      // Check the balance of the contributor (user)
      const balance = await knowledgeVaultToken.balanceOf(user.address);
      expect(balance).to.equal(10); // Assuming reward per upvote is 10 tokens
    });
  });

  describe("Profile Functions", function () {
    it("should allow a user to set and retrieve their profile URI", async function () {
      const profileURI = "https://example.com/profile/ipfs";

      await knowledgeVault.connect(user).setProfileURI(profileURI);

      const userProfile = await knowledgeVault.getProfile(user.address);
      expect(userProfile[0]).to.equal(profileURI);
    });
  });
});
