pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract AddressSimpleV1Safe is UpgradeablePlus {
    address value;

    function getValue() view public returns (address) {
        return value;
    }

    function setValue(address _value) public {
        value = _value;
    }
}
