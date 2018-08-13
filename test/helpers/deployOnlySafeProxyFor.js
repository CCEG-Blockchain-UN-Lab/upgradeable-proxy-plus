const genericDeployOnlySafeProxyFor = require("./genericDeployOnlySafeProxyFor");

module.exports = async contractInstanceToProxy => {
  return genericDeployOnlySafeProxyFor(
    "OwnedUpgradeabilityProxy",
    contractInstanceToProxy
  );
};
