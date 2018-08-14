const deployContractAndSafeProxyFor = require("./helpers/deployContractAndSafeProxyFor");
const UintInheritedV1 = artifacts.require("UintInheritedV1");
const UintInheritedV2 = artifacts.require("UintInheritedV2");

const INDENT = "      ";

contract("UintInherited", function(accounts) {
  let uintInheritedV1, uintInheritedV2, uintInheritedV1byProxy;

  const inputValue = 10;

  beforeEach(async function() {
    let result = await Promise.all([
      UintInheritedV2.new(),
      deployContractAndSafeProxyFor(UintInheritedV1).then(async cnp => {
        uintInheritedV1byProxy = cnp.proxied;
        uintInheritedV1 = cnp.contract;
        this.proxy = cnp.proxy;
      })
    ]);
    uintInheritedV2 = result[0];
  });

  it("should upgrade the contract UintInherited to version 2 with different logic", async function() {
    await uintInheritedV1byProxy.setValue(inputValue);
    let bigNumValue = await uintInheritedV1byProxy.getValue.call();
    let value = bigNumValue.toNumber();
    assert.equal(inputValue, value, "The two values should be the same");

    await this.proxy.upgradeTo(uintInheritedV2.address);

    bigNumValue = await uintInheritedV1byProxy.getValue.call();
    value = bigNumValue.toNumber();
    assert.equal(inputValue, value, "The two values should be the same");

    await uintInheritedV1byProxy.setValue(inputValue);
    bigNumValue = await uintInheritedV1byProxy.getValue.call();
    value = bigNumValue.toNumber();
    assert.equal(
      inputValue * 2,
      value,
      "The value in the contract should be twice the input value"
    );
  });

  it("should emit EventUpgrade on upgrade", async function() {
    let tx = await this.proxy.upgradeTo(uintInheritedV2.address);

    let upgradeLog = tx.logs[0];
    assert.equal(
      upgradeLog.event,
      "Upgraded",
      "First log should be EventUpgrade"
    );
    assert.equal(
      upgradeLog.args.oldImplementation,
      uintInheritedV1.address,
      "The old target should be the deployed UintInheritedV1 address"
    );
    assert.equal(
      upgradeLog.args.newImplementation,
      uintInheritedV2.address,
      "The new target should be the deployed UintInheritedV2 address"
    );
    assert.equal(
      upgradeLog.args.admin,
      accounts[0],
      "The upgrade should be done by account[0]"
    );
  });

  it("should determine the differece in gas cost for regular vs. upgradeable contract call", async function() {
    let gasCosts = [];
    let tx = await uintInheritedV1.setValue(inputValue);
    gasCosts[0] = tx.receipt.gasUsed;
    tx = await uintInheritedV1byProxy.setValue(inputValue);
    gasCosts[1] = tx.receipt.gasUsed;

    await this.proxy.upgradeTo(uintInheritedV2.address);

    tx = await uintInheritedV2.setValue(inputValue);
    gasCosts[2] = tx.receipt.gasUsed;
    tx = await uintInheritedV1byProxy.setValue(inputValue);
    gasCosts[3] = tx.receipt.gasUsed;

    console.log(
      INDENT,
      "the gas cost of calling UintInheritedV1.setValue(",
      inputValue,
      ") increased by ",
      100 * (gasCosts[1] / gasCosts[0] - 1),
      "% when made upgradeable, or ",
      gasCosts[1] - gasCosts[0],
      " gas"
    );
    console.log(
      INDENT,
      "the gas cost of calling UintInheritedV2.setValue(",
      inputValue,
      ") increased by ",
      100 * (gasCosts[3] / gasCosts[2] - 1),
      "% when made upgradeable, or ",
      gasCosts[3] - gasCosts[2],
      " gas"
    );
  });
});
