pragma solidity ^0.4.18;

contract ArraySimpleV2b {
    uint[] values;
    uint anotherValue;

    function getValues() view public returns (uint[]) {
        return values;
    }

    function setValues(uint[] _values) public {
        values = [1, 2, 3];
    }
}
