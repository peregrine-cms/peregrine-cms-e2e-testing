/**
 * single-test run:
 * npm run test -- ./tests/user-drop-down.test.js
 * npm run test:headful -- ./tests/user-drop-down.test.js
 */

const utils = require('../src/modules/utils');
const expect = require('expect');
const clipboardy = require('clipboardy');

const FEATURE_NAME = 'user-drop-down';
let TENANT;

Feature(FEATURE_NAME);

Before(async ({ loginAs, perApi, assetsPage }) => {
  TENANT = utils.generateRandomName();
  await perApi.createTenant(TENANT);
  await loginAs('admin');
  assetsPage.navigate(TENANT);
});

After(({ perApi }) => {
  perApi.deleteTenant(TENANT);
});

Scenario('copy username', async ({ welcomePage, I }) => {
  const { topNav } = welcomePage;

  await topNav.toggleUserDropDown();
  const username = await topNav.grabTextFromUsername();
  await topNav.copyUsername();
  const clipboard = await clipboardy.readSync();

  expect(clipboard).toBe(username);
});
