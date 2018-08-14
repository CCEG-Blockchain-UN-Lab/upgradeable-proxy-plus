pragma solidity ^0.4.18;

import "./UintInheritedV1.sol";

contract UintInheritedV2 is UintInheritedV1{
    function setValue(uint _value) public {
        value = 2*_value;
    }
}
