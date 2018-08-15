const deployContractAndSafeProxyFor = require("./helpers/deployContractAndSafeProxyFor");
const UintOwnableV1 = artifacts.require("UintOwnableV1");
const UintOwnableV2 = artifacts.require("UintOwnableV2");

contract("UintOwnable", function(accounts) {
  let uintOwnableV1, uintOwnableV2, uintOwnableV1byProxy;

  const inputValue = 10;

  beforeEach(async function() {
    let result = await Promise.all([
      UintOwnableV2.new(),
      await deployContractAndSafeProxyFor(UintOwnableV1).then(async cnp => {
        uintOwnableV1 = cnp.contract;
        uintOwnableV1byProxy = cnp.proxied;
        this.proxy = cnp.proxy;
      })
    ]);
    uintOwnableV2 = result[0];
  });

  it("should upgrade the contract UintOwnable to version 2 with different logic", async function() {
    await uintOwnableV1byProxy.setValue(inputValue);
    let bigNumValue = await uintOwnableV1byProxy.getValue.call();
    let value = bigNumValue.toNumber();
    assert.equal(inputValue, value, "The two values should be the same");

    await this.proxy.upgradeTo(uintOwnableV2.address);
    // await uintOwnableV1byProxy.initialize();

    bigNumValue = await uintOwnableV1byProxy.getValue.call();
    value = bigNumValue.toNumber();
    assert.equal(inputValue, value, "The two values should be the same");

    await uintOwnableV1byProxy.setValue(inputValue);
    bigNumValue = await uintOwnableV1byProxy.getValue.call();
    value = bigNumValue.toNumber();
    assert.equal(
      inputValue * 2,
      value,
      "The value in the contract should be twice the input value"
    );
  });

  it("should emit EventUpgrade on upgrade", async function() {
    let tx = await this.proxy.upgradeTo(uintOwnableV2.address);
    // await uintOwnableV1byProxy.initialize();

    let upgradeLog = tx.logs[0];
    assert.equal(upgradeLog.event, "Upgraded", "First log should be Upgraded");
    assert.equal(
      upgradeLog.args.oldImplementation,
      uintOwnableV1.address,
      "The old target should be the deployed UintOwnableV1 address"
    );
    assert.equal(
      upgradeLog.args.newImplementation,
      uintOwnableV2.address,
      "The new target should be the deployed UintOwnableV2 address"
    );
    assert.equal(
      upgradeLog.args.admin,
      accounts[0],
      "The upgrade should be done by account[0]"
    );
  });

  it("should fail to upgrade the contract if upgradeTo() is not called by the proxy owner", async function() {
    let ownerAddress = await this.proxy.proxyOwner.call();
    assert.equal(
      ownerAddress,
      accounts[0],
      "The owner of the proxy should be accounts[0]"
    );

    await this.proxy.upgradeTo(uintOwnableV2.address, {
      from: accounts[0]
    });
    // await uintOwnableV1byProxy.initialize();

    try {
      await this.proxy.upgradeTo(uintOwnableV1.address, {
        from: accounts[1]
      });
      throw new Error("This error should not happen");
    } catch (error) {
      assert.equal(
        error.message,
        "VM Exception while processing transaction: revert",
        "upgradeTo() can only be called by the proxy owner"
      );
    }
  });

  it("should by able to transfer ownership so that account[1] can call upgradeTo()", async function() {
    let ownerAddress = await this.proxy.proxyOwner.call();
    assert.equal(
      ownerAddress,
      accounts[0],
      "The owner of the proxy should be accounts[0]"
    );

    await this.proxy.transferProxyOwnership(accounts[1]);
    ownerAddress = await this.proxy.proxyOwner.call();
    assert.equal(
      ownerAddress,
      accounts[1],
      "The owner of the proxy should now be accounts[1]"
    );

    await this.proxy.upgradeTo(uintOwnableV2.address, {
      from: accounts[1]
    });
    // await uintOwnableV1byProxy.initialize();

    try {
      await this.proxy.upgradeTo(uintOwnableV1.address, {
        from: accounts[0]
      });
      throw new Error("This error should not happen");
    } catch (error) {
      assert.equal(
        error.message,
        "VM Exception while processing transaction: revert",
        "upgradeTo() can only be called by the proxy owner"
      );
    }
  });
});
