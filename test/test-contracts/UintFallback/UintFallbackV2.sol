pragma solidity ^0.4.18;

contract UintFallbackV2{
    uint value;

    function getValue() view public returns (uint) {
        return value;
    }

    function () public {
        value = 20;
    }
}
