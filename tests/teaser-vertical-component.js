/**
 * single-test run:
 * npm run test -- ./tests/teaser-vertical-component.js
 */

const utils = require('../src/modules/utils')
const expect = require('expect')

const FEATURE_NAME = 'teaser-vertical-component'
const TENANT = utils.generateRandomName()
const PAGE = FEATURE_NAME

Feature(FEATURE_NAME)

Before(async ({loginAs, perApi, pagesPage, editPagePage}) => {
  await perApi.createTenant(TENANT)
  await perApi.createPage(TENANT, PAGE)
  await perApi.addComponent(
      TENANT, PAGE, 'teaservertical', 'into-into', 'sample')
  await loginAs('admin')
  pagesPage.navigate(TENANT)
  pagesPage.editPage(PAGE)
  editPagePage.editView.selectNthInlineEdit(1)
  editPagePage.editorPanel.titleIs('Teaser Vertical')
})

After(({perApi}) => {
  perApi.deleteTenant(TENANT)
})

Scenario('sync title to editor-panel', async ({editPagePage}) => {
  const text = `${FEATURE_NAME}_-äöüß?$)=!%"='\\\``

  editPagePage.editView.setNthInlineEditContent(1, text)
  expect(await editPagePage.editorPanel.grabNthInputValue(1))
      .toBe(text)
  expect(await editPagePage.editView.grabNthInlineEditContent(1))
      .toBe(text)
})

Scenario('sync title to edit-view', async ({editPagePage}) => {
  const text = `äöüß?$)=!%"='\\\`-_${FEATURE_NAME}`

  editPagePage.editorPanel.setNthInputValue(1, text)
  expect(await editPagePage.editView.grabNthInlineEditContent(1))
      .toBe(text)
  expect(await editPagePage.editorPanel.grabNthInputValue(1))
      .toBe(text)
})
