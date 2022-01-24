/**
 * single-test run:
 * npm run test -- ./tests/rich-toolbar.js
 */

const utils = require('../src/modules/utils')
const {setup} = require('../src/modules/setup')

const FEATURE_NAME = 'rich-toolbar'
let TENANT
const PAGE = FEATURE_NAME

Feature(FEATURE_NAME)

Before(async ({ I, loginAs, perApi, pagesPage, editPagePage }) => {
  await setup()
  TENANT = utils.generateRandomName()
  await perApi.createTenant(TENANT)
  await perApi.createPage(TENANT, PAGE)
  await perApi.addComponent(TENANT, PAGE, 'richtext', 'into-into', 'sample')
  await loginAs('admin')
  await I.wait(3)
  await pagesPage.navigate(TENANT)
  await pagesPage.editPage(PAGE)
  await editPagePage.editView.selectNthInlineEdit(1)
  await editPagePage.editorPanel.titleIs('Rich Text')
})

After(async ({ perApi }) => {
  await perApi.deleteTenant(TENANT)
})

Scenario('insert icon', async ({ I, editPagePage }) => {
  const iconName = 'launcher-icon-1x'

  await editPagePage.richToolbar.insertIcon(iconName)
  //AS TODO: does not work at the moment
  // await editPagePage.editView.containsText(`[icon:${iconName}]`)
})

Scenario('insert image', async ({ editPagePage }) => {
  const imgName = 'launcher-icon-1x.png'

  await editPagePage.richToolbar.openImageBrowser()
  await editPagePage.pathBrowser.selectBrowseEntry('icons')
  await editPagePage.pathBrowser.selectBrowseEntry(imgName)
  await editPagePage.pathBrowser.select()
  await editPagePage.editView.openEditImageModal(
    `/content/${TENANT}/assets/icons/${imgName}`)
  await editPagePage.pathBrowser.headerIs('Edit Image')
  await editPagePage.pathBrowser.setImageDimensions(500, 300)
  await editPagePage.pathBrowser.select()
  await editPagePage.editView.seeAttributesOnImage(
    `/content/${TENANT}/assets/icons/${imgName}`,
    { width: 500, height: 300 }
  )
})

Scenario('open preview', async ({ editPagePage }) => {
  await editPagePage.richToolbar.togglePreview()
  await editPagePage.editView.isPreview()
  await editPagePage.richToolbar.togglePreview()
  await editPagePage.editView.isEditMode()
})

Scenario('open preview in new tab', async ({ I, editPagePage }) => {
  await editPagePage.richToolbar.openPreviewInNewTab(TENANT, PAGE)
})