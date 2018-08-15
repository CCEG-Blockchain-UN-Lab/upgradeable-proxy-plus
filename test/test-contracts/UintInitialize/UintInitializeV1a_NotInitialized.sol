pragma solidity ^0.4.18;

contract UintInitializeV1a_NotInitialized{
    uint value = 111;

    function getValue() view public returns (uint) {
        return value;
    }

}
