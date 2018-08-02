pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract StringSimpleV1 is UpgradeablePlus {
    string value;

    function getValue() view public returns (string) {
        return value;
    }

    function setValue(string _value) public {
        value = _value;
    }
}
