const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("KnowledgeTokenVault", (m) => {
  const KnowledgeTokenVault = m.contract("KnowledgeTokenVault",[""]);
  return { KnowledgeTokenVault };

});
