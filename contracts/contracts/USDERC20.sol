// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDERC20 is ERC20 {
    uint8 private _decimals;

    error MintCooldownActive(uint256 timeRemaining);

    // uint256 public constant MINT_COOLDOWN = 24 hours;
    // uint256 public constant MAX_MINT_AMOUNT = 1000_000_000;
    // mapping(address => uint256) public lastMintTime;

    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals_
    ) ERC20(name, symbol) {
        _decimals = decimals_;
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    // function mint(address to, uint256 amount) public {
    //     uint256 timeSinceLastMint = block.timestamp - lastMintTime[to];
    //     if (lastMintTime[to] != 0 && timeSinceLastMint < MINT_COOLDOWN) {
    //         revert MintCooldownActive(MINT_COOLDOWN - timeSinceLastMint);
    //     }

    //     uint256 mintAmount = amount > MAX_MINT_AMOUNT ? MAX_MINT_AMOUNT : amount;
        
    //     lastMintTime[to] = block.timestamp;
    //     _mint(to, mintAmount);
    // }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function burnFrom(address account, uint256 amount) public {
        uint256 currentAllowance = allowance(account, msg.sender);
        require(currentAllowance >= amount, "ERC20: burn amount exceeds allowance");
        _approve(account, msg.sender, currentAllowance - amount);
        _burn(account, amount);
    }

    // function getLastMintTime(address user) public view returns (uint256) {
    //     return lastMintTime[user];
    // }
}