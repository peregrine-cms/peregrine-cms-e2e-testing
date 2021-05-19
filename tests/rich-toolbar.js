/**
 * single-test run:
 * npm run test -- ./tests/rich-toolbar.js
 * npm run test:headful -- ./tests/rich-toolbar.js
 */

const path = require('path');
const utils = require('../src/modules/utils');

const FEATURE_NAME = 'rich-toolbar';
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

Scenario(
  'add & insert icon',
  async ({ assetsPage, pagesPage, editPagePage }) => {
    await assetsPage.navigate(TENANT);
    await assetsPage.open('icons');
    await assetsPage.uploadAsset('resources/images/peregrine-logo.svg');
    await pagesPage.navigate(TENANT);
    await pagesPage.editPage(PAGE);
    await editPagePage.editView.selectNthInlineEdit(1);
    await editPagePage.editorPanel.titleIs('Rich Text');
    await editPagePage.richToolbar.insertIcon('peregrine-logo');
    await editPagePage.editView.seePeregrineIcon('peregrine-logo');
  }
);

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
