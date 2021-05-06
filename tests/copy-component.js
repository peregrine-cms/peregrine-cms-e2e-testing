/**
 * single-test run:
 * npm run test -- ./tests/copy-component.js
 */

const utils = require('../src/modules/utils')

const FEATURE_NAME = 'copy-component'
let TENANT
const PAGE = FEATURE_NAME

Feature(FEATURE_NAME)

Before(async ({ loginAs, perApi, pagesPage }) => {
  TENANT = utils.generateRandomName()
  await perApi.createTenant(TENANT)
  await perApi.createPage(TENANT, PAGE)
  await loginAs('admin')
  pagesPage.navigate(TENANT)
  pagesPage.editPage(PAGE)
})

After(({ perApi }) => {
  perApi.deleteTenant(TENANT)
})

Scenario('copy simpletext component',
  async ({ I, perApi, editPagePage, themeCleanFlex }) => {
    const {
      editable,
      editView
    } = editPagePage

    await perApi.addComponent(TENANT, PAGE, 'simpletext', 'into-before',
      'example')
    I.refreshPage()
    I.waitForNavigation()
    const { text } = themeCleanFlex
    text.seeNumber(1)
    editView.selectNthInlineEdit(1)
    editable.copy()
    editable.paste()
    text.seeNumber(2)
  })

Scenario('copy cards-sample component',
  async ({ I, perApi, editPagePage, themeCleanFlex }) => {
    const {
      editable,
      editView
    } = editPagePage

    await perApi.addComponent(TENANT, PAGE, 'cards', 'into-before',
      'sample')
    I.refreshPage()
    I.waitForNavigation()
    const { cards } = themeCleanFlex
    cards.seeNumber(1)
    editView.selectNthInlineEdit(1)
    editable.copy()
    editable.paste()
    cards.seeNumber(2)
  })