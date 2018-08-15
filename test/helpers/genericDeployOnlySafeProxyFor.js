module.exports = async (proxyName, ...args) => {
  // let proxyName = args[0];
  let contractInstanceToProxy = args[0];
  const Proxy = artifacts.require(proxyName);
  let proxy = await Proxy.new();
  if (args.length == 2)
    await proxy.upgradeToAndCall(contractInstanceToProxy.address, args[1]);
  else await proxy.upgradeTo(contractInstanceToProxy.address);
  let proxiedContractInstance = contractInstanceToProxy.constructor.at(
    proxy.address
  );

  return { proxy: proxy, proxied: proxiedContractInstance };
};
