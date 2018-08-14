const deployContractAndSafeProxyFor = require("./helpers/deployContractAndSafeProxyFor");
const deployOnlySafeProxyFor = require("./helpers/deployOnlySafeProxyFor");
const UintFallbackV1 = artifacts.require("UintFallbackV1");
const UintFallbackV2 = artifacts.require("UintFallbackV2");
const UintFallbackV3 = artifacts.require("UintFallbackV3");
const UintFallbackV4 = artifacts.require("UintFallbackV4");

contract("UintFallback", function(accounts) {
  let uintFallbackV1,
    uintFallbackV2,
    uintFallbackV3,
    uintFallbackV4,
    uintFallbackbyProxy;

  beforeEach(async function() {
    let result = await Promise.all([
      UintFallbackV2.new(),
      UintFallbackV3.new(),
      UintFallbackV4.new(),
      deployContractAndSafeProxyFor(UintFallbackV1).then(async cnp => {
        uintFallbackbyProxy = cnp.proxied;
        uintFallbackV1 = cnp.contract;
        this.proxy = cnp.proxy;
        // await uintFallbackbyProxy.initialize();
      })
    ]);
    uintFallbackV2 = result[0];
    uintFallbackV3 = result[1];
    uintFallbackV4 = result[2];
  });

  it("should be able to send upgrade the contract's fallback function to set new value", async function() {
    await web3.eth.sendTransaction({
      to: uintFallbackbyProxy.address,
      from: accounts[0],
      value: 0
    });
    let value = await uintFallbackbyProxy.getValue.call();
    assert.equal(value.toNumber(), 10, "The value should be 10");

    await this.proxy.upgradeTo(uintFallbackV2.address);
    // await uintFallbackbyProxy.initialize();

    value = await uintFallbackbyProxy.getValue.call();
    assert.equal(value.toNumber(), 10, "The value should be 10");

    await web3.eth.sendTransaction({
      to: uintFallbackbyProxy.address,
      from: accounts[0],
      value: 0
    });
    value = await uintFallbackbyProxy.getValue.call();
    assert.equal(value.toNumber(), 20, "The value should be 20");
  });

  it("should be able to send upgrade the contract's fallback function to revert", async function() {
    await web3.eth.sendTransaction({
      to: uintFallbackbyProxy.address,
      from: accounts[0],
      value: 0
    });
    let value = await uintFallbackbyProxy.getValue.call();
    assert.equal(value.toNumber(), 10, "The value should be 10");

    await this.proxy.upgradeTo(uintFallbackV3.address);
    // await uintFallbackbyProxy.initialize();

    value = await uintFallbackbyProxy.getValue.call();
    assert.equal(value.toNumber(), 10, "The value should be 10");

    try {
      await web3.eth.sendTransaction({
        to: uintFallbackbyProxy.address,
        from: accounts[0],
        value: 0
      });
      throw new Error("This error should not happen");
    } catch (error) {
      assert.equal(
        error.message,
        "VM Exception while processing transaction: revert",
        "() should revert"
      );
    }
  });

  it("should not be able to pay a non-payable upgradeable contract's fallback function", async function() {
    try {
      await web3.eth.sendTransaction({
        to: uintFallbackbyProxy.address,
        from: accounts[0],
        value: 10
      });
      throw new Error("This error should not happen");
    } catch (error) {
      assert.equal(
        error.message,
        "VM Exception while processing transaction: revert",
        "() should revert"
      );
    }
  });

  it("should be able to pay a payable upgradeable contract's fallback function", async function() {
    let pi = await deployOnlySafeProxyFor(uintFallbackV4);
    let proxy = pi.proxy;
    uintFallbackbyProxy = UintFallbackV1.at(proxy.address);
    // await uintFallbackbyProxy.initialize();

    await web3.eth.sendTransaction({
      to: uintFallbackbyProxy.address,
      from: accounts[0],
      value: 32
    });
    let value = await uintFallbackbyProxy.getValue.call();
    assert.equal(value.toNumber(), 32, "The value should be msg.value");
  });

  it("should not be able to pay a non-payable upgradeable contract's fallback function after upgraded from a payable one", async function() {
    let pi = await deployOnlySafeProxyFor(uintFallbackV4);
    let proxy = pi.proxy;
    uintFallbackbyProxy = UintFallbackV1.at(proxy.address);
    // await uintFallbackbyProxy.initialize();

    await proxy.upgradeTo(uintFallbackV1.address);

    try {
      await web3.eth.sendTransaction({
        to: uintFallbackbyProxy.address,
        from: accounts[0],
        value: 10
      });
      throw new Error("This error should not happen");
    } catch (error) {
      assert.equal(
        error.message,
        "VM Exception while processing transaction: revert",
        "() should revert"
      );
    }
  });

  it.only("should be able to pay a payable upgradeable contract's fallback function after upgraded from a non-payable one", async function() {
    await this.proxy.upgradeTo(uintFallbackV4.address);
    // await uintFallbackbyProxy.initialize();

    await web3.eth.sendTransaction({
      to: uintFallbackbyProxy.address,
      from: accounts[0],
      value: 32
    });
    let value = await uintFallbackbyProxy.getValue.call();
    assert.equal(value.toNumber(), 32, "The value should be msg.value");
  });
});
