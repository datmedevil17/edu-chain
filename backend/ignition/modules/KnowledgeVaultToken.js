
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("KnowledgeVaultToken", (m) => {
  const KnowledgeVaultToken = m.contract("KnowledgeVaultToken",[100000]);
  return { KnowledgeVaultToken };

});
