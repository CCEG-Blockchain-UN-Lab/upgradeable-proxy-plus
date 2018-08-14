pragma solidity ^0.4.18;

contract ChangeType_Bytes32{
    bytes32 value;

    function getValue() view public returns (bytes32) {
        return value;
    }

    function setValue(bytes32 _value) public {
        value = _value;
    }
}
