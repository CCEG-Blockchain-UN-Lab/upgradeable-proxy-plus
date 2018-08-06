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

### Deploy Upgradeable CheckContract
Deploy Upgradeable CheckContract so that after Serenity hardfork, the method to check if an address is a contract can be upgraded. More information [here](https://github.com/CCEG-Blockchain-UN-Lab/upgradeable-proxy/blob/master/contracts/CheckContract.sol#L13)
```javascript
let checkContractInstance = await deployer.deploy(CheckContract);
```

### Deploy CheckContract's Proxy.
Deploy a Proxy for the just deployed CheckContract.
```javascript
let proxyInstance = await deployer.deploy(
  Proxy,
  checkContractInstance.address
);
```

### Get CheckContract's instance by proxy
Get the instance of the CheckContract by proxy, and initialize.
```javascript
let checkContractInstanceByProxy = CheckContract.at(proxyInstance.address);
await checkContractInstanceByProxy.initialize();
```

### Make some tests
(OPTIONAL) Make some tests to make sure the method isContract called by proxy is properly working.
```javascript
let testOne = await checkContractInstanceByProxy.isContract.call(
  checkContractInstanceByProxy.address
);
assert.equal(testOne, true);
let testTwo = await checkContractInstanceByProxy.isContract.call(
  "0x627306090abab3a6e1400e9345bc60c78a8bef57"
);
assert.equal(testTwo, false);
```

###Deploy the UpgradeablePlus contract
```javascript
    let addressSimpleV1 = await deployer.deploy(AddressSimpleV1);
```

### Deploy AddressSimpleV1's ProxyPlus
Deploy a ProxyPlus for the just deployed AddressSimpleV1Safe.
```javascript
let proxyPlus = await ProxyPlus.new(
  addressSimpleV1.address,
  checkContractInstanceByProxy.address
);
```

### Get AddressSimpleV1's instance by proxy
Get the instance of the AddressSimpleV1Safe by proxy, and initialize.
```javascript
let addressSimpleV1byProxy = AddressSimpleV1.at(proxyPlus.address);
await addressSimpleV1byProxy.initialize();
```

### Make some tests
(OPTIONAL) Make some tests to make sure the UpgradeablePlus contract called by proxy is properly working.
```javascript
const inputValue = "0xa4532e9f6f9c4e4abb89bdbb73d3003210ede61c",
  inputValue2 = "0x5c28D962c93282C6Fbe820f9AB33844D96b4853e";
await addressSimpleV1byProxy.setValue(inputValue);
let value = await addressSimpleV1byProxy.getValue.call();
assert.equal(value, inputValue, "Not equal to inputValue");

let addressSimpleV2 = await deployer.deploy(AddressSimpleV2);
await addressSimpleV1byProxy.upgradeTo(addressSimpleV2.address);
await addressSimpleV1byProxy.initialize();
value = await addressSimpleV1byProxy.getValue.call();
assert.equal(value, inputValue, "Not equal to inputValue");

await addressSimpleV1byProxy.setValue(inputValue2);
value = await addressSimpleV1byProxy.getValue.call();
assert.equal(
  value,
  "0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98",
  "Not equal to constant defined in function"
);
```

The full example was written inside migrations and is fully functional [here](https://github.com/CCEG-Blockchain-UN-Lab/upgradeable-proxy-plus/blob/master/migrations/2_deploy_contracts.js).

### How to import these library contracts?
Use the following strategy to import library contracts to your own contracts
```javascript
import "upgradeable-proxy-plus/contracts/UpgradeablePlus.sol";
```
