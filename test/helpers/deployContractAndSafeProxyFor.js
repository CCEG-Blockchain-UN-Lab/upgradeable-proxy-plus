const genericDeployContractAndSafeProxyFor = require("./genericDeployContractAndSafeProxyFor");

module.exports = async (
  checkContractInstanceByProxyAddress,
  contract,
  args
) => {
  return genericDeployContractAndSafeProxyFor(
    "ProxyPlus",
    checkContractInstanceByProxyAddress,
    contract,
    args
  );
};
