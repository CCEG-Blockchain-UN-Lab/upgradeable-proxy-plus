module.exports = (functionSignature, ...arg) => {
  const abi = require("web3-eth-abi");

  let encodedFunctionSignature = abi.encodeFunctionSignature(functionSignature);

  if (arg.length == 0) return encodedFunctionSignature;

  function getArgTypeArray(functionSignature) {
    let argsString = functionSignature.slice(
      functionSignature.indexOf("(") + 1,
      functionSignature.indexOf(")")
    );
    return argsString.split(",");
  }

  let encodedParameters = abi
    .encodeParameters(getArgTypeArray(functionSignature), arg)
    .substring(2);

  return encodedFunctionSignature + encodedParameters;
};
