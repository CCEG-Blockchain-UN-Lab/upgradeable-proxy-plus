const deployContractAndSafeProxyFor = require("./helpers/deployContractAndSafeProxyFor");
const deployOnlySafeProxyFor = require("./helpers/deployOnlySafeProxyFor");
const encodeWithSignature = require("./helpers/encodeWithSignature");
const UintInitializeV1a_NotInitialized = artifacts.require(
  "UintInitializeV1a_NotInitialized"
);
const UintInitializeV1b_Initialized = artifacts.require(
  "UintInitializeV1b_Initialized"
);
const UintInitializeV2 = artifacts.require("UintInitializeV2");
const UintInitializeV3 = artifacts.require("UintInitializeV3");

const INDENT = "      ";

contract("UintInitialize", function(accounts) {
  let uintInitializeV1a_NotInitialized,
    uintInitializeV1b_Initialized,
    uintInitializeV2,
    uintInitializeV3,
    uintInitializebyProxy;

  beforeEach(async function() {
    let result = await Promise.all([
      UintInitializeV1b_Initialized.new(),
      UintInitializeV2.new(),
      UintInitializeV3.new(),
      deployContractAndSafeProxyFor(UintInitializeV1a_NotInitialized).then(
        async cnp => {
          uintInitializebyProxy = cnp.proxied;
          uintInitializeV1a_NotInitialized = cnp.contract;
          this.proxy = cnp.proxy;
          // await uintInitializebyProxy.initialize();
        }
      )
    ]);
    uintInitializeV1b_Initialized = result[0];
    uintInitializeV2 = result[1];
    uintInitializeV3 = result[2];
  });

  it("should not initialize if the variable is set in the contract", async function() {
    console.log(
      INDENT,
      "Note that smart contract initialization of UintInitializeV1a_NotInitialized fails!!!"
    );

    let value = await uintInitializebyProxy.getValue.call();
    assert.equal(value.toNumber(), 0, "value should not be initialized");
  });

  it("should be initialize if the variable is set in initialize()", async function() {
    let pi = await deployOnlySafeProxyFor(
      uintInitializeV1b_Initialized,
      encodeWithSignature("initialize()")
    );
    uintInitializebyProxy = pi.proxied;

    let value = await uintInitializebyProxy.getValue.call();

    assert.equal(value.toNumber(), 111, "value should be initialized");
  });

  it("should initialize value on upgradeToAndCall", async function() {
    await this.proxy.upgradeToAndCall(
      uintInitializeV1b_Initialized.address,
      encodeWithSignature("initialize()")
    );

    let value = await uintInitializebyProxy.getValue.call();

    assert.equal(value.toNumber(), 111, "value should be initialized");
  });

  it("should initialize value on upgradeToAndCall with initialize arguments", async function() {
    await this.proxy.upgradeToAndCall(
      uintInitializeV3.address,
      encodeWithSignature("initialize(uint256)", "23")
    );

    let value = await uintInitializebyProxy.getValue.call();

    assert.equal(value.toNumber(), 23, "value should be initialized");
  });

  // it.only("should emmit EventInitialized when calling initialize()", async function() {
  //   let pi = await deployOnlySafeProxyFor(
  //     uintInitializeV1a_NotInitialized,
  //     encodeWithSignature("initialize()")
  //   );
  //   let proxy = pi.proxy;
  //   uintInitializebyProxy = pi.proxied;
  //
  //   let events = initializationTx.logs;
  //   assert.equal(
  //     events[0].event,
  //     "EventInitialized",
  //     "Should initialize contract on create"
  //   );
  //   assert.equal(
  //     events[0].args.target,
  //     uintInitializeV1a_NotInitialized.address,
  //     "Should initialize the Uint v1a contract"
  //   );
  //
  //   await proxy.upgradeToAndCall(
  //     uintInitializeV1b_Initialized.address,
  //     encodeWithSignature("initialize()")
  //   );
  //   events = initializationTx.logs;
  //   assert.equal(
  //     events[0].event,
  //     "EventInitialized",
  //     "Should initialize contract on upgradeTo()"
  //   );
  //   assert.equal(
  //     events[0].args.target,
  //     uintInitializeV1b_Initialized.address,
  //     "Should initialize the Uint v1b contract"
  //   );
  // });
  //
  // it("should only be able to initialize the contract through the proxy once", async function() {
  //   let initialized = await uintInitializebyProxy.initialized(
  //     uintInitializeV1a_NotInitialized.address
  //   );
  //   assert(
  //     initialized,
  //     "target uintInitializeV1a_NotInitialized should be initialized"
  //   );
  //
  //   await this.proxy.upgradeTo(uintInitializeV1b_Initialized.address); // upgrade to 1b
  //   initialized = await uintInitializebyProxy.initialized(
  //     uintInitializeV1b_Initialized.address
  //   );
  //   assert(
  //     !initialized,
  //     "target uintInitializeV1b_Initialized should not be initialized yet"
  //   );
  //   // await uintInitializebyProxy.initialize();
  //   initialized = await uintInitializebyProxy.initialized(
  //     uintInitializeV1b_Initialized.address
  //   );
  //   assert(
  //     initialized,
  //     "target uintInitializeV1b_Initialized should now be initialized"
  //   );
  //
  //   await this.proxy.upgradeTo(uintInitializeV1a_NotInitialized.address); // revert back to v1a
  //   initialized = await uintInitializebyProxy.initialized(
  //     uintInitializeV1a_NotInitialized.address
  //   );
  //   assert(
  //     initialized,
  //     "target uintInitializeV1a_NotInitialized should be initialized "
  //   );
  //   try {
  //     // await uintInitializebyProxy.initialize();
  //     initialized = await uintInitializebyProxy.initialized(
  //       uintInitializeV1a_NotInitialized.address
  //     );
  //     throw new Error("This error should not happen");
  //   } catch (error) {
  //     assert.equal(
  //       error.message,
  //       "VM Exception while processing transaction: revert",
  //       "should not be able to initialize again"
  //     );
  //   }
  // });
  //
  // it("should not initialize a contract values again on being upgraded to again", async function() {
  //   await this.proxy.upgradeTo(uintInitializeV1b_Initialized.address);
  //   // await uintInitializebyProxy.initialize();
  //   await this.proxy.upgradeTo(uintInitializeV2.address);
  //   // await uintInitializebyProxy.initialize();
  //   await this.proxy.upgradeTo(uintInitializeV1b_Initialized.address); // cannot be initialized again
  //   try {
  //     // await uintInitializebyProxy.initialize();
  //     throw new Error("This error should not happen");
  //   } catch (error) {
  //     assert.equal(
  //       error.message,
  //       "VM Exception while processing transaction: revert",
  //       "should not be able to initialize again"
  //     );
  //   }
  //   let value = await uintInitializebyProxy.getValue.call();
  //   assert.equal(
  //     value.toNumber(),
  //     222,
  //     "value should be what was initialized by UintInitializeV2"
  //   );
  // });
  //
  // it("should be able to atomically initialize the contract with upgradeTo()", async function() {
  //   let initialized = await uintInitializebyProxy.initialized(
  //     uintInitializeV1a_NotInitialized.address
  //   );
  //   assert(
  //     initialized,
  //     "target uintInitializeV1a_NotInitialized should be initialized"
  //   );
  //
  //   // let initializeTx = await uintInitializebyProxy.initialize.request();
  //   let initializeData = initializeTx.params[0].data;
  //   let initializeSignature = web3.sha3("initialize()").substring(0, 10);
  //   assert.equal(
  //     initializeData,
  //     initializeSignature,
  //     "initialization data does not equal signature"
  //   );
  //
  //   initialized = await uintInitializebyProxy.initialized(
  //     uintInitializeV1b_Initialized.address
  //   );
  //   assert(
  //     !initialized,
  //     "target uintInitializeV1b_Initialized should not be initialized yet"
  //   );
  //
  //   const upgradeToOverloadedAbi = {
  //     constant: false,
  //     inputs: [
  //       {
  //         name: "_target",
  //         type: "address"
  //       },
  //       {
  //         name: "_data",
  //         type: "bytes"
  //       }
  //     ],
  //     name: "upgradeTo",
  //     outputs: [],
  //     payable: false,
  //     stateMutability: "nonpayable",
  //     type: "function"
  //   };
  //   let upgradeToTransactionData = web3Abi.encodeFunctionCall(
  //     upgradeToOverloadedAbi,
  //     [uintInitializeV1b_Initialized.address, initializeData]
  //   );
  //   // let upgradeToTransactionData = web3.eth.encodeFunctionCall(upgradeToOverloadedAbi, [uintInitializeV1b_Initialized.address, initializeData]); // needs web3 v1.0
  //   await web3.eth.sendTransaction({
  //     from: accounts[0],
  //     to: uintInitializebyProxy.address,
  //     data: upgradeToTransactionData,
  //     value: 0
  //   });
  //   // await this.proxy.upgradeTo(uintInitializeV1b_Initialized.address, initializeData) // upgrade to 1b // overloaded function not usupported
  //   initialized = await uintInitializebyProxy.initialized(
  //     uintInitializeV1b_Initialized.address
  //   );
  //   assert(
  //     initialized,
  //     "target uintInitializeV1b_Initialized should be initialized"
  //   );
  //
  //   let value = await uintInitializebyProxy.getValue.call();
  //   assert.equal(
  //     value.toNumber(),
  //     111,
  //     "value should be what was initialized by UintInitializeV2"
  //   );
  //
  //   upgradeToTransactionData = web3Abi.encodeFunctionCall(
  //     upgradeToOverloadedAbi,
  //     [uintInitializeV1a_NotInitialized.address, initializeData]
  //   );
  //   // upgradeToTransactionData = web3.eth.encodeFunctionCall(upgradeToOverloadedAbi, [uintInitializeV1a_NotInitialized.address, initializeData]); // needs web3 v1.0
  //   try {
  //     await web3.eth.sendTransaction({
  //       from: accounts[0],
  //       to: uintInitializebyProxy.address,
  //       data: upgradeToTransactionData,
  //       value: 0
  //     });
  //     // await this.proxy.upgradeTo(uintInitializeV1a_NotInitialized.address, initializeData) // revert back to v1a // overloaded function not usupported
  //     throw new Error("This error should not happen");
  //   } catch (error) {
  //     assert.equal(
  //       error.message,
  //       "VM Exception while processing transaction: invalid opcode",
  //       "should not be able to initialize again when upgradeing"
  //     );
  //   }
  //
  //   await this.proxy.upgradeTo(uintInitializeV1a_NotInitialized.address); // revert back to v1a
  // });
  //
  // it("should be able to atomically initialize the contract with upgradeTo() for an initialize function with arguments", async function() {
  //   let initialized = await uintInitializebyProxy.initialized(
  //     uintInitializeV1a_NotInitialized.address
  //   );
  //   assert(
  //     initialized,
  //     "target uintInitializeV1a_NotInitialized should be initialized"
  //   );
  //
  //   initialized = await uintInitializebyProxy.initialized(
  //     uintInitializeV3.address
  //   );
  //   assert(
  //     !initialized,
  //     "target uintInitializeV3 should not be initialized yet"
  //   );
  //
  //   const initializeOverloadedAbi = {
  //     constant: false,
  //     inputs: [
  //       {
  //         name: "_valu",
  //         type: "uint256"
  //       }
  //     ],
  //     name: "initialize",
  //     outputs: [],
  //     payable: false,
  //     stateMutability: "nonpayable",
  //     type: "function"
  //   };
  //   let initializeTransactionData = web3Abi.encodeFunctionCall(
  //     initializeOverloadedAbi,
  //     [777]
  //   );
  //
  //   const upgradeToOverloadedAbi = {
  //     constant: false,
  //     inputs: [
  //       {
  //         name: "_target",
  //         type: "address"
  //       },
  //       {
  //         name: "_data",
  //         type: "bytes"
  //       }
  //     ],
  //     name: "upgradeTo",
  //     outputs: [],
  //     payable: false,
  //     stateMutability: "nonpayable",
  //     type: "function"
  //   };
  //   let upgradeToTransactionData = web3Abi.encodeFunctionCall(
  //     upgradeToOverloadedAbi,
  //     [uintInitializeV3.address, initializeTransactionData]
  //   );
  //
  //   await web3.eth.sendTransaction({
  //     from: accounts[0],
  //     to: uintInitializebyProxy.address,
  //     data: upgradeToTransactionData,
  //     value: 0
  //   });
  //   // await this.proxy.upgradeTo(uintInitializeV1b_Initialized.address, initializeData) // upgrade to 1b
  //   initialized = await uintInitializebyProxy.initialized(
  //     uintInitializeV3.address
  //   );
  //   assert(initialized, "target uintInitializeV3 should be initialized");
  //
  //   let value = await uintInitializebyProxy.getValue.call();
  //   assert.equal(
  //     value.toNumber(),
  //     777,
  //     "value should be what was initialized by UintInitializeV2"
  //   );
  // });
});
