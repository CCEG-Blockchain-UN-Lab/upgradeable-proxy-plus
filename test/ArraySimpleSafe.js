const deployContractAndSafeProxyFor = require("./helpers/deployContractAndSafeProxyFor");
const deployOnlySafeProxyFor = require("./helpers/deployOnlySafeProxyFor");
const ArraySimpleV1a = artifacts.require("ArraySimpleV1a");
const ArraySimpleV1b = artifacts.require("ArraySimpleV1b");
const ArraySimpleV2a = artifacts.require("ArraySimpleV2a");
const ArraySimpleV2a_ExtraValue = artifacts.require(
  "ArraySimpleV2a_ExtraValue"
);
const ArraySimpleV2b = artifacts.require("ArraySimpleV2b");

const INDENT = "      ";

contract("ArraySimple", function(accounts) {
  let proxy,
    arraySimpleV1a,
    arraySimpleV1b,
    arraySimpleV2a,
    arraySimpleV2a_ExtraValue,
    arraySimpleV2b,
    arraySimpleV2a_ExtraValuebyProxy,
    arraySimpleV1bbyProxy;

  const inputValues = [11, 22, 33],
    inputValues2 = [12, 23, 34];

  beforeEach(async function() {
    let result = await Promise.all([
      ArraySimpleV1b.new(),
      ArraySimpleV2a.new(),
      ArraySimpleV2a_ExtraValue.new(),
      ArraySimpleV2b.new(),
      await deployContractAndSafeProxyFor(ArraySimpleV1a).then(async cnp => {
        this.proxy = cnp.proxy;
        this.proxied = cnp.proxied;
        arraySimpleV1a = cnp.contract;
        arraySimpleV2a_ExtraValuebyProxy = ArraySimpleV2a_ExtraValue.at(
          this.proxy.address
        );
        // await this.proxied.initialize();
      })
    ]);
    arraySimpleV1b = result[0];
    arraySimpleV2a = result[1];
    arraySimpleV2a_ExtraValue = result[2];
    arraySimpleV2b = result[3];
  });

  function parseBigNumberArray(bnArray) {
    for (let i = 0; i < bnArray.length; i++) {
      bnArray[i] = bnArray[i].toNumber();
    }
  }

  it("should be able to upgrade fixed size array function", async function() {
    await this.proxied.setValues(inputValues);
    let values = await this.proxied.getValues.call();
    parseBigNumberArray(values);
    assert.deepEqual(values, inputValues, "Not equal to inputValues");

    await this.proxy.upgradeTo(arraySimpleV2a.address);
    // await this.proxied.initialize();
    values = await this.proxied.getValues.call();
    parseBigNumberArray(values);
    assert.deepEqual(values, inputValues, "Not equal to inputValues");

    await this.proxied.setValues(inputValues2);
    values = await this.proxied.getValues.call();
    parseBigNumberArray(values);
    assert.deepEqual(
      values,
      [1, 2, 3],
      "Not equal to constant defined in function"
    );
  });

  it("should not be able to use ABI for function that accesses storage that does not exist", async function() {
    console.log(
      INDENT,
      "Note that smart contract array change arraySimpleV2a_ExtraValue fails!!!"
    );
    try {
      await arraySimpleV2a_ExtraValuebyProxy.setValues([1, 2, 3, 4]);
      throw new Error("This error should not happen");
    } catch (error) {
      assert.equal(
        error.message,
        "VM Exception while processing transaction: revert",
        "upgradeTo() can only be called by the proxy owner"
      );
    }
  });

  it("should not be able to upgrade to function that increases fixed array size", async function() {
    console.log(
      INDENT,
      "Note that smart contract array change arraySimpleV2a_ExtraValue fails!!!"
    );
    await this.proxy.upgradeTo(arraySimpleV2a_ExtraValue.address);
    // await this.proxied.initialize();
    await arraySimpleV2a_ExtraValuebyProxy.setValues([1, 2, 3, 4]);

    let values = await this.proxied.getValues.call();
    parseBigNumberArray(values);
    assert.deepEqual(
      values,
      [1, 2, 3],
      "Should only equal the first 3 values of the input"
    );
  });

  it("should not be able to upgrade a fixed size array to a dynamic array", async function() {
    console.log(
      INDENT,
      "Note that smart contract array change arraySimpleV1b fails!!!"
    );
    await this.proxied.setValues(inputValues);
    let values = await this.proxied.getValues.call();
    parseBigNumberArray(values);
    assert.deepEqual(values, inputValues, "Not equal to inputValues");

    await this.proxy.upgradeTo(arraySimpleV1b.address);
    arraySimpleV1bbyProxy = ArraySimpleV1b.at(this.proxy.address);
    // await arraySimpleV1bbyProxy.initialize();

    values = await this.proxied.getValues.call();
    parseBigNumberArray(values);
    assert.notDeepEqual(values, inputValues, "Equal to inputValues"); // Note that values are not correct here

    await arraySimpleV1bbyProxy.setValues(inputValues2);
    values = await arraySimpleV1bbyProxy.getValues.call();
    parseBigNumberArray(values);
    assert.deepEqual(values, inputValues2, "Not equal to inputValues2");
  });

  it("should be able to upgrade a dynamic size array function", async function() {
    let pi = await deployOnlySafeProxyFor(arraySimpleV1b);
    arraySimpleV1bbyProxy = pi.proxied;
    // await arraySimpleV1bbyProxy.initialize();

    await arraySimpleV1bbyProxy.setValues(inputValues);
    let values = await arraySimpleV1bbyProxy.getValues.call();
    parseBigNumberArray(values);
    assert.deepEqual(values, inputValues, "Not equal to inputValues");

    await pi.proxy.upgradeTo(arraySimpleV2b.address);
    // await arraySimpleV1bbyProxy.initialize();

    values = await arraySimpleV1bbyProxy.getValues.call();
    parseBigNumberArray(values);
    assert.deepEqual(values, inputValues, "Not equal to inputValues");

    await arraySimpleV1bbyProxy.setValues(inputValues2);
    values = await arraySimpleV1bbyProxy.getValues.call();
    parseBigNumberArray(values);
    assert.deepEqual(
      values,
      [1, 2, 3],
      "Not equal to constant defined in function"
    );
  });

  it("should not be able to upgrade a dynamic size array to a static array", async function() {
    console.log(
      INDENT,
      "Note that smart contract array change arraySimpleV1a fails!!!"
    );
    let pi = await deployOnlySafeProxyFor(arraySimpleV1b);
    proxy = pi.proxy;
    arraySimpleV1bbyProxy = pi.proxied;
    // await arraySimpleV1bbyProxy.initialize();

    await arraySimpleV1bbyProxy.setValues(inputValues);
    let values = await arraySimpleV1bbyProxy.getValues.call();
    parseBigNumberArray(values);
    assert.deepEqual(values, inputValues, "Not equal to inputValues");

    await proxy.upgradeTo(arraySimpleV1a.address);
    // await arraySimpleV1bbyProxy.initialize();
    let proxied = ArraySimpleV1a.at(proxy.address);

    values = await proxied.getValues.call();
    parseBigNumberArray(values);
    assert.notDeepEqual(values, inputValues, "Equal to inputValues"); // Note that values are not correct here

    await proxied.setValues(inputValues2);
    values = await proxied.getValues.call();
    parseBigNumberArray(values);
    assert.deepEqual(values, inputValues2, "Not equal to inputValues2");
  });
});
