/// <reference types="cypress" />

/**
 * @type {Cypress.PluginConfig}
 */

const fs = require("fs-extra");
const path = require("path");

function getConfigurationByFile(file) {
  const pathToConfigFile = path.resolve("../scrum-cypress/cypress", "config", `${file}.json`);

  return fs.readJson(pathToConfigFile);
}

module.exports = (on, config) => {
  const file = config.env.configFile || "stage";

  return getConfigurationByFile(file);
}
