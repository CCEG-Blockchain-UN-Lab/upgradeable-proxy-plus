pragma solidity ^0.4.0;

import "upgradeable-proxy/contracts/safe/SafeProxy.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract ProxyPlus is SafeProxy, Ownable{
    constructor(address _target) public
    SafeProxy(_target){
    }
}
