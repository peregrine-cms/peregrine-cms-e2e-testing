/**
 * single-test run:
 * npm run test -- ./tests/switching-components.test.js
 * npm run test:headful -- ./tests/switching-components.test.js
 */

const expect = require('expect');
const utils = require('../src/modules/utils');

const FEATURE_NAME = utils.toFeatureName(__filename);
let TENANT;
const PAGE = FEATURE_NAME;

Feature(FEATURE_NAME);

Before(async ({ loginAs, perApi, pagesPage }) => {
  TENANT = utils.generateRandomName();
  await perApi.createTenant(TENANT);
  await perApi.createPage(TENANT, PAGE);
  await loginAs('admin');
  pagesPage.navigate(TENANT);
  pagesPage.editPage(PAGE);
});

After(({ perApi }) => {
  perApi.deleteTenant(TENANT);
});

Scenario('selection was cleared', async ({ I, perApi, editPagePage }) => {
  await perApi.addComponent(TENANT, PAGE, 'richtext', 'into-into', 'sample');
  await perApi.addComponent(TENANT, PAGE, 'richtext', 'into-into', 'sample');
  I.refreshPage();
  editPagePage.loaded();
  editPagePage.editView.selectNthInlineEdit(1);
  editPagePage.editorPanel.titleIs('Rich Text');
  I.selectAll();
  editPagePage.editView.selectNthInlineEdit(2);
  const range = await editPagePage.editView.getCurrentRange();
  await expect(range.start).toBe(range.end);
});

Scenario('content stays the same', async ({ I, perApi, editPagePage }) => {
  await perApi.addComponent(
    TENANT,
    PAGE,
    'teaservertical',
    'into-into',
    'sample'
  );
  await perApi.addComponent(TENANT, PAGE, 'richtext', 'into-into', 'sample');
  I.refreshPage();
  editPagePage.loaded();
  const before = [
    await editPagePage.editView.teaserVertical.grabTitle(),
    await editPagePage.editView.teaserVertical.grabSubtitle(),
    await editPagePage.editView.teaserVertical.grabText(),
    await editPagePage.editView.teaserVertical.grabButtonText(1),
    await editPagePage.editView.teaserVertical.grabButtonText(2),
  ];
  editPagePage.editView.teaserVertical.selectTitle();
  I.pressKey('Tab');
  I.pressKey('Tab');
  I.pressKey('Tab');
  I.pressKey('Tab');
  I.pressKey('Tab');
  I.pressKey('Tab');
  I.pressKey('Tab');
  const after = [
    await editPagePage.editView.teaserVertical.grabTitle(),
    await editPagePage.editView.teaserVertical.grabSubtitle(),
    await editPagePage.editView.teaserVertical.grabText(),
    await editPagePage.editView.teaserVertical.grabButtonText(1),
    await editPagePage.editView.teaserVertical.grabButtonText(2),
  ];

  after.forEach((value, i) => {
    expect(after[i].trim()).toBe(before[i].trim());
  });
});