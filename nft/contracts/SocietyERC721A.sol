// SPDX-License-Identifier: MIT
// ERC721A Contracts v4.0.0
//@author KaliT1z https://instagram.com/1000cent10
pragma solidity ^0.8.12;

import "./ERC721A.sol";
import "./ERC721AQueryable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/finance/PaymentSplitter.sol";
import "@openzeppelin/contracts/utils/Strings.sol";



contract SocietyERC721A is ERC721A, ERC721AQueryable, Ownable, PaymentSplitter {
    using Strings for uint;

    enum Step {
        Before,
        WhitelistSale,
        PublicSale,
        SoldOut,
        Reveal
    }

    Step public sellingStep;

    uint private constant MAX_SUPPLY = 100;
    uint private constant MAX_GIFT = 10;
    uint private constant MAX_WHITELIST = 20;
    uint private constant MAX_PUBLIC = 70;
    uint private constant MAX_SUPPLY_MINUS_GIFT = MAX_SUPPLY - MAX_GIFT;

    uint public wlSalePrice = 0.2 ether;
    uint public publicSalePrice = 0.25 ether;

    uint public saleStartTime = 1657008943;

    bytes32 public merkleRoot;

    string public baseURI;

    mapping(address => uint) amountNFTperWalletWithelistSale;
    mapping(address => uint) amountNFTperWalletPublicSale;
    mapping (uint => bool) isLockedTokenId ;
   
  

    uint private constant maxPerAddressDuringWhitelistMint = 5;
    uint private constant maxPerAddressDuringPublicMint = 10;

    bool public isPaused;

    uint private teamLength;

    address[] private _team = [
        0x599C9349B258F9095bE5c26297c2D7E134AB316B,
        0x6A58C485791E49301254bbE8088a778Bb439BC7e,
        0x5AfD961a85fcC2a62bF8E9482557216017Df5De2
    ];

    uint[] private _teamShares = [
        700,
        150,
        150
    ];
    //constructeur
    constructor(bytes32 _merkleRoot, string memory _baseURI)
    ERC721A("Society", "SOT")
    PaymentSplitter(_team, _teamShares) {
        merkleRoot = _merkleRoot;
        baseURI = _baseURI;
        teamLength = _team.length;
    }

    modifier callerIsUser() {
        require(tx.origin == msg.sender, "the caller is another contract");_;
    }

    function tokenURI(uint _tokenId) public view virtual override(ERC721A, IERC721A) returns(string memory) {
        require(_exists(_tokenId), "URI query for nonexistent token");

        return string(abi.encodePacked(baseURI, _tokenId.toString(), ".json"));
    }
    // @notice allows to set the whitelistsale price
    function setWlSalePrice(uint _wlSalePrice) external onlyOwner {
        wlSalePrice = _wlSalePrice;
    }
    // @notice allows to set the publiclistsale price
    function setPublicSalePrice(uint _publicSalePrice) external onlyOwner {
        publicSalePrice = _publicSalePrice;
    }

    // @notice allows to set the saleStartTime 
    function setSaleStartTime(uint _saleStartTime) external onlyOwner {
        saleStartTime = _saleStartTime;
    }
    
   //@setLocketTokenId
   function setLockedTokenId(uint _tokenId, bool _locked) external onlyOwner{
        isLockedTokenId[_tokenId] = _locked;
        
        
    }
    //return timestamp
    function currentTime() internal view returns(uint){
        return block.timestamp;
    }
    //changestep
    function setStep(uint _step) external onlyOwner{
        sellingStep = Step(_step);    
    }
    //setpaudes
    function setPaused(bool _isPaused) external onlyOwner{
        isPaused = _isPaused;   
    }

    //changebaseURI
    function setBaseURI(string memory _baseURI) external onlyOwner{
        baseURI = _baseURI;    
    }

    //changetheMerkleRoot
    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner{
        merkleRoot = _merkleRoot;    
    }

    function leaf(address _account) internal pure returns(bytes32){
        return keccak256(abi.encodePacked(_account));
    }

    function _verify(bytes32 _leaf, bytes32[] memory _proof) internal view returns(bool){
        return MerkleProof.verify(_proof, merkleRoot, _leaf);
    }

    function isWhitelisted(address _account, bytes32[] calldata _proof) internal view returns(bool){
        return _verify(leaf(_account), _proof);
    }

    function releaseAll() external {
        for(uint i = 0 ; i < teamLength ; i++){
            release(payable(payee(i)));
        }
    }
    
    receive() override external payable {
        revert('only if you mint');
    }
     /**
    * @notice Mint function for the Whitelist Sale
    *
    * @param _account Account which will receive the NFT
    * @param _quantity Amount of NFTs ther user wants to mint
    * @param _proof The Merkle Proof
    **/
    function whitelistMint(address _account, uint _quantity, bytes32[] calldata _proof) external payable callerIsUser{
        require(!isPaused, "contract is paused");
        require(currentTime() >= saleStartTime, "sale has not  started yet");
        require(currentTime() < saleStartTime + 12 hours, "sale is finished");
        uint price = wlSalePrice;
        require(price != 0, "price is 0");
        require(sellingStep == Step.WhitelistSale, "Whitelist sale is not activated");
        require(isWhitelisted(msg.sender, _proof),"not whitelisted");
        require(amountNFTperWalletWithelistSale[msg.sender] + _quantity <= maxPerAddressDuringWhitelistMint, "youu can only get5 5 NFT on the Whitelist Sale" );
        require(totalSupply() + _quantity <= MAX_WHITELIST, "max supply exceeded");
        require(msg.value >= price * _quantity, "not enought funds");
        amountNFTperWalletWithelistSale[msg.sender] += _quantity;
        _safeMint(_account, _quantity);
    }
    /**
    * @notice Mint function for the Public Sale
    *
    * @param _account Account which will receive the NFTs
    * @param _quantity Amount of NFTs the user wants to mint
    **/
    function publicMint(address _account, uint _quantity) external payable callerIsUser {
        require(!isPaused, "Contract is Paused");
        require(currentTime() >= saleStartTime + 24 hours, "Public sale has not started yet");
        uint price = publicSalePrice;
        require(price != 0, "Price is 0");
        require(sellingStep == Step.PublicSale, "Public sale is not activated");
        require(amountNFTperWalletPublicSale[msg.sender] + _quantity <= maxPerAddressDuringPublicMint, "You can only get 3 NFTs on the Whitelist Sale");
        require(totalSupply() + _quantity <= MAX_SUPPLY_MINUS_GIFT, "Max supply exceeded");
        require(msg.value >= price * _quantity, "Not enought funds");
        amountNFTperWalletPublicSale[msg.sender] += _quantity;
        _safeMint(_account, _quantity);
    }
    /**
    * @notice Allows the owner to gift NFTs
    *
    * @param _to The address of the receiver
    * @param _quantity Amount of NFTs the owner wants to gift
    **/
    function gift(address _to, uint _quantity) external onlyOwner {
        require(sellingStep > Step.PublicSale, "Gift is after the public sale");
        require(totalSupply() + _quantity <= MAX_SUPPLY, "Reached max supply");
        _safeMint(_to, _quantity);
    }

}