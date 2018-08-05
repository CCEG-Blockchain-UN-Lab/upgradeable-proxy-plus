const deployContractAndSafeProxyFor = require("./helpers/deployContractAndSafeProxyFor");
const deployOnlyProxyFor = require("./helpers/deployOnlyProxyFor");
const CheckContract = artifacts.require("CheckContract");
const UintEventV1 = artifacts.require("UintEventV1Safe");
const UintEventV2a_RemovedEvent = artifacts.require(
  "UintEventV2a_RemovedEventSafe"
);
const UintEventV2b_EventReordered = artifacts.require(
  "UintEventV2b_EventReorderedSafe"
);

contract("UintEventSafe", function(accounts) {
  let uintEventV2a_RemovedEvent,
    uintEventV2b_EventReordered,
    uintEventV1byProxy;

  const inputValue = 10;

  beforeEach(async function() {
    let result = await Promise.all([
      UintEventV2a_RemovedEvent.new(),
      UintEventV2b_EventReordered.new(),
      deployOnlyProxyFor(await CheckContract.deployed()).then(async ci => {
        let checkContractInstanceByProxyAddress = ci.proxied.address;
        await deployContractAndSafeProxyFor(
          checkContractInstanceByProxyAddress,
          UintEventV1
        ).then(async cnp => {
          uintEventV1byProxy = cnp.proxied;
          await uintEventV1byProxy.initialize();
        });
      })
    ]);
    uintEventV2a_RemovedEvent = result[0];
    uintEventV2b_EventReordered = result[1];
  });

  it("should upgrade the contract UintEvent to version 2a with event removed", async function() {
    let tx = await uintEventV1byProxy.setValue(inputValue);
    let valueChangedLog = tx.logs[0];
    assert.equal(
      valueChangedLog.event,
      "EventValueChanged",
      "First log should be EventValueChanged"
    );
    assert.equal(
      valueChangedLog.args.newValue.toNumber(),
      inputValue,
      "The new value should be inputValue"
    );

    await uintEventV1byProxy.upgradeTo(uintEventV2a_RemovedEvent.address);
    await uintEventV1byProxy.initialize();

    tx = await uintEventV1byProxy.setValue(inputValue);
    valueChangedLog = tx.logs[0];
    assert.strictEqual(
      valueChangedLog,
      undefined,
      "There should be no event emitted"
    );
  });

  it("should upgrade the contract UintEvent to version 2b with events in reverse order", async function() {
    let tx = await uintEventV1byProxy.setValue(inputValue);
    let valueChangedLog = tx.logs[0];
    assert.equal(
      valueChangedLog.event,
      "EventValueChanged",
      "First log should be EventValueChanged"
    );
    assert.equal(
      valueChangedLog.args.newValue.toNumber(),
      inputValue,
      "The new value should be inputValue"
    );

    await uintEventV1byProxy.upgradeTo(uintEventV2b_EventReordered.address);
    await uintEventV1byProxy.initialize();

    tx = await uintEventV1byProxy.setValue(inputValue);
    valueChangedLog = tx.logs[0];
    assert.equal(
      valueChangedLog.event,
      "EventValueChanged",
      "First log should be EventValueChanged"
    );
    assert.equal(
      valueChangedLog.args.newValue.toNumber(),
      inputValue,
      "The new value should be inputValue"
    );
  });
});
