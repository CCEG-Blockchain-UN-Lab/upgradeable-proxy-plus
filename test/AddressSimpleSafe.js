const deployContractAndSafeProxyFor = require("./helpers/deployContractAndSafeProxyFor");
const AddressSimpleV1 = artifacts.require("AddressSimpleV1");
const AddressSimpleV2 = artifacts.require("AddressSimpleV2");

contract("AddressSimple", function(accounts) {
  let addressSimpleV2;

  const inputValue = "0xa4532e9f6f9c4e4abb89bdbb73d3003210ede61c",
    inputValue2 = "0x5c28D962c93282C6Fbe820f9AB33844D96b4853e";

  beforeEach(async function() {
    let result = await Promise.all([
      AddressSimpleV2.new(),
      await deployContractAndSafeProxyFor(AddressSimpleV1).then(async cnp => {
        this.proxy = cnp.proxy;
        this.proxied = cnp.proxied;
      })
    ]);
    addressSimpleV2 = result[0];
  });

  it("should be able to upgrade to new address function", async function() {
    await this.proxied.setValue(inputValue);
    let value = await this.proxied.getValue.call();
    assert.equal(value, inputValue, "Not equal to inputValue");

    await this.proxy.upgradeTo(addressSimpleV2.address);
    // await addressSimpleV1byProxy.initialize();
    value = await this.proxied.getValue.call();
    assert.equal(value, inputValue, "Not equal to inputValue");

    await this.proxied.setValue(inputValue2);
    value = await this.proxied.getValue.call();
    assert.equal(
      value,
      "0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98",
      "Not equal to constant defined in function"
    );
  });
});
