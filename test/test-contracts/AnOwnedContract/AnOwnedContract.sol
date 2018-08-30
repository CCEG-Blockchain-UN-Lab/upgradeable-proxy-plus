pragma solidity ^0.4.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract AnOwnedContract is Ownable{
    string name;

    function getName() view public returns (string) {
        return name;
    }

    function anOnlyOwnerMethod() onlyOwner{
        name = "Initial Name";
    }
    function aRegularMethodInAnOwnedContract() {
        name = "Initial Name";
    }
}
