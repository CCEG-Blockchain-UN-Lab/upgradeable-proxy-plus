const deployContractAndSafeProxyFor = require("./helpers/deployContractAndSafeProxyFor");
const UintSimpleModularV1_Logic = artifacts.require(
  "UintSimpleModularV1_Logic"
);
const UintSimpleModularV2_Logic = artifacts.require(
  "UintSimpleModularV2_Logic"
);

const INDENT = "      ";

contract("UintSimpleModular", function(accounts) {
  let uintSimpleModularV1, uintSimpleModularV2, uintSimpleModular_byProxy;

  const inputValue = 10;

  beforeEach(async function() {
    let result = await Promise.all([
      UintSimpleModularV2_Logic.new(),
      await deployContractAndSafeProxyFor(UintSimpleModularV1_Logic).then(
        async cnp => {
          uintSimpleModular_byProxy = cnp.proxied;
          uintSimpleModularV1 = cnp.contract;
          this.proxy = cnp.proxy;
          // await uintSimpleModular_byProxy.initialize();
        }
      )
    ]);
    uintSimpleModularV2 = result[0];
  });

  it("should be able to use UintSimple_V1 like any contract", async function() {
    await uintSimpleModularV1.setValue(inputValue);
    let bigNumValue = await uintSimpleModularV1.getValue.call();
    let value = bigNumValue.toNumber();
    assert.equal(inputValue, value, "The two values should be the same");
  });

  it("should be able to use UintSimple_V2 like any contract", async function() {
    await uintSimpleModularV2.setValue(inputValue);
    let bigNumValue = await uintSimpleModularV2.getValue.call();
    let value = bigNumValue.toNumber();
    assert.equal(
      inputValue * 2,
      value,
      "The value in the contract should be twice the input value"
    );
  });

  it("should delegate call to implementation", async function() {
    await uintSimpleModular_byProxy.setValue(inputValue);
    let bigNumValue = await uintSimpleModular_byProxy.getValue.call();
    let value = bigNumValue.toNumber();
    assert.equal(inputValue, value, "The two values should be the same");
  });

  it("should upgrade the contract UintSimple to version 2 with different logic", async function() {
    await uintSimpleModular_byProxy.setValue(inputValue);
    let bigNumValue = await uintSimpleModular_byProxy.getValue.call();
    let value = bigNumValue.toNumber();
    assert.equal(inputValue, value, "The two values should be the same");

    await this.proxy.upgradeTo(uintSimpleModularV2.address);
    // await uintSimpleModular_byProxy.initialize();

    bigNumValue = await uintSimpleModular_byProxy.getValue.call();
    value = bigNumValue.toNumber();
    assert.equal(inputValue, value, "The two values should be the same");

    await uintSimpleModular_byProxy.setValue(inputValue);
    bigNumValue = await uintSimpleModular_byProxy.getValue.call();
    value = bigNumValue.toNumber();
    assert.equal(
      inputValue * 2,
      value,
      "The value in the contract should be twice the input value"
    );
  });

  it("should emit EventUpgrade on upgrade", async function() {
    let tx = await this.proxy.upgradeTo(uintSimpleModularV2.address);
    // await uintSimpleModular_byProxy.initialize();

    let upgradeLog = tx.logs[0];
    assert.equal(upgradeLog.event, "Upgraded", "First log should be Upgraded");
    assert.equal(
      upgradeLog.args.oldImplementation,
      uintSimpleModularV1.address,
      "The old target should be the deployed UintSimpleModularV1_Logic address"
    );
    assert.equal(
      upgradeLog.args.newImplementation,
      uintSimpleModularV2.address,
      "The new target should be the deployed UintSimpleModularV2_Logic address"
    );
    assert.equal(
      upgradeLog.args.admin,
      accounts[0],
      "The upgrade should be done by account[0]"
    );
  });

  it.only("should determine the differece in gas cost for regular vs. upgradeable contract call", async function() {
    let gasCosts = [];
    let tx = await uintSimpleModularV1.setValue(inputValue);
    gasCosts[0] = tx.receipt.gasUsed;
    tx = await uintSimpleModular_byProxy.setValue(inputValue);
    gasCosts[1] = tx.receipt.gasUsed;

    await this.proxy.upgradeTo(uintSimpleModularV2.address);
    // await uintSimpleModular_byProxy.initialize();

    tx = await uintSimpleModularV2.setValue(inputValue);
    gasCosts[2] = tx.receipt.gasUsed;
    tx = await uintSimpleModular_byProxy.setValue(inputValue);
    gasCosts[3] = tx.receipt.gasUsed;

    console.log(
      INDENT,
      "the gas cost of calling UintSimpleModularV1_Logic.setValue(",
      inputValue,
      ") increased by ",
      100 * (gasCosts[1] / gasCosts[0] - 1),
      "% when made upgradeable, or ",
      gasCosts[1] - gasCosts[0],
      " gas"
    );
    console.log(
      INDENT,
      "the gas cost of calling UintSimpleModularV2_Logic.setValue(",
      inputValue,
      ") increased by ",
      100 * (gasCosts[3] / gasCosts[2] - 1),
      "% when made upgradeable, or ",
      gasCosts[3] - gasCosts[2],
      " gas"
    );
  });
});
