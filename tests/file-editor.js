/**
 * single-test run:
 * npm run test -- ./tests/edit-page.js
 */

const utils = require('../src/modules/utils');

const FEATURE_NAME = 'edit-page';
let TENANT;
const PAGE = FEATURE_NAME;
const TEST_CONTENT = JSON.stringify({ bla: 'bli', blub: 5, is: true });

Feature(FEATURE_NAME);

Before(async ({ loginAs, perApi, pagesPage }) => {
  TENANT = utils.generateRandomName();
  await perApi.createTenant(TENANT);
  await perApi.createPage(TENANT, PAGE);
  await loginAs('admin');
  pagesPage.navigate(TENANT);
});

After(({ perApi }) => {
  perApi.deleteTenant(TENANT);
});

Scenario('see file-editor', async ({ pagesPage, fileEditor }) => {
  pagesPage.explorer.toggleFilter();
  pagesPage.editFile('manifest.json');
  fileEditor.loaded();
});

Scenario.only('save', async ({ pagesPage, fileEditor }) => {
  await pagesPage.explorer.toggleFilter();
  await pagesPage.editFile('manifest.json');
  await fileEditor.loaded();
  await fileEditor.fillEditor(TEST_CONTENT);
});

Scenario.todo('save & exit', () => {});

Scenario.todo('confirm exit without saving', () => {});

Scenario.todo('cancel exit without saving', () => {});

Scenario.todo('exit (no changes)', () => {});
