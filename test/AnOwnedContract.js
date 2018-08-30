const deployContractAndSafeProxyFor = require("./helpers/deployContractAndSafeProxyFor");
const AnOwnedContract = artifacts.require("AnOwnedContract");
const AnOwnedContractV2 = artifacts.require("AnOwnedContract");

contract("AnOwnedContract", function(accounts) {
  let anOwnedContractV2;
  beforeEach(async function() {
    let result = await Promise.all([
      AnOwnedContractV2.new(),
      deployContractAndSafeProxyFor(AnOwnedContract).then(async cnp => {
        this.proxy = cnp.proxy;
        this.proxied = cnp.proxied;
      })
    ]);
    anOwnedContractV2 = result[0];
  });

  it.only("should be able to call only owner method", async function() {
    await this.proxied.anOnlyOwnerMethod();
    // await this.proxied.aRegularMethodInAnOwnedContract();
    let name = await this.proxied.getName.call();
    assert.equal(name, "Initial Name", "Not equal to inputValue");

    // await this.proxy.upgradeTo(addressSimpleV2.address);
    // // await addressSimpleV1byProxy.initialize();
    // value = await this.proxied.getValue.call();
    // assert.equal(value, inputValue, "Not equal to inputValue");
    //
    // await this.proxied.setValue(inputValue2);
    // value = await this.proxied.getValue.call();
    // assert.equal(
    //   value,
    //   "0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98",
    //   "Not equal to constant defined in function"
    // );
  });
});
