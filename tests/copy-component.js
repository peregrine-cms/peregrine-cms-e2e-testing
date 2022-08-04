/**
 * single-test run:
 * npm run test -- ./tests/copy-component.js
 */

const utils = require('../src/modules/utils')

const FEATURE_NAME = 'copy-component'
let TENANT
const PAGE = FEATURE_NAME

Feature(FEATURE_NAME)

Before(async ({ I, loginAs, perApi, pagesPage }) => {
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

Scenario('copy simpletext component',
  async ({ I, perApi, editPagePage }) => {
    const {
      editable,
      editView
    } = editPagePage

    await perApi.addComponent(TENANT, PAGE, 'simpletext', 'into-before',
      'example')
    await I.refreshPage()
    await I.waitForNavigation()
    await editView.textComponent.seeNumber(1)
    await editView.selectNthInlineEdit(1)
    await editable.copy()
    await editable.paste()
    await editView.textComponent.seeNumber(2)
  })

Scenario('copy cards-sample component',
  async ({ I, perApi, editPagePage }) => {
    const {
      editable,
      editView
    } = editPagePage

    await perApi.addComponent(TENANT, PAGE, 'cards', 'into-before',
      'sample')
    await I.refreshPage()
    await I.waitForNavigation()
    await editView.cardsComponent.seeNumber(1)
    await editView.selectNthInlineEdit(1)
    await editable.copy()
    await editable.paste()
    await editView.cardsComponent.seeNumber(2)
  })