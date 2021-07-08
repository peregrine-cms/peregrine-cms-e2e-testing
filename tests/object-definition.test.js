/**
 * single-test run:
 * npm run test -- ./tests/object-definition.test.js
 * npm run test:headful -- ./tests/object-definition.test.js
 */

const utils = require('../src/modules/utils');

const TENANT = utils.generateRandomName();
const NAME = utils.generateRandomName();

Feature(utils.toFeatureName(__filename));

BeforeSuite(async ({ loginAs, perApi }) => {
  await perApi.createTenant(TENANT);
  await loginAs('admin');
});

AfterSuite(async ({ perApi }) => {
  await perApi.deleteTenant(TENANT);
});

Before(async ({ objectDefinitionsPage }) => {
  await objectDefinitionsPage.navigate(TENANT);
});

Scenario('add', async ({ objectDefinitionsPage }) => {
  await objectDefinitionsPage.addObjectDefinition(NAME);
  objectDefinitionsPage.seeObjectDefinition(NAME);
});

Scenario('view', async ({ objectDefinitionsPage }) => {
  objectDefinitionsPage.selectObjectDefinition(NAME);
  objectDefinitionsPage.seeFile('dialog');
  objectDefinitionsPage.seeFile('json-schema');
  objectDefinitionsPage.seeFile('ui-schema');
});

Scenario('delete', async ({ objectDefinitionsPage }) => {
  objectDefinitionsPage.deleteObjectDefinition(NAME);
  objectDefinitionsPage.dontSeeObjectDefinition(NAME);
});
