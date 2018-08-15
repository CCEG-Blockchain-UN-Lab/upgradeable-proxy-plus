const genericDeployOnlySafeProxyFor = require("./genericDeployOnlySafeProxyFor");

module.exports = async (...args) => {
  return genericDeployOnlySafeProxyFor("OwnedUpgradeabilityProxy", ...args);
};
