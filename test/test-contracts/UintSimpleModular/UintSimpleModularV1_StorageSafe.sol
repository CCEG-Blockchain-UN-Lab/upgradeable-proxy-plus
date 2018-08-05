pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";
import "./UintSimpleModularV1_Events.sol";

contract UintSimpleModularV1_StorageSafe is UpgradeablePlus, UintSimpleModularV1_Events {
    uint value;
}
