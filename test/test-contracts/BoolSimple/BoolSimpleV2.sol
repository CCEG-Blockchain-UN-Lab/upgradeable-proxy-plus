pragma solidity ^0.4.18;

contract BoolSimpleV2 {
    bool value;

    function getValue() view public returns (bool) {
        return value;
    }

    function setValue(bool _value) public {
        value = false;
    }
}
