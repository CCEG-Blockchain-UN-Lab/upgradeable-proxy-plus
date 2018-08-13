pragma solidity ^0.4.18;

contract AddressSimpleV1 {
    address value;

    function getValue() view public returns (address) {
        return value;
    }

    function setValue(address _value) public {
        value = _value;
    }
}
