const deployContractAndSafeProxyFor = require("./helpers/deployContractAndSafeProxyFor");
const deployOnlyProxyFor = require("./helpers/deployOnlyProxyFor");
const CheckContract = artifacts.require("CheckContract");
const MapSimpleV1 = artifacts.require("MapSimpleV1Safe");
const MapSimpleV2 = artifacts.require("MapSimpleV2Safe");
const MapSimpleV2b = artifacts.require("MapSimpleV2bSafe");
const MapSimpleV2c = artifacts.require("MapSimpleV2cSafe");

contract("MapSimpleSafe", function(accounts) {
  let proxy,
    mapSimpleV2,
    mapSimpleV2b,
    mapSimpleV2c,
    mapSimpleV1byProxy,
    mapSimpleV2bbyProxy,
    mapSimpleV2cbyProxy;

  beforeEach(async function() {
    let result = await Promise.all([
      MapSimpleV2.new(),
      MapSimpleV2b.new(),
      MapSimpleV2c.new(),
      deployOnlyProxyFor(await CheckContract.deployed()).then(async ci => {
        let checkContractInstanceByProxyAddress = ci.proxied.address;
        await deployContractAndSafeProxyFor(
          checkContractInstanceByProxyAddress,
          MapSimpleV1
        ).then(async cnp => {
          proxy = cnp.proxy;
          mapSimpleV1byProxy = cnp.proxied;
          mapSimpleV2bbyProxy = MapSimpleV2b.at(proxy.address);
          mapSimpleV2cbyProxy = MapSimpleV2c.at(proxy.address);
          await mapSimpleV1byProxy.initialize();
        });
      })
    ]);
    mapSimpleV2 = result[0];
    mapSimpleV2b = result[1];
    mapSimpleV2c = result[2];
  });

  it("should be able to upgrade to new map function", async function() {
    await mapSimpleV1byProxy.setValue(0, true);
    let value = await mapSimpleV1byProxy.getValue.call(0);
    assert.equal(value, true, "Not equal to true");

    await mapSimpleV1byProxy.upgradeTo(mapSimpleV2.address);
    await mapSimpleV1byProxy.initialize();

    value = await mapSimpleV1byProxy.getValue.call(0);
    assert.equal(value, true, "Not equal to true");

    await mapSimpleV1byProxy.setValue(0, true);
    value = await mapSimpleV1byProxy.getValue.call(0);
    assert.equal(value, false, "Not equal to false");
  });

  it("should be able to upgrade to new mapping with a different key", async function() {
    await mapSimpleV1byProxy.setValue(0, true);
    let value = await mapSimpleV1byProxy.getValue.call(0);
    assert.equal(value, true, "Not equal to true");

    await mapSimpleV1byProxy.upgradeTo(mapSimpleV2b.address);
    await mapSimpleV1byProxy.initialize();

    value = await mapSimpleV2bbyProxy.getValue.call(0);
    assert.equal(value, true, "Not equal to true");
    value = await mapSimpleV2bbyProxy.getValue.call(
      0x0000000000000000000000000000000000000000
    );
    assert.equal(value, true, "Not equal to true");
    value = await mapSimpleV2bbyProxy.getValue.call(
      0x0000000000000000000000000000000000000001
    );
    assert.equal(value, false, "Equal to true");

    await mapSimpleV2bbyProxy.setValue(
      "0x0000000000000000000000000000000000000000",
      false
    );
    value = await mapSimpleV2bbyProxy.getValue.call(0);
    assert.equal(value, false, "Equal to false");
  });

  it("should be able to upgrade to new mapping with a different value", async function() {
    await mapSimpleV1byProxy.setValue(0, true);
    let value = await mapSimpleV1byProxy.getValue.call(0);
    assert.equal(value, true, "Not equal to true");

    await mapSimpleV1byProxy.upgradeTo(mapSimpleV2c.address);
    await mapSimpleV1byProxy.initialize();

    value = await mapSimpleV2cbyProxy.getValue.call(0);
    assert.equal(value.toNumber(), true, "Not equal to 1");
    value = await mapSimpleV2cbyProxy.getValue.call(1);
    assert.equal(value.toNumber(), 0, "Not equal to 0");

    await mapSimpleV2cbyProxy.setValue(0, 222);
    value = await mapSimpleV2cbyProxy.getValue.call(0);
    assert.equal(value.toNumber(), 222, "Not equal to 222");
  });
});
