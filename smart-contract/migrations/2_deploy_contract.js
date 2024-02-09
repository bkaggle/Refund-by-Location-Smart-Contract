const LocationContract = artifacts.require("Location");

module.exports = function(deployer) {
  deployer.deploy(LocationContract);
};
