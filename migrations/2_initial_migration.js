var Quiz = artifacts.require("./Quiz.sol");

module.exports = function(deployer) {
	// keep secret key here
  deployer.deploy(Quiz,5,100,5);
};