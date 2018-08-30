pragma solidity ^0.4.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract AnOwnedContractV2 is Ownable{
    string name;

    function getName() view public returns (string) {
        return name;
    }

    function anOnlyOwnerMethod() onlyOwner{
        name = "Updated Name";
    }
    function aRegularMethodInAnOwnedContract() {
        name = "Updated Name";
    }
}
