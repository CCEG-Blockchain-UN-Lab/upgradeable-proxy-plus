pragma solidity ^0.4.18;

contract MapSimpleV2c {
    mapping (uint => uint) values;

    function getValue(uint _index) view public returns (uint) {
        return values[_index];
    }

    function setValue(uint _index, uint _value) public {
        values[_index] = _value;
    }
}
