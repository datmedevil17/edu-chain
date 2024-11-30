// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./KnowledgeVaultToken.sol"; // Import the token contract

contract KnowledgeVault {
    // ---------------------------
    // Structs and Enums
    // ---------------------------
    enum ResourceCategory { EBOOK, VIDEO, PODCAST, ARTICLE }
    enum ForumCategory { TECH, SCIENCE, LITERATURE, ART }

    struct Resource {
        uint256 id;
        string title;
        string url;
        string description;
        string[] tags;
        ResourceCategory category;
        address contributor;
        uint256 upvotes;
        uint256 downvotes;
        bool approved;
    }

    struct UserProfile {
        uint256 totalContributions;
        uint256 totalTokensEarned;
        string profileURI;  // URI for profile details (e.g., IPFS link)
    }

    struct Event {
        uint256 id;
        string title;
        string description;
        string date;
        string link;
    }

    struct ForumTopic {
        uint256 id;
        string title;
        ForumCategory category;
        address creator;
        string description;
        uint256 timestamp;
    }

    // ---------------------------
    // State Variables
    // ---------------------------
    uint256 public resourceCount;
    uint256 public eventCount;
    uint256 public forumTopicCount;
    uint256 public rewardPerUpvote = 10; // Reward in tokens per upvote
    address public admin;
    address public tokenContract;

    mapping(uint256 => Resource) public resources;
    mapping(address => UserProfile) public userProfiles;
    mapping(uint256 => Event) public events;
    mapping(uint256 => ForumTopic) public forumTopics; // Forum topics by ID

    // ---------------------------
    // Events
    // ---------------------------
    event ResourceSubmitted(
        uint256 indexed id,
        address indexed contributor,
        string title,
        ResourceCategory category
    );
    event ResourceApproved(uint256 indexed id, bool status);
    event ResourceVoted(uint256 indexed id, address indexed voter, bool upvote);
    event TokensRewarded(address indexed contributor, uint256 amount);
    event EventCreated(uint256 indexed eventId, string title, string date);
    event ForumTopicCreated(uint256 indexed topicId, address indexed creator, string title);

    // ---------------------------
    // Modifiers
    // ---------------------------
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    // ---------------------------
    // Constructor
    // ---------------------------
    constructor(address _tokenContract) {
        admin = msg.sender;
        tokenContract = _tokenContract;
    }

    // ---------------------------
    // Resource Functions
    // ---------------------------
    function submitResource(
        string memory _title,
        string memory _url,
        string memory _description,
        string[] memory _tags,
        ResourceCategory _category
    ) external {
        resourceCount++;
        resources[resourceCount] = Resource({
            id: resourceCount,
            title: _title,
            url: _url,
            description: _description,
            tags: _tags,
            category: _category,
            contributor: msg.sender,
            upvotes: 0,
            downvotes: 0,
            approved: false
        });

        userProfiles[msg.sender].totalContributions++;
        emit ResourceSubmitted(resourceCount, msg.sender, _title, _category);
    }

    function approveResource(uint256 _id, bool _status) external onlyAdmin {
        resources[_id].approved = _status;
        emit ResourceApproved(_id, _status);
    }

    function voteResource(uint256 _id, bool _upvote) external {
        require(resources[_id].approved, "Resource not approved");
        if (_upvote) {
            resources[_id].upvotes++;
            uint256 rewardAmount = rewardPerUpvote;
            KnowledgeVaultToken(tokenContract).mint(resources[_id].contributor, rewardAmount);
            userProfiles[resources[_id].contributor].totalTokensEarned += rewardAmount;
            emit TokensRewarded(resources[_id].contributor, rewardAmount);
        } else {
            resources[_id].downvotes++;
        }

        emit ResourceVoted(_id, msg.sender, _upvote);
    }

    // ---------------------------
    // Profile Functions
    // ---------------------------
    function setProfileURI(string memory _profileURI) external {
        userProfiles[msg.sender].profileURI = _profileURI;
    }

    function getProfile(address _user) external view returns (string memory, uint256, uint256) {
        return (
            userProfiles[_user].profileURI,
            userProfiles[_user].totalContributions,
            userProfiles[_user].totalTokensEarned
        );
    }

    // ---------------------------
    // Discussion Forum Functions
    // ---------------------------
    function createForumTopic(
        string memory _title,
        ForumCategory _category,
        string memory _description
    ) external {
        forumTopicCount++;
        forumTopics[forumTopicCount] = ForumTopic({
            id: forumTopicCount,
            title: _title,
            category: _category,
            creator: msg.sender,
            description: _description,
            timestamp: block.timestamp
        });

        emit ForumTopicCreated(forumTopicCount, msg.sender, _title);
    }

    function getForumTopic(uint256 _topicId) external view returns (ForumTopic memory) {
        return forumTopics[_topicId];
    }

    // ---------------------------
    // Event Functions
    // ---------------------------
    function createEvent(
        string memory _title,
        string memory _description,
        string memory _date,
        string memory _link
    ) external onlyAdmin {
        eventCount++;
        events[eventCount] = Event({
            id: eventCount,
            title: _title,
            description: _description,
            date: _date,
            link: _link
        });

        emit EventCreated(eventCount, _title, _date);
    }

    function getEvent(uint256 _eventId) external view returns (Event memory) {
        return events[_eventId];
    }

    // ---------------------------
    // Admin Functions
    // ---------------------------
    function setRewardPerUpvote(uint256 _reward) external onlyAdmin {
        rewardPerUpvote = _reward;
    }
}
