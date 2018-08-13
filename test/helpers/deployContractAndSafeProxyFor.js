const genericDeployContractAndSafeProxyFor = require("./genericDeployContractAndSafeProxyFor");

module.exports = async (contract, args) => {
  return genericDeployContractAndSafeProxyFor(
    "OwnedUpgradeabilityProxy",
    contract,
    args
  );
};
