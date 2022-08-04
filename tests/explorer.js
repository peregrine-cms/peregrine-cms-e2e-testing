/**
 * single-test run:
 * npm run test -- ./tests/explorer.js
 */

const utils = require('../src/modules/utils')
const {setup} = require('../src/modules/setup')

const FEATURE_NAME = 'explorer'
let TENANT
const PAGE = FEATURE_NAME

Feature(FEATURE_NAME)

Before(async ({ I, loginAs, perApi, pagesPage }) => {
  await setup()
  TENANT = utils.generateRandomName()
  await perApi.createTenant(TENANT)
  await perApi.createPage(TENANT, PAGE)
  await loginAs('admin')
  await I.wait(5)
  pagesPage.navigate(TENANT)
})

After(async ({ perApi }) => {
  await perApi.deleteTenant(TENANT)
})

Scenario('open edit-page: item click', async ({ I, pagesPage }) => {
  await pagesPage.editPage(PAGE)
  await I.seeInCurrentUrl(`/pages/${PAGE}`)
})

Scenario('open first "Home" reference', async ({ I, pagesPage }) => {
  await pagesPage.explorer.nodeInfo('page', 'Home')
  await pagesPage.explorer.rightPanel.openReferencesTab()
  await pagesPage.explorer.nodeInfo('page', 'Home')
  await pagesPage.explorer.rightPanel.clickReference(1)
  await I.seeInCurrentUrl('/templates/footer')
})
