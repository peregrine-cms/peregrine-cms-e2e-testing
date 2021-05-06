/**
 * single-test run:
 * npm run test -- ./tests/replication.js
 */

const utils = require('../src/modules/utils')

const FEATURE_NAME = 'replication'
let TENANT

Feature(FEATURE_NAME)

Before(async ({ loginAs, perApi, pagesPage }) => {
  TENANT = utils.generateRandomName()
  await perApi.createTenant(TENANT)
  await loginAs('admin')
  pagesPage.navigate(TENANT)
})

After(({perApi}) => {
  perApi.deleteTenant(TENANT)
})

Scenario('test range slider button 2', async ({ I, pagesPage }) => {
  const { explorer } = pagesPage
  const { modals } = explorer
  pagesPage.replicatePage('Home')
  modals.publishing.cancel()
  I.see('', {css:'a[title*="Home"] .item-replication-unknown'})
  I.see('', {css:'a[title*="Articles"] .item-replication-unknown'})
  I.see('', {css:'a[title*="Authors"] .item-replication-unknown'})
  pagesPage.replicatePage('Home')
  modals.publishing.confirm()
  I.see('', {css:'a[title*="Home"] .item-activated'})
  I.see('', {css:'a[title*="Articles"] .item-activated'})
  I.see('', {css:'a[title*="Authors"] .item-activated'})
  modals.notifyUser.confirm()
  pause()
})
