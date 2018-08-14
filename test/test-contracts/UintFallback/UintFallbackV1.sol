pragma solidity ^0.4.18;

contract UintFallbackV1{
    uint value;

    function getValue() view public returns (uint) {
        return value;
    }

    function () public {
        value = 10;
    }
}
