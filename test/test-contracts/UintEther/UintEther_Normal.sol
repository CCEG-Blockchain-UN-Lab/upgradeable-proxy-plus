pragma solidity ^0.4.18;

contract UintEther_Normal{
    uint value;

    function getValue() view public returns (uint) {
        return value;
    }

    function setValue() payable public {
        value = 10;
    }
}
