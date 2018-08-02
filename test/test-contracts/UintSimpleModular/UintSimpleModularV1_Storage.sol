pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";
import "./UintSimpleModularV1_Events.sol";

contract UintSimpleModularV1_Storage is UpgradeablePlus, UintSimpleModularV1_Events {
    uint value;
}
