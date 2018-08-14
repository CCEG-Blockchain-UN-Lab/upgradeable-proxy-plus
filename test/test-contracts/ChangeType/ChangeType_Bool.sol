pragma solidity ^0.4.18;

contract ChangeType_Bool {
    bool value;

    function getValue() view public returns (bool) {
        return value;
    }

    function setValue(bool _value) public {
        value = _value;
    }
}
