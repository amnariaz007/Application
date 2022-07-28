// SPDX-License-Identifier: MIT
//@author KaliT1z https://instagram.com/1000cent10

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SocietyToken is ERC20, Ownable  {
    mapping(address => bool) admins;
    constructor() ERC20("SocietyToken", "SOT") {}
     function mint(address _to, uint _amount) external{
         require(admins[msg.sender], "cannot mint if not admin");
         _mint(_to, _amount);
     }
     function addAdmin(address _admin) external onlyOwner{
         admins[_admin] = true;
     }
     function removeAdmin(address _admin) external onlyOwner{
         admins[_admin] = false;
     }
}