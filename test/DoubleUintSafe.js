const deployContractAndSafeProxyFor = require("./helpers/deployContractAndSafeProxyFor");
const DoubleUintV1 = artifacts.require("DoubleUintV1");
const DoubleUintV2a_NewStorage = artifacts.require("DoubleUintV2a_NewStorage");

const INDENT = "      ";

contract("DoubleUint", function(accounts) {
  let doubleUintV2a_NewStorage;

  const inputValue = 10,
    inputValue2 = 21,
    inputValue3 = 32,
    inputValue4 = 43;

  beforeEach(async function() {
    let result = await Promise.all([
      DoubleUintV2a_NewStorage.new(),
      deployContractAndSafeProxyFor(DoubleUintV1).then(async cnp => {
        this.proxied = cnp.proxied;
        this.proxy = cnp.proxy;
      })
    ]);
    doubleUintV2a_NewStorage = result[0];
  });

  it("should upgrade the contract DoubleUint to version 2 with variables in reverse order", async function() {
    console.log(
      INDENT,
      "Note that smart contract upgrade to DoubleUintV2a_NewStorage fails!!!"
    );
    await this.proxied.setValue(inputValue);
    await this.proxied.setValue2(inputValue2);

    await this.proxy.upgradeTo(doubleUintV2a_NewStorage.address);
    // await this.proxied.initialize();

    let bigNumValue = await this.proxied.getValue.call();
    let value = bigNumValue.toNumber();
    assert.notEqual(
      inputValue,
      value,
      "The value should not be equal to inputValue, as expected"
    );
    assert.equal(
      inputValue2,
      value,
      "The value should be equal to inputValue2 as the variable order was changed"
    );

    bigNumValue = await this.proxied.getValue2.call();
    value = bigNumValue.toNumber();
    assert.notEqual(
      inputValue2,
      value,
      "The value should not be equal to inputValue2, as expected"
    );
    assert.equal(
      inputValue,
      value,
      "The value should be equal to inputValue as the variable order was changed"
    );

    await this.proxied.setValue(inputValue3);
    await this.proxied.setValue2(inputValue4);

    bigNumValue = await this.proxied.getValue.call();
    value = bigNumValue.toNumber();
    assert.equal(
      inputValue3,
      value,
      "The value should be equal to inputValue3 as the variable order was changed on the setter and the getter"
    );

    bigNumValue = await this.proxied.getValue2.call();
    value = bigNumValue.toNumber();
    assert.equal(
      inputValue4,
      value,
      "The value should be equal to inputValue4 as the variable order was changed on the setter and the getter"
    );
  });
});
