/**
 * single-test run:
 * npm run test -- ./tests/teaser-vertical-component.js
 */

const utils = require('../src/modules/utils')
const expect = require('expect')

const FEATURE_NAME = 'teaser-vertical-component'
let TENANT
const PAGE = FEATURE_NAME

Feature(FEATURE_NAME)

Before(async ({ I, loginAs, perApi, pagesPage, editPagePage }) => {
  TENANT = utils.generateRandomName()
  await perApi.createTenant(TENANT)
  await perApi.createPage(TENANT, PAGE)
  await perApi.addComponent(
    TENANT, PAGE, 'teaservertical', 'into-into', 'sample')
  await loginAs('admin')
  await I.wait(3)
  await pagesPage.navigate(TENANT)
  await pagesPage.editPage(PAGE)
  await editPagePage.editView.selectNthInlineEdit(1)
  await editPagePage.editorPanel.titleIs('Teaser Vertical')
})

After(async ({ perApi }) => {
  await perApi.deleteTenant(TENANT)
})

Scenario('sync title to editor-panel', async ({ editPagePage }) => {
  const text = `${FEATURE_NAME}_-äöüß?$)=!%"='\\\``

  await editPagePage.editView.setNthInlineEditContent(1, text)
  expect(await editPagePage.editorPanel.grabNthInputValue(1))
    .toBe(text)
  expect(await editPagePage.editView.grabNthInlineEditContent(1))
    .toBe(text)
})

Scenario('sync title to edit-view', async ({ editPagePage }) => {
  const text = `äöüß?$)=!%"='\\\`-_${FEATURE_NAME}`

  await editPagePage.editorPanel.setNthInputValue(1, text)
  expect(await editPagePage.editView.grabNthInlineEditContent(1))
    .toBe(text)
  expect(await editPagePage.editorPanel.grabNthInputValue(1))
    .toBe(text)
})
