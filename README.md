# Upgradeable Proxy Plus
Based on upgradeable-proxy. More info [here](https://github.com/CCEG-Blockchain-UN-Lab/upgradeable-proxy).

## Features

- Implements both upgradeable-proxy features at same time:
  - Upgrade safety and protection
    - Experimental safety features[*](#note) were implemented to the upgradeable pattern to protect the contract from being accidentally or maliciousl upgraded to the wrong contract. A target contract for the SafeProxy must satisfy, at a minimum, the following conditions to be able to call Proxy.upgradeTo() to change the target:
      1. Must have a address target variable
      2. Must have a upgradeTo(address) public function
      3. Must have a transferOwnership(address) public function
  - Permissioned (Ownable) proxy upgrade
    - Ownable to allow the administrator of the proxy to be set as a multisig or DAO-like contract to provide distributed governance.     
- Inherits from upgradeable-proxy
  - 100% Upgradeable strategy
  - Comprehensive test suite

### Note:
- empty functions that do nothing will satisfy these conditions.
- one of the safety features depends on the use of the EXTCODESIZE opcode which may not work after the Serenity hard fork.
- carefully consider if these safety features are necessary, onced deployed they cannot be changed.

## Instalation
```bash
npm install upgradeable-proxy-plus
```

## Usage
Imagine you have the first version of a contract called UintSimpleV1 with this [code](https://github.com/CCEG-Blockchain-UN-Lab/upgradeable-proxy-plus/blob/master/test/test-contracts/UintSimple/UintSimpleV1.sol).
But instead importing from the relative path you import directly from the npm package that was just installed:
```javascript
import "upgradeable-proxy-plus/contracts/UpgradeablePlus.sol";
```

To deploy use the following strategy:
```javascript
let uintSimpleV1 = await UintSimpleV1.new();
let proxy = await Proxy.new(uintSimpleV1.address);
let uintSimpleV1byProxy = UintSimpleV1.at(proxy.address);
await uintSimpleV1byProxy.initialize();
```

### Contract interaction
To interact with the upgradeable contract, then simply call the contract methods like [test](https://github.com/CCEG-Blockchain-UN-Lab/upgradeable-proxy-plus/blob/master/test/UnitSimple.js#L25
) indicates.
```javascript
await uintSimpleV1byProxy.setValue(inputValue)
let bigNumValue = await uintSimpleV1byProxy.getValue.call();
```

### The upgrade
And now you want to update to a second version of the contract called UintSimpleV2 with this [code](https://github.com/CCEG-Blockchain-UN-Lab/upgradeable-proxy-plus/blob/master/test/test-contracts/UintSimple/UintSimpleV2.sol).
But instead importing from the relative path you import directly from the npm package that was just installed:
```javascript
import "upgradeable-proxy-plus/contracts/UpgradeablePlus.sol";
```

So next step is to deploy the second version of the contract first, then upgrade and finally initialize the proxy.
```javascript
let uintSimpleV2 = await UintSimpleV2.new();
await uintSimpleV1byProxy.upgradeTo(uintSimpleV2.address);
await uintSimpleV1byProxy.initialize();
```

Once that is done, the functionality called through the proxy contract will be the updated one.
