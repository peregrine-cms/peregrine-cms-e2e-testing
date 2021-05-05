/**
 * single-test run:
 * npm run test -- ./tests/explorer.js
 */

const utils = require('../src/modules/utils')

const FEATURE_NAME = 'explorer'
const TENANT = utils.generateRandomName()
const PAGE = FEATURE_NAME

Feature(FEATURE_NAME)

Before(async ({loginAs, perApi, pagesPage}) => {
  await perApi.createTenant(TENANT)
  await perApi.createPage(TENANT, PAGE)
  await loginAs('admin')
  pagesPage.navigate(TENANT)
})

After(({perApi}) => {
  perApi.deleteTenant(TENANT)
})

Scenario('open edit-page: item click', async ({I, pagesPage}) => {
  pagesPage.editPage(PAGE)
  I.seeInCurrentUrl(`/pages/${PAGE}`)
})

Scenario('open first "Home" reference', async ({I, pagesPage}) => {
  pagesPage.explorer.nodeInfo('page', 'Home')
  pagesPage.explorer.rightPanel.openReferencesTab()
  pagesPage.explorer.rightPanel.clickReference(1)
  I.seeInCurrentUrl('/templates/footer')
})