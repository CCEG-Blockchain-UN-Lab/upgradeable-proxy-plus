module.exports = async (proxyName, contractInstanceToProxy) => {
  const Proxy = artifacts.require(proxyName);
  let proxy = await Proxy.new();
  await proxy.upgradeTo(contractInstanceToProxy.address);
  let proxiedContractInstance = contractInstanceToProxy.constructor.at(
    proxy.address
  );

  return { proxy: proxy, proxied: proxiedContractInstance };
};
