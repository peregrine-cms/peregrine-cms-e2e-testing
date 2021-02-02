/**
 * single-test run:
 * npm run test -- ./tests/remove-node.js
 */

const FEATURE_NAME = 'remove-node'
const TENANT = 'pcms_testing'
const PAGE = FEATURE_NAME
const ASSET = FEATURE_NAME
const OBJECT = FEATURE_NAME
const TEMPLATE = FEATURE_NAME

Feature(FEATURE_NAME)

Before(async ({loginAs, perApi, pagesPage, editPagePage}) => {
  await perApi.createTenant(TENANT)
  await loginAs('admin')
})

After(({perApi}) => {
  perApi.deleteTenant(TENANT)
})

Scenario('delete page', async ({perApi, pagesPage}) => {
  await perApi.createPage(TENANT, PAGE)
  pagesPage.navigate(TENANT)
  pagesPage.deletePage(PAGE)
})

Scenario('delete asset', async ({I, perApi, assetsPage}) => {
  await perApi.createFolder(TENANT, 'assets', ASSET)
  assetsPage.navigate(TENANT)
  assetsPage.deleteAsset(ASSET)
})

Scenario('delete object', async ({perApi, objectsPage}) => {
  await perApi.createObject(TENANT, OBJECT)
  objectsPage.navigate(TENANT)
  objectsPage.deleteObject(OBJECT)
})

Scenario('delete template', async ({perApi, templatesPage}) => {
  await perApi.createTemplate(TENANT, TEMPLATE)
  templatesPage.navigate(TENANT)
  templatesPage.deleteTemplate(TEMPLATE)
})
