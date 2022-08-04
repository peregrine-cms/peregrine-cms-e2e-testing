/**
 * single-test run:
 * npm run test -- ./tests/switching-components.js
 */

const expect = require('expect')
const utils = require('../src/modules/utils')
const {setup} = require('../src/modules/setup')

const FEATURE_NAME = 'switching-components'
let TENANT
const PAGE = FEATURE_NAME

Feature(FEATURE_NAME)

Before(async ({ I, loginAs, perApi, pagesPage }) => {
  setup()
  TENANT = utils.generateRandomName()
  await perApi.createTenant(TENANT)
  await perApi.createPage(TENANT, PAGE)
  await loginAs('admin')
  await I.wait(3)
  await pagesPage.navigate(TENANT)
  await pagesPage.editPage(PAGE)
})

After(async ({ perApi }) => {
  await perApi.deleteTenant(TENANT)
})

Scenario('selection was cleared', async ({ I, perApi, editPagePage }) => {
  await perApi.addComponent(TENANT, PAGE, 'richtext', 'into-into', 'sample')
  await perApi.addComponent(TENANT, PAGE, 'richtext', 'into-into', 'sample')
  await I.refreshPage()
  await editPagePage.loaded()
  await editPagePage.editView.selectNthInlineEdit(1)
  await editPagePage.editorPanel.titleIs('Rich Text')
  await I.selectAll()
  await editPagePage.editView.selectNthInlineEdit(2)
  const range = await editPagePage.editView.getCurrentRange()
  await expect(range.start).toBe(range.end)
})

Scenario('content stays the same', async ({ I, perApi, editPagePage }) => {
  await perApi.addComponent(TENANT, PAGE, 'teaservertical', 'into-into',
    'sample')
  await perApi.addComponent(TENANT, PAGE, 'richtext', 'into-into', 'sample')
  await I.refreshPage()
  await editPagePage.loaded()
  // Need to select the title
  await editPagePage.selectSection(1)
  const before = [
    await editPagePage.editView.teaserVertical.grabTitle(),
    await editPagePage.editView.teaserVertical.grabSubtitle(),
    await editPagePage.editView.teaserVertical.grabText(),
    await editPagePage.editView.teaserVertical.grabButtonText(1),
    await editPagePage.editView.teaserVertical.grabButtonText(2)
  ]
  await editPagePage.editView.teaserVertical.selectTitle()
  await I.pressKey('Tab')
  await I.pressKey('Tab')
  await I.pressKey('Tab')
  await I.pressKey('Tab')
  await I.pressKey('Tab')
  await I.pressKey('Tab')
  await I.pressKey('Tab')
  const after = [
    await editPagePage.editView.teaserVertical.grabTitle(),
    await editPagePage.editView.teaserVertical.grabSubtitle(),
    await editPagePage.editView.teaserVertical.grabText(),
    await editPagePage.editView.teaserVertical.grabButtonText(1),
    await editPagePage.editView.teaserVertical.grabButtonText(2)
  ]

  after.forEach((value, i) => {
    expect(after[i].trim())
      .toBe(before[i].trim())
  })
})
