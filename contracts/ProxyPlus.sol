pragma solidity ^0.4.18;

import './UpgradeablePlus.sol';
import "upgradeable-proxy/contracts/ownable/OwnableProxied.sol";
import "upgradeable-proxy/contracts/Proxy.sol";
import "upgradeable-proxy/contracts/CheckContract.sol";

contract ProxyPlus is OwnableProxied {

    address checkContract;
    constructor(address _target, address _checkContractProxy) public {
        checkContract = CheckContract(_checkContractProxy);
        upgradeTo(_target);
    }

    function upgradeTo(address _target) public onlyOwner{
        assert(target != address(_target));
        assert(isContract(address(_target)));
        assert(isUpgradeable(_target));

        address oldTarget = target;
        target = _target;

        emit EventUpgrade(_target, oldTarget, msg.sender);
    }

    function upgradeTo(address _target, bytes _data) public onlyOwner{
        upgradeTo(_target);
        assert(address(target).delegatecall(_data));
    }

    function () payable public {
        bytes memory data = msg.data;
        address impl = target;

        assembly {
            let result := delegatecall(gas, impl, add(data, 0x20), mload(data), 0, 0)
            let size := returndatasize

            let ptr := mload(0x40)
            returndatacopy(ptr, 0, size)

            switch result
            case 0 { revert(ptr, size) }
            default { return(ptr, size) }
        }
    }

    /*
     * @notice Checks if if the supplied address points to a contract
     * @param _target - The address to be checked
     * @return true if the target is a contract
     */
    function isContract(address _target) internal view returns (bool) {
        return CheckContract(checkContract).call(bytes4(keccak256("isContract(address)")), _target);
    }

    /*
     * @notice Checks if the supplied address is a contract that probably inherits from UpgradeablePlus
     * @param _target - The address to be checked
     * @returns true if the target address implements the upgradeTo() function
     */
    function isUpgradeable(address _target) internal view returns (bool) {
        return (UpgradeablePlus(_target).call(bytes4(keccak256("upgradeTo(address)")), address(this)) &&
        UpgradeablePlus(_target).call(bytes4(keccak256("transferOwnership(address)")), owner));
    }

}
