const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("KnowledgeVault", (m) => {
  const KnowledgeVault = m.contract("KnowledgeVault",["0xC39Fcb288e011983D213787CB04c4d69666d605a"]);
  return { KnowledgeVault };

});
