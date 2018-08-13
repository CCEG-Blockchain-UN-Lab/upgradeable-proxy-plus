pragma solidity ^0.4.18;

contract ArraySimpleV2a_ExtraValue {
    uint[4] values;
    uint anotherValue;

    function getValues() view public returns (uint[4]) {
        return values;
    }

    function setValues(uint[4] _values) public {
        values = _values;
    }
}
