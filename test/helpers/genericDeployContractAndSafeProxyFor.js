const genericDeployOnlySafeProxyFor = require("./genericDeployOnlySafeProxyFor");

module.exports = async (proxyName, contract, args) => {
  let contractInstance = await contract.new(
    args === undefined ? {} : { ...args }
  );
  let pi = await genericDeployOnlySafeProxyFor(proxyName, contractInstance);
  pi.contract = contractInstance;
  return pi;
};
