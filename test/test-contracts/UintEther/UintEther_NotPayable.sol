pragma solidity ^0.4.18;

contract UintEther_NotPayable {
    uint value;

    function getValue() view public returns (uint) {
        return value;
    }

    function setValue() public {
        value = msg.value;
    }
}
