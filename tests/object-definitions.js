/**
 * single-test run:
 * npm run test -- ./tests/object-definitions.js
 * npm run test:headful -- ./tests/object-definitions.js
 */

const utils = require('../src/modules/utils');

const FEATURE_NAME = 'object-definitions';
let TENANT;

Feature(FEATURE_NAME);

Before(async ({ loginAs, perApi, objectDefinitionsPage }) => {
  TENANT = utils.generateRandomName();
  await perApi.createTenant(TENANT);
  await loginAs('admin');
  await objectDefinitionsPage.navigate(TENANT);
});

After(async ({ perApi }) => {
  await perApi.deleteTenant(TENANT);
});

Scenario(
  'add & delete object-definition',
  async ({ objectDefinitionsPage }) => {
    const name = utils.generateRandomName();

    await objectDefinitionsPage.addObjectDefinition(name);
    objectDefinitionsPage.seeObjectDefinition(name);
    objectDefinitionsPage.deleteObjectDefinition(name);
    objectDefinitionsPage.dontSeeObjectDefinition(name);
  }
);

Scenario(
  'add & delete object-definition-file',
  async ({ objectDefinitionsPage, perApi, I }) => {
    const objectDefinition = utils.generateRandomName();
    const file = utils.generateRandomName();

    await perApi.createObjectDefinition(TENANT, objectDefinition);
    await objectDefinitionsPage.navigate(TENANT);
    objectDefinitionsPage.selectObjectDefinition(objectDefinition);
    await objectDefinitionsPage.addFile(file);
    objectDefinitionsPage.seeFile(file);
    objectDefinitionsPage.deleteFile(file);
    objectDefinitionsPage.dontSeeFile(file);
  }
);
