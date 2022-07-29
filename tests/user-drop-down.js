/**
 * single-test run:
 * npm run test -- ./tests/user-drop-down.js
 */

const utils = require('../src/modules/utils')
const expect = require('expect')
const clipboardy = require('clipboardy')
const {setup} = require('../src/modules/setup')

const FEATURE_NAME = 'user-drop-down'
let TENANT

Feature(FEATURE_NAME)

Before(async ({ I, loginAs, perApi, assetsPage }) => {
  setup()
  TENANT = utils.generateRandomName()
  await perApi.createTenant(TENANT)
  await loginAs('admin')
  await I.wait(3)
  await assetsPage.navigate(TENANT)
})

After(async ({ perApi }) => {
  await perApi.deleteTenant(TENANT)
})

Scenario('copy username', async ({ welcomePage, I }) => {
  const {
    topNav
  } = welcomePage

  await topNav.toggleUserDropDown()
  let username = await topNav.grabTextFromUsername()
  username = username.trim()
  await topNav.copyUsername()
  const clipboard = await clipboardy.readSync()

  console.log(`Copy Username, clipboard: '${clipboard}', username: '${username}'`)
  expect(clipboard).toBe(username)
})
