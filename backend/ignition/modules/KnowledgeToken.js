const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("KnowledgeToken", (m) => {
  const KnowledgeToken = m.contract("KnowledgeToken");
  return { KnowledgeToken };

});
