pragma experimental ABIEncoderV2;
pragma solidity ^0.4.18;

import "../../../contracts/UpgradeablePlus.sol";

contract UintAdvancedV2w_ChangeReturnSafe is UpgradeablePlus {
    uint value;

    struct MyStruct {
        uint uintValue;
        string stringValue;
    }

    function getValue() view public returns (MyStruct) {
        MyStruct memory myStruct;
        myStruct.uintValue = value;
        myStruct.stringValue = 'I am a happy string';
        return myStruct;
    }

    function setValue(uint _value) public {
        value = _value;
    }
}
