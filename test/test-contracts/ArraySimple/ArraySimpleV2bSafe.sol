pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract ArraySimpleV2bSafe is UpgradeablePlus {
    uint[] values;
    uint anotherValue;

    function getValues() view public returns (uint[]) {
        return values;
    }

    function setValues(uint[] _values) public {
        values = [1, 2, 3];
    }
}
