pragma solidity ^0.4.18;

contract ArraySimpleV1b {
    uint[] values;
    uint anotherValue;

    function getValues() view public returns (uint[]) {
        return values;
    }

    function setValues(uint[] _values) public {
        values = _values;
    }
}
