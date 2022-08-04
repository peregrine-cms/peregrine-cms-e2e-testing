/**
 * single-test run:
 * npm run test -- ./tests/rich-text-component.js
 */

const utils = require('../src/modules/utils')
const expect = require('expect')

const FEATURE_NAME = 'rich-text-component'
let TENANT
const PAGE = FEATURE_NAME

Feature(FEATURE_NAME)

Before(async ({ I, loginAs, perApi, pagesPage, editPagePage }) => {
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

Scenario.skip('sync from edit-view to editor-panel', async ({ editPagePage }) => {
  const text = `${FEATURE_NAME}_-äöüß?$)=!%"='\\\``

  await editPagePage.editView.setNthInlineEditContent(1, text)
  expect(await editPagePage.editorPanel.grabNthTextEditorContent(1))
    .toBe(text)
  expect(await editPagePage.editView.grabNthInlineEditContent(1))
    .toBe(text)
})

Scenario.skip('sync editor-panel to edit-view', async ({ editPagePage }) => {
  const text = `äöüß?$)=!%"='\\\`-_${FEATURE_NAME}`

  await editPagePage.editorPanel.setNthTextEditorContent(1, text)
  expect(await editPagePage.editView.grabNthInlineEditContent(1))
    .toBe(text)
  expect(await editPagePage.editorPanel.grabNthTextEditorContent(1))
    .toBe(text)
})

Scenario('keep content when creating component via [ctrl + .]',
  async ({ I, editPagePage }) => {
    const {
      editView,
      createComponentModal
    } = editPagePage
    const content = await editView.grabNthInlineEditContent(1)

    await I.selectAll()
    await createComponentModal.createComponent('Rich Text - Example')

    expect(await editView.grabNthInlineEditContent(1)).toBe(content)
  }
)
