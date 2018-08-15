# Upgradeable Proxy Plus
Based on upgradeable-proxy. More info [here](https://github.com/CCEG-Blockchain-UN-Lab/upgradeable-proxy).

## Features

- Based on [https://github.com/zeppelinos/labs/tree/master/upgradeability_using_unstructured_storage](Zeppelin OS)
- Permissioned (Ownable) proxy upgrade
- Ownable to allow the administrator of the proxy to be set as a multisig or DAO-like contract to provide distributed governance.     
- Comprehensive test suite based on [Jack Tanner's tests](https://github.com/jackandtheblockstalk/upgradeable-proxy)

## Instalation
```bash
npm install unstructured-upgradeable-proxy
```

## Usage

### Deploy the OwnedUpgradeabilityProxy contract
```javascript
    const inputValue = "0xa4532e9f6f9c4e4abb89bdbb73d3003210ede61c",
      inputValue2 = "0x5c28D962c93282C6Fbe820f9AB33844D96b4853e";

    let proxy = await deployer.deploy(OwnedUpgradeabilityProxy);
```    

### Deploy AddressSimpleV1
```javascript
    let addressSimpleV1 = await deployer.deploy(AddressSimpleV1);
```

### Get AddressSimpleV1's instance by proxy
Get the instance of the AddressSimpleV1 by proxy, and initialize.
```javascript
    await proxy.upgradeTo(addressSimpleV1.address);
    let addressSimpleV1byProxy = AddressSimpleV1.at(proxy.address);
```

### Make some tests
(OPTIONAL) Make some tests to make sure the contract called by proxy is properly working.
```javascript
    await addressSimpleV1byProxy.setValue(inputValue);
    let value = await addressSimpleV1byProxy.getValue.call();
    assert.equal(value, inputValue, "Not equal to inputValue");

    let addressSimpleV2 = await deployer.deploy(AddressSimpleV2);

    await proxy.upgradeTo(addressSimpleV2.address);
    // await addressSimpleV1byProxy.initialize();
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

The full example was written inside migrations and is fully functional [here](https://github.com/CCEG-Blockchain-UN-Lab/upgradeable-proxy-plus/blob/unstructured_storage/migrations/2_deploy_contracts.js).

### How to import these library contracts?
Use the following strategy to import library contracts to your own contracts
```javascript
import "unstructured-upgradeable-proxy/contracts/OwnedUpgradeabilityProxy.sol";
```
