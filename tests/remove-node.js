/**
 * single-test run:
 * npm run test -- ./tests/remove-node.js
 */

const utils = require('../src/modules/utils')

const FEATURE_NAME = 'remove-node'
let TENANT
const PAGE = FEATURE_NAME
const ASSET = FEATURE_NAME
const OBJECT = FEATURE_NAME
const TEMPLATE = FEATURE_NAME

Feature(FEATURE_NAME)

Before(async ({ I, loginAs, perApi, pagesPage, editPagePage }) => {
  TENANT = utils.generateRandomName()
  await perApi.createTenant(TENANT)
  await loginAs('admin')
  await I.wait(3)
})

After(async ({ perApi }) => {
  await perApi.deleteTenant(TENANT)
})

Scenario('delete page', async ({ perApi, pagesPage }) => {
  await perApi.createPage(TENANT, PAGE)
  await pagesPage.navigate(TENANT)
  await pagesPage.deletePage(PAGE)
})

Scenario('delete asset', async ({ I, perApi, assetsPage }) => {
  await perApi.createFolder(TENANT, 'assets', ASSET)
  await assetsPage.navigate(TENANT)
  await assetsPage.deleteAsset(ASSET)
})

Scenario('delete object', async ({ perApi, objectsPage }) => {
  await perApi.createObject(TENANT, OBJECT)
  await objectsPage.navigate(TENANT)
  await objectsPage.deleteEntry(OBJECT)
})

Scenario('delete template', async ({ perApi, templatesPage }) => {
  await perApi.createTemplate(TENANT, TEMPLATE)
  await templatesPage.navigate(TENANT)
  await templatesPage.deleteTemplate(TEMPLATE)
})
