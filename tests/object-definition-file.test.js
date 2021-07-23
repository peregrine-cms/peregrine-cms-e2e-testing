/**
 * single-test run:
 * npm run test -- ./tests/object-definition-file.js
 * npm run test:headful -- ./tests/object-definition-file.test.js
 */

const utils = require('../src/modules/utils');

const TENANT = utils.generateRandomName();
const NAME = utils.generateRandomName();
const FILE = utils.generateRandomName();
const FILE_CONTENT = `"type": "VerticalLayout",`;

Feature(utils.toFeatureName(__filename));

BeforeSuite(async ({ loginAs, perApi, objectDefinitionsPage }) => {
  await perApi.createTenant(TENANT);
  await loginAs('admin');
  await objectDefinitionsPage.navigate(TENANT);
  await objectDefinitionsPage.addObjectDefinition(NAME);
});

AfterSuite(async ({ perApi }) => {
  await perApi.deleteTenant(TENANT);
});

Before(async ({ objectDefinitionsPage }) => {
  await objectDefinitionsPage.navigate(TENANT);
  objectDefinitionsPage.selectObjectDefinition(NAME);
});

Scenario('add', async ({ objectDefinitionsPage }) => {
  await objectDefinitionsPage.addFile(FILE);
  await objectDefinitionsPage.seeFile(FILE);
});

Scenario('view', async ({ I, objectDefinitionsPage }) => {
  objectDefinitionsPage.editFile(FILE);
  I.see(FILE_CONTENT);
});

Scenario('delete', async ({ objectDefinitionsPage }) => {
  const filename = 'dialog';

  await objectDefinitionsPage.deleteFile(filename);
  objectDefinitionsPage.dontSeeFile(filename);
});
