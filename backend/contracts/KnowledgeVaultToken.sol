// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract KnowledgeVaultToken is ERC20 {
    // Constructor to initialize token supply
    constructor(uint256 initialSupply) ERC20("KnowledgeVaultToken", "KVT"){
        _mint(msg.sender, initialSupply * (10 ** decimals())); // Initial supply in full units
    }

    // Mint new tokens (Only admin can mint)
    function mint(address to, uint256 amount) external  {
        _mint(to, amount);
    }

    // Burn tokens
    function burn(address from, uint256 amount) external {
        _burn(from, amount);
    }
}
