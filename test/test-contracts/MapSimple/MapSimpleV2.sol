pragma solidity ^0.4.18;

contract MapSimpleV2 {
    mapping (uint => bool) values;

    function getValue(uint _index) view public returns (bool) {
        return values[_index];
    }

    function setValue(uint _index, bool _value) public {
        values[_index] = false;
    }
}
