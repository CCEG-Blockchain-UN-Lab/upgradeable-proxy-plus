pragma solidity ^0.4.18;

contract ChangeType_String {
    string value;

    function getValue() view public returns (string) {
        return value;
    }

    function setValue(string _value) public {
        value = _value;
    }
}