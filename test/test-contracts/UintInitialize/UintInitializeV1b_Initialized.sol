pragma solidity ^0.4.18;

contract UintInitializeV1b_Initialized{
    uint value;

    function getValue() view public returns (uint) {
        return value;
    }

    function initialize() /*initializeOnceOnly*/ public {
        value = 111;
    }
}
