/**
 * single-test run:
 * npm run test -- ./tests/edit-page.js
 */

const utils = require('../src/modules/utils')

const FEATURE_NAME = 'edit-page'
let TENANT = utils.generateRandomName()
const PAGE = FEATURE_NAME

Feature(FEATURE_NAME)

Before(async ({ loginAs, perApi, pagesPage, editPagePage }) => {
  TENANT = utils.generateRandomName()
  await perApi.createTenant(TENANT)
  await perApi.createPage(TENANT, PAGE)
  await loginAs('admin')
  pagesPage.navigate(TENANT)
})

After(({ perApi }) => {
  perApi.deleteTenant(TENANT)
})

Scenario('open first reference of "Home"', async ({ I, pagesPage, editPagePage }) => {
  pagesPage.editPage('Home')
  editPagePage.rightPanel.openReferencesTab()
  editPagePage.rightPanel.clickReference(1)
  I.seeInCurrentUrl('/templates/footer')
})