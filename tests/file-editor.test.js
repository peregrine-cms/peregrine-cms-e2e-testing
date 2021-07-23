/**
 * single-test run:
 * npm run test -- ./tests/file-editor.test.js
 * npm run test:headful -- ./tests/file-editor.test.js
 */

const utils = require('../src/modules/utils');

const FEATURE_NAME = utils.toFeatureName(__filename);
let TENANT;
const PAGE = FEATURE_NAME;
const TEST_CODE = `const foo = {bar: 0};`;
const TEST_CODE_FORMATTED = `const foo = {
  bar: 0};
`;

Feature(FEATURE_NAME);

Before(async ({ loginAs, perApi }) => {
  TENANT = utils.generateRandomName();

  await perApi.createTenant(TENANT);
  await perApi.createPage(TENANT, PAGE);
  await loginAs('admin');
});

After(({ perApi }) => {
  perApi.deleteTenant(TENANT);
});

Scenario('save', async ({ fileEditor }) => {
  await fileEditor.load(`/content/${TENANT}/pages/manifest.json`);
  await fileEditor.fillCode(TEST_CODE);
  await fileEditor.clickSave();
  await fileEditor.load(`/content/${TENANT}/pages/manifest.json`);
  await fileEditor.seeCode(TEST_CODE);
});

Scenario('save with [CTRL + S]', async ({ fileEditor, I, toast }) => {
  await fileEditor.load(`/content/${TENANT}/pages/manifest.json`);
  await fileEditor.fillCode(TEST_CODE);
  await I.pressKey(['CommandOrControl', 's']);
  await toast.see('Saved file!', 'success');
  await fileEditor.load(`/content/${TENANT}/pages/manifest.json`);
  await fileEditor.seeCode(TEST_CODE);
});

Scenario('auto-format', async ({ fileEditor, I }) => {
  await fileEditor.load(`/content/${TENANT}/pages/manifest.json`);
  await fileEditor.fillCode(TEST_CODE);
  await fileEditor.seeCode(TEST_CODE);
  await fileEditor.autoFormat();
  await fileEditor.seeCode(TEST_CODE_FORMATTED);
});

Scenario('save & exit', async ({ fileEditor, pagesPage }) => {
  await fileEditor.load(`/content/${TENANT}/pages/manifest.json`);
  await fileEditor.fillCode(TEST_CODE);
  await fileEditor.clickSaveAndExit();
  await pagesPage.seePage('Home');
  await fileEditor.load(`/content/${TENANT}/pages/manifest.json`);
  await fileEditor.seeCode(TEST_CODE);
});

Scenario('confirm exit without saving', async ({ fileEditor, pagesPage }) => {
  await fileEditor.load(`/content/${TENANT}/pages/manifest.json`);

  const code = await fileEditor.grabCode();

  await fileEditor.fillCode(TEST_CODE);
  await fileEditor.clickExit(true);
  await pagesPage.seePage('Home');
  await fileEditor.load(`/content/${TENANT}/pages/manifest.json`);
  await fileEditor.seeCode(code);
});

Scenario('cancel exit without saving', async ({ fileEditor }) => {
  await fileEditor.load(`/content/${TENANT}/pages/manifest.json`);
  await fileEditor.fillCode(TEST_CODE);
  await fileEditor.clickExit(false);
  await fileEditor.seeMyself();
  await fileEditor.seeCode(TEST_CODE);
});

Scenario('exit (no changes)', async ({ fileEditor, pagesPage }) => {
  await fileEditor.load(`/content/${TENANT}/pages/manifest.json`);

  const code = await fileEditor.grabCode();

  await fileEditor.clickExit();
  await pagesPage.seePage('Home');
  await fileEditor.load(`/content/${TENANT}/pages/manifest.json`);
  await fileEditor.seeCode(code);
});

Scenario.only(
  'rename file',
  async ({ I, fileEditor, rightPanel, explorer, renameModal }) => {
    const filename = `manifest.json`;
    const newFilename = utils.generateRandomName();

    await fileEditor.load(`/content/${TENANT}/pages/${filename}`);
    await rightPanel.openActionsTab();
    await rightPanel.actionsTab.rename(newFilename, newFilename + '$');
    await I.see('File names may only contain', 'span');
    await renameModal.fillNameField(newFilename);
    await renameModal.clickSubmit();
    await I.seeInCurrentUrl(`path:/content/${TENANT}/pages`);
    await explorer.toggleFilter();
    await I.dontSee(filename);
    await I.see(`${newFilename}.json`);
  }
);

Scenario('move file', async ({ I, fileEditor, rightPanel, explorer }) => {
  const filename = `manifest.json`;

  await fileEditor.load(`/content/${TENANT}/pages/${filename}`);
  await rightPanel.openActionsTab();
  await rightPanel.actionsTab.move('templates');
  await I.seeInCurrentUrl(`path:/content/${TENANT}/templates`);
  await explorer.toggleFilter();
  await I.see(filename);
});

Scenario('copy file', async ({ I, fileEditor, rightPanel, explorer }) => {
  const filename = `manifest.json`;
  const copyFilename = 'manifest-copy.json';
  const copy2Filename = 'manifest-copy-2.json';

  await fileEditor.load(`/content/${TENANT}/pages/${filename}`);
  await rightPanel.openActionsTab();
  await rightPanel.actionsTab.copy();
  await I.seeInCurrentUrl(`path:/content/${TENANT}/pages`);
  await explorer.toggleFilter();
  await I.see(filename);
  await I.see(copyFilename);
  //second-copy
  await fileEditor.load(`/content/${TENANT}/pages/${filename}`);
  await rightPanel.openActionsTab();
  await rightPanel.actionsTab.copy();
  await I.seeInCurrentUrl(`path:/content/${TENANT}/pages`);
  await explorer.toggleFilter();
  await I.see(filename);
  await I.see(copyFilename);
  await I.see(copy2Filename);
});

Scenario('delete file', async ({ I, fileEditor, rightPanel, explorer }) => {
  const filename = `manifest.json`;

  await fileEditor.load(`/content/${TENANT}/pages/${filename}`);
  await rightPanel.openActionsTab();
  await rightPanel.actionsTab.delete(false);
  await I.seeInCurrentUrl(`path:/content/${TENANT}/pages`);
  await explorer.toggleFilter();
  await I.dontSee(filename);
});

Scenario(
  'publish file',
  async ({ I, fileEditor, rightPanel, publishingModal }) => {
    const filename = `manifest.json`;

    await fileEditor.load(`/content/${TENANT}/pages/${filename}`);
    await rightPanel.openWebPublishingTab();
    await rightPanel.webPublishingTab.clickPublishToWeb();
    await publishingModal.clickSubmit();
    await I.waitForVisible('#notifyUserModal', 60); //wait for timeout warning!
    await I.see('Action timed out when publishing');
  }
);
