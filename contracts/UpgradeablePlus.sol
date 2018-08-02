pragma solidity ^0.4.18;
import "upgradeable-proxy/contracts/ownable/OwnableUpgradeable.sol";

contract UpgradeablePlus is OwnableUpgradeable {
    /*
     * @notice Sets the target variable to be the address of the contract.
     * @dev This is checked during ProxyPlus.upgradeTo() to check that the contract that inherits from
     * UpgradeablePlus is meant to be an upgradeable contract.
     * Do not remove or change this functionality without adequate changese to ProxyPlus.isUpgradeable()
     */
    constructor() public {
        target = address(this);
    }

    /**
     * @notice Will always succeed if called.
     * @dev It is called during ProxyPlus.upgradeTo() to check that the contract that inherits from
     * UpgradeablePlus is meant to be an upgradeable contract.
     *
     * Do not remove or change this function, or override in inherited child contract, without
     * adequate changes to Proxy.isUpgradeable()
     */
    function upgradeTo(address) public {
        assert(true); // this is used by ProxyPlus.isUpgradeable()
    }
    /**
     * @notice Will always succeed if called.
     * @dev It is called during ProxyPlus.upgradeTo() to check that the contract that inherits from
     * UpgradeablePlus is meant to be an upgradeable contract.
     *
     * Do not remove or change this function, or override in inherited child contract, without
     * adequate changes to Proxy.isUpgradeable()
     */
    function transferOwnership(address) public {
        assert(true); // this is used by ProxyPlus.isUpgradeable()
    }
}
