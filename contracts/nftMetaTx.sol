// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/metatx/ERC2771Forwarder.sol";

contract MetaTxNFT is ERC2771Context, ERC721, Ownable {
    uint256 private _tokenIds;

    constructor(ERC2771Forwarder trustedForwarder, string memory name, address owner)
        ERC721(name, "MTX")
        ERC2771Context(address(trustedForwarder))
        Ownable(owner)
    {
    }

    // Override _msgSender and _msgData to resolve ambiguity in Context inheritance
    function _msgSender() internal view override(Context, ERC2771Context) returns (address sender) {
        return ERC2771Context._msgSender();
    }

    function _msgData() internal view override(Context, ERC2771Context) returns (bytes calldata) {
        return ERC2771Context._msgData();
    }

    // Override required function _contextSuffixLength
    function _contextSuffixLength() internal view virtual override(Context, ERC2771Context) returns (uint256) {
        return ERC2771Context._contextSuffixLength();
    }

    // Function to mint new NFTs
    function mint(address to) external  {
        _tokenIds++;
        _mint(to, _tokenIds);
    }
}
