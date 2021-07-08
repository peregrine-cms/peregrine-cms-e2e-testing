/**
 * single-test run:
 * npm run test -- ./tests/rich-toolbar.test.js
 * npm run test:headful -- ./tests/rich-toolbar.test.js
 */

const utils = require('../src/modules/utils');

const FEATURE_NAME = utils.toFeatureName(__filename);
let TENANT;
const PAGE = FEATURE_NAME;

Feature(FEATURE_NAME);

Before(async ({ loginAs, perApi, pagesPage, editPagePage }) => {
  TENANT = utils.generateRandomName();
  await perApi.createTenant(TENANT);
  await perApi.createPage(TENANT, PAGE);
  await perApi.addComponent(TENANT, PAGE, 'richtext', 'into-into', 'sample');
  await loginAs('admin');
  pagesPage.navigate(TENANT);
  pagesPage.editPage(PAGE);
  editPagePage.editView.selectNthInlineEdit(1);
  editPagePage.editorPanel.titleIs('Rich Text');
});

After(({ perApi }) => {
  perApi.deleteTenant(TENANT);
});

Scenario('insert icon', ({ editPagePage }) => {
  const iconName = 'launcher-icon-1x';

  editPagePage.richToolbar.insertIcon(iconName);
  editPagePage.editView.containsText(`[icon:${iconName}]`);
});

Scenario('insert image', async ({ editPagePage }) => {
  const imgName = 'launcher-icon-1x.png';

  editPagePage.richToolbar.openImageBrowser();
  await editPagePage.pathBrowser.selectBrowseEntry('icons');
  await editPagePage.pathBrowser.selectBrowseEntry(imgName);
  editPagePage.pathBrowser.select();
  editPagePage.editView.openEditImageModal(
    `/content/${TENANT}/assets/icons/${imgName}`
  );
  editPagePage.pathBrowser.headerIs('Edit Image');
  editPagePage.pathBrowser.setImageDimensions(500, 300);
  editPagePage.pathBrowser.select();
  editPagePage.editView.seeAttributesOnImage(
    `/content/${TENANT}/assets/icons/${imgName}`,
    { width: 500, height: 300 }
  );
});

Scenario('open preview', async ({ editPagePage }) => {
  await editPagePage.richToolbar.togglePreview();
  editPagePage.editView.isPreview();
  await editPagePage.richToolbar.togglePreview();
  editPagePage.editView.isEditMode();
});

Scenario('open preview in new tab', async ({ I, editPagePage }) => {
  await editPagePage.richToolbar.openPreviewInNewTab(TENANT, PAGE);
});
