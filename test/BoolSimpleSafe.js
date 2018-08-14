const deployContractAndSafeProxyFor = require("./helpers/deployContractAndSafeProxyFor");
const BoolSimpleV1 = artifacts.require("BoolSimpleV1");
const BoolSimpleV2 = artifacts.require("BoolSimpleV2");

contract("BoolSimple", function(accounts) {
  let boolSimpleV2;

  beforeEach(async function() {
    let result = await Promise.all([
      BoolSimpleV2.new(),
      deployContractAndSafeProxyFor(BoolSimpleV1).then(async cnp => {
        this.proxied = cnp.proxied;
        this.proxy = cnp.proxy;
        // await this.proxied.initialize();
      })
    ]);
    boolSimpleV2 = result[0];
  });

  it("should be able to upgrade to new bool function", async function() {
    await this.proxied.setValue(true);
    let value = await this.proxied.getValue.call();
    assert.equal(value, true, "Not equal to true");

    await this.proxy.upgradeTo(boolSimpleV2.address);
    // await this.proxied.initialize();

    value = await this.proxied.getValue.call();
    assert.equal(value, true, "Not equal to true");

    await this.proxied.setValue(true);
    value = await this.proxied.getValue.call();
    assert.equal(value, false, "Not equal to false");
  });
});
