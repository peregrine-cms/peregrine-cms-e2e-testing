/**
 * single-test run:
 * npm run test -- ./tests/range-slider.js
 */

const utils = require('../src/modules/utils')
const expect = require('expect')

const FEATURE_NAME = 'range-slider'
let TENANT
const PAGE = FEATURE_NAME

let topPadding

Feature(FEATURE_NAME)

Before(async ({ loginAs, perApi, pagesPage, editPagePage }) => {
  TENANT = utils.generateRandomName()
  await perApi.createTenant(TENANT)
  await perApi.createPage(TENANT, PAGE)
  await perApi.addComponent(
    TENANT, PAGE, 'simpletext', 'into-before', 'example')
  await loginAs('admin')
  pagesPage.navigate(TENANT)
  pagesPage.editPage(PAGE)
  editPagePage.editView.selectNthInlineEdit(1)
  const { editorPanel } = editPagePage
  editorPanel.titleIs('Text')
  topPadding = editorPanel.getNthRangeField(1)
})

After(({ perApi }) => {
  perApi.deleteTenant(TENANT)
})

async function expectEmpty() {
  expect(await topPadding.grabInputValue())
    .toBe("")
  expect(await topPadding.grabRangeValue())
    .toBe("50")
}

async function expectValue(val) {
  expect(await topPadding.grabInputValue())
    .toBe(val.toString())
  expect(await topPadding.grabRangeValue())
    .toBe(val.toString())
}

Scenario('test range slider button', async ({ I }) => {
  await expectEmpty()

  topPadding.clickButton()
  await expectValue(0)

  topPadding.clickButton()
  await expectEmpty()
})

Scenario('test range slider input', async ({ I }) => {
  topPadding.setInputValue(75)
  await expectValue(75)

  topPadding.clickButton()
  await expectEmpty()
})

Scenario('test range slider range', async ({ I }) => {
  topPadding.clickButton()
  await expectValue(0)

  topPadding.selectRange()
  await expectValue(150)

  I.pressKey('ArrowLeft')
  await expectValue(149)

  I.pressKeyRepeatedly('ArrowRight', 6)
  await expectValue(155)
})
