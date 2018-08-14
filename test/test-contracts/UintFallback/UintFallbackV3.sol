pragma solidity ^0.4.18;

contract UintFallbackV3{
    uint value;

    function getValue() view public returns (uint) {
        return value;
    }

    function () public {
        revert();
    }
}
