pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract ArraySimpleV2aSafe is UpgradeablePlus {
    uint[3] values;
    uint anotherValue;

    function getValues() view public returns (uint[3]) {
        return values;
    }

    function setValues(uint[3] _values) public {
        values = [1, 2, 3];
    }
}
