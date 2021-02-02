/**
 * single-test run:
 * npm run test -- ./tests/edit-page.js
 */

const FEATURE_NAME = 'edit-page'
const TENANT = 'pcms_testing'
const PAGE = FEATURE_NAME

Feature(FEATURE_NAME)

Before(async ({loginAs, perApi, pagesPage, editPagePage}) => {
  await perApi.createTenant(TENANT)
  await perApi.createPage(TENANT, PAGE)
  await loginAs('admin')
  pagesPage.navigate(TENANT)
})

After(({perApi}) => {
  perApi.deleteTenant(TENANT)
})

Scenario('open first reference of "Home"', async ({I, pagesPage, editPagePage}) => {
  pagesPage.editPage('Home')
  editPagePage.rightPanel.openReferencesTab()
  editPagePage.rightPanel.clickReference(1)
  I.seeInCurrentUrl('/templates/footer')
})