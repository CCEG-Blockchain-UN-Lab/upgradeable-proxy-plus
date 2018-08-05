const genericDeployOnlySafeProxyFor = require("./genericDeployOnlySafeProxyFor");

module.exports = async (
  checkContractInstanceByProxyAddress,
  contractInstanceToProxy
) => {
  return genericDeployOnlySafeProxyFor(
    "ProxyPlus",
    checkContractInstanceByProxyAddress,
    contractInstanceToProxy
  );
};
