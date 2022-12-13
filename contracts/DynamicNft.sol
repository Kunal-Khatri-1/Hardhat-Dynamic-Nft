// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

////////////////
// ERRORS
///////////////

// reverted with this error if mintNft is called with less than s_mintfee wei
error DynamicNFT__NeedMoreEth();
// reverted with this error is msg.sender is not i_owner
error DynamicNFT__OnlyOwner();

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "base64-sol/base64.sol";

contract DynamicNft is ERC721 {
    ////////////////////////
    // TYPE DECLARATIONS
    ///////////////////////

    // Structure for information related to metadata of the NFT
    struct URIDetails {
        string name;
        string imageURL; // Dynamic => changeable
        string venue; // Dynamic => changeable
    }

    /////////////////////
    // STATE VARIABLES
    /////////////////////

    // i_owner => owner of the contract
    address private i_owner;
    // s_tokenCounter => unique ID for each NFT
    uint256 private s_tokenCounter;
    // wei required to mint an NFT
    uint256 private s_mintFee;
    // stores uri / metadata for NFT
    URIDetails private s_uriVar;

    //////////////
    // EVENT
    //////////////

    // NftMinted event emitted when NFT is minted
    event NftMinted(uint256 tokneID, string indexed imageURL, string indexed venue);
    // ImageURLChanged event emitted when image to which NFT points changes
    event ImageURLChanged(string indexed imageURL);
    // VenueChanged event emitted when entriesPerTicket field of the tokenURI / metadata changes
    event VenueChanged(string indexed venue);
    // MintFeeChanged event emitted when wei/ethers required to mint NFT is changed
    event MintFeeChanged(uint256 indexed mintFee);

    ////////////////
    // MODIFIERS
    ////////////////

    // modifier when attached to a function mandates that only i_owner can call that function otherwise it reverts with DynamicNFT__OnlyOwner()
    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert DynamicNFT__OnlyOwner();
        }

        _;
    }

    //////////////////
    // FUNCTIONS
    //////////////////

    // constructor is called immidiately after deployment, initializes variables
    constructor(
        string memory name,
        string memory symbol,
        string memory imageURL,
        string memory venue
    ) ERC721(name, symbol) {
        s_uriVar = URIDetails(name, imageURL, venue);
        i_owner = msg.sender;
        s_tokenCounter = 0;
        setMintFee(1 ether);
    }

    // returns a string which must be appended with tokenURI to make tokenURI which is encoded in base64 to be compatible with browsers
    function _baseURI() internal pure override returns (string memory) {
        return "data:application/json;base64,";
    }

    function tokenURI(uint256 /*tokenId*/) public view override returns (string memory) {
        return
            string(
                abi.encodePacked(
                    _baseURI(),
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name": "',
                                name(),
                                '", "image": "',
                                getImageURL(),
                                '", "venue" : "',
                                getVenue(),
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    // mintNft => function to mint an NFT
    function mintNft() public payable returns (uint256) {
        if (msg.value < s_mintFee) {
            revert DynamicNFT__NeedMoreEth();
        }

        s_tokenCounter += 1;

        _safeMint(msg.sender, s_tokenCounter);

        emit NftMinted(s_tokenCounter, s_uriVar.imageURL, s_uriVar.venue);

        return s_tokenCounter;
    }

    ////////////////////////
    // SETTER FUNCTIONS
    ////////////////////////

    // setImageURL => function to change imageURL
    // only i_owner can call this function otherwise it reverts
    function setImageURL(string memory newImageURL) public onlyOwner {
        s_uriVar.imageURL = newImageURL;

        emit ImageURLChanged(newImageURL);
    }

    // setEntriesPerTicket => function to change entriesPerTicket field in meta-data / token URI
    // only i_owner can call this function otherwise it reverts
    function setVenue(string memory newVenue) public onlyOwner {
        s_uriVar.venue = newVenue;

        emit VenueChanged(newVenue);
    }

    // setMintFee => function to change wei/ether required to mint NFT
    // only i_owner can call this function otherwise it reverts
    function setMintFee(uint256 newMintFee) public onlyOwner {
        s_mintFee = newMintFee;

        emit MintFeeChanged(newMintFee);
    }

    /////////////////////////
    // GETTER FUNCTIONS
    /////////////////////////

    // getImageURL => function returns imageURL in NFT meta-data / URI
    function getImageURL() public view returns (string memory) {
        return s_uriVar.imageURL;
    }

    // getEntriesPerTicket => function entriesPerTicket field in meta-data / token URI
    function getVenue() public view returns (string memory) {
        return s_uriVar.venue;
    }

    // getMintFee => returns wei required to mint NFT
    function getMintFee() public view returns (uint256) {
        return s_mintFee;
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
