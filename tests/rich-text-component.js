/**
 * single-test run:
 * npm run test -- ./tests/rich-text-component.js
 */

const utils = require('../src/modules/utils')
const expect = require('expect')

const FEATURE_NAME = 'rich-text-component'
const TENANT = utils.generateRandomName()
const PAGE = FEATURE_NAME

Feature(FEATURE_NAME)

Before(async ({loginAs, perApi, pagesPage, editPagePage}) => {
  await perApi.createTenant(TENANT)
  await perApi.createPage(TENANT, PAGE)
  await perApi.addComponent(TENANT, PAGE, 'richtext', 'into-into', 'sample')
  await loginAs('admin')
  pagesPage.navigate(TENANT)
  pagesPage.editPage(PAGE)
  editPagePage.editView.selectNthInlineEdit(1)
  editPagePage.editorPanel.titleIs('Rich Text')
})

After(({perApi}) => {
  perApi.deleteTenant(TENANT)
})

Scenario.skip('sync from edit-view to editor-panel', async ({editPagePage}) => {
  const text = `${FEATURE_NAME}_-äöüß?$)=!%"='\\\``

  editPagePage.editView.setNthInlineEditContent(1, text)
  expect(await editPagePage.editorPanel.grabNthTextEditorContent(1))
      .toBe(text)
  expect(await editPagePage.editView.grabNthInlineEditContent(1))
      .toBe(text)
})

Scenario.skip('sync editor-panel to edit-view', async ({editPagePage}) => {
  const text = `äöüß?$)=!%"='\\\`-_${FEATURE_NAME}`

  editPagePage.editorPanel.setNthTextEditorContent(1, text)
  expect(await editPagePage.editView.grabNthInlineEditContent(1))
      .toBe(text)
  expect(await editPagePage.editorPanel.grabNthTextEditorContent(1))
      .toBe(text)
})

Scenario('keep content when creating component via [ctrl + .]',
    async ({I, editPagePage}) => {
      const {
        editView,
        createComponentModal
      } = editPagePage
      const content = await editView.grabNthInlineEditContent(1)

      I.selectAll()
      createComponentModal.createComponent('Rich Text - Example')

      expect(await editView.grabNthInlineEditContent(1)).toBe(content)
    }
)
