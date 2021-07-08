/**
 * single-test run:
 * npm run test -- ./tests/remove-node.test.js
 * npm run test:headful -- ./tests/remove-node.test.js
 */

const utils = require('../src/modules/utils');

const FEATURE_NAME = utils.toFeatureName(__filename);
let TENANT;
const PAGE = FEATURE_NAME;
const ASSET = FEATURE_NAME;
const OBJECT = FEATURE_NAME;
const TEMPLATE = FEATURE_NAME;

Feature(FEATURE_NAME);

Before(async ({ loginAs, perApi, pagesPage, editPagePage }) => {
  TENANT = utils.generateRandomName();
  await perApi.createTenant(TENANT);
  await loginAs('admin');
});

After(({ perApi }) => {
  perApi.deleteTenant(TENANT);
});

Scenario('delete page', async ({ perApi, pagesPage }) => {
  await perApi.createPage(TENANT, PAGE);
  pagesPage.navigate(TENANT);
  pagesPage.deletePage(PAGE);
});

Scenario('delete asset', async ({ I, perApi, assetsPage }) => {
  await perApi.createFolder(TENANT, 'assets', ASSET);
  assetsPage.navigate(TENANT);
  assetsPage.deleteAsset(ASSET);
});

Scenario('delete object', async ({ perApi, objectsPage }) => {
  await perApi.createObject(TENANT, OBJECT);
  objectsPage.navigate(TENANT);
  objectsPage.deleteObject(OBJECT);
});

Scenario('delete template', async ({ perApi, templatesPage }) => {
  await perApi.createTemplate(TENANT, TEMPLATE);
  templatesPage.navigate(TENANT);
  templatesPage.deleteTemplate(TEMPLATE);
});
