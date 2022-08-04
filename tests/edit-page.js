/**
 * single-test run:
 * npm run test -- ./tests/edit-page.js
 */

const utils = require('../src/modules/utils')

const FEATURE_NAME = 'edit-page'
let TENANT
const PAGE = FEATURE_NAME

Feature(FEATURE_NAME)

Before(async ({ I, loginAs, perApi, pagesPage, editPagePage }) => {
  TENANT = utils.generateRandomName()
  await perApi.createTenant(TENANT)
  await perApi.createPage(TENANT, PAGE)
  await loginAs('admin')
  // We need to wait here to allow Peregrine to finish creating the page otherwise the references might not be in place
  await I.wait(3)
  await pagesPage.navigate(TENANT)
})

After(async ({ perApi }) => {
  await perApi.deleteTenant(TENANT)
})

Scenario('open first reference of "Home"', async ({ I, pagesPage, editPagePage }) => {
  await pagesPage.editPage('Home')
  // await I.wait(10)
  await editPagePage.rightPanel.openReferencesTab()
  await I.wait(2)
  await editPagePage.rightPanel.clickReference(1)
  await I.seeInCurrentUrl('/templates/footer')
})
