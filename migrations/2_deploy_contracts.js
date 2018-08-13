const AddressSimpleV1 = artifacts.require("AddressSimpleV1");
const AddressSimpleV2 = artifacts.require("AddressSimpleV2");
const assert = require("assert");

const OwnedUpgradeabilityProxy = artifacts.require("OwnedUpgradeabilityProxy");

/**
 * Follow this pattern to workaround the following problem:
 * https://github.com/trufflesuite/truffle/issues/501
 */

module.exports = deployer => {
  // Alternatively, just start a chain without a deployment
  deployer.then(async () => {
    const inputValue = "0xa4532e9f6f9c4e4abb89bdbb73d3003210ede61c",
      inputValue2 = "0x5c28D962c93282C6Fbe820f9AB33844D96b4853e";

    let proxy = await deployer.deploy(OwnedUpgradeabilityProxy);
    let addressSimpleV1 = await deployer.deploy(AddressSimpleV1);
    await proxy.upgradeTo(addressSimpleV1.address);
    let addressSimpleV1byProxy = AddressSimpleV1.at(proxy.address);

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
  });
};
