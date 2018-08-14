pragma solidity ^0.4.18;

contract UintFallbackV4{
    uint value;

    function getValue() view public returns (uint) {
        return value;
    }

    function () payable public {
        value = msg.value;
    }
}
