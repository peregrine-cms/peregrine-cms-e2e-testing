/**
 * single-test run:
 * npm run test -- ./tests/copy-component.js
 */

const FEATURE_NAME = 'copy-component'
const TENANT = 'pcms_testing'
const PAGE = FEATURE_NAME

Feature(FEATURE_NAME)

Before(async ({loginAs, perApi, pagesPage, editPagePage}) => {
  const {
    editView
  } = editPagePage

  await perApi.createTenant(TENANT)
  await perApi.createPage(TENANT, PAGE)
  await loginAs('admin')
  pagesPage.navigate(TENANT)
  pagesPage.editPage(PAGE)
})

After(({perApi}) => {
  perApi.deleteTenant(TENANT)
})

Scenario('copy simpletext component',
    async ({I, perApi, editPagePage}) => {
      const {
        editable,
        editView
      } = editPagePage

      await perApi.addComponent(TENANT, PAGE, 'simpletext', 'into-before',
          'example')
      I.refreshPage()
      I.waitForNavigation()
      editView.textComponent.seeNumber(1)
      editView.selectNthInlineEdit(1)
      editable.copy()
      editable.paste()
      editView.textComponent.seeNumber(2)
    })

Scenario('copy cards-sample component',
    async ({I, perApi, editPagePage}) => {
      const {
        editable,
        editView
      } = editPagePage

      await perApi.addComponent(TENANT, PAGE, 'cards', 'into-before',
          'sample')
      I.refreshPage()
      I.waitForNavigation()
      editView.cardsComponent.seeNumber(1)
      editView.selectNthInlineEdit(1)
      editable.copy()
      editable.paste()
      editView.cardsComponent.seeNumber(2)
    })