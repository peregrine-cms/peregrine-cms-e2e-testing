/**
 * single-test run:
 * npm run test -- ./tests/object-definitions.js
 */

const {Object} = require('../src/const')
const expect = require('expect')
const utils = require('../src/modules/utils')
const {setup} = require('../src/modules/setup')
const ExplorerPage = require('../src/pages/ExplorerPage')
const FileEditorPage = require('../src/pages/FileEditorPage')

const FEATURE_NAME = 'object-definitions'
let TENANT
const EXAMPLE_FORM_ALL_NAME = 'example-form-all'
const OBJECT_DEFINITION_NAME = 'e2e-test-object-definitions'
const OBJECT_NAME = 'e2e-test-object-1'
const STRING_VARIABLE_NAME = "string"
const STRING_VARIABLE_VALUE = "test-string-1"
const DIALOG_JSON_NAME = "dialog.json"
const JSON_SCHEMA_JSON_NAME = "json-schema.json"
const UI_SCHEMA_JSON_NAME = "ui-schema.json"

Feature(FEATURE_NAME)

Before(async ({I, loginAs, perApi, objectDefinitionsPage}) => {
  await setup()
  TENANT = utils.generateRandomName()
  await perApi.createTenant(TENANT)
  await loginAs('admin')
  await I.wait(3)
  await objectDefinitionsPage.navigate(TENANT)
})

After(async ({perApi}) => {
  // await perApi.deleteTenant(TENANT)
})

// Things to Test
//
// 1. Open Example Form All OD and check JSon files

Scenario.skip('Check Example Form All Object-Definitions',
  async ({I, objectDefinitionsPage}) => {
    await objectDefinitionsPage.checkEntryByLabel(EXAMPLE_FORM_ALL_NAME)
    await objectDefinitionsPage.showDetails(EXAMPLE_FORM_ALL_NAME)
    const details = new ExplorerPage(FEATURE_NAME + "/" + EXAMPLE_FORM_ALL_NAME)
    await details.checkBreadcrumbs()
    await objectDefinitionsPage.checkEntryByLabel(DIALOG_JSON_NAME)
    await objectDefinitionsPage.checkEntryByLabel(JSON_SCHEMA_JSON_NAME)
    await objectDefinitionsPage.checkEntryByLabel(UI_SCHEMA_JSON_NAME)
    await objectDefinitionsPage.goToOD(FEATURE_NAME);
  }
)

// 2. Create a new OD and fill in the JSon files

Scenario('Create a New Object Defition and set Definition Files',
  async ({I, objectDefinitionsPage}) => {
    // Create new OD
    await objectDefinitionsPage.createNew(OBJECT_DEFINITION_NAME)
    await objectDefinitionsPage.showDetails(OBJECT_DEFINITION_NAME)
    const details = new ExplorerPage(FEATURE_NAME + "/" + OBJECT_DEFINITION_NAME)
    await details.checkBreadcrumbs()
    await objectDefinitionsPage.checkEntryByLabel(DIALOG_JSON_NAME)
    await objectDefinitionsPage.checkEntryByLabel(JSON_SCHEMA_JSON_NAME)
    await objectDefinitionsPage.checkEntryByLabel(UI_SCHEMA_JSON_NAME)
    // Fill the JSon Files
    //TODO: Does not work as of now because of the usage of CodeMirror and the failure ot use it with Playwright
    await objectDefinitionsPage.selectEntryByLabel(DIALOG_JSON_NAME)
    const fileEditor = new FileEditorPage(TENANT, OBJECT_DEFINITION_NAME, DIALOG_JSON_NAME)
    await fileEditor.setContent('{"fields": [{"type":"input","inputType":"text","label":"test-string-1","model":"string"}]}')
    await objectDefinitionsPage.goToOD(FEATURE_NAME);
  }
)

// 3. Create a new OD and then create a Object from it
//TODO: as long as we cannot edit the JSon files of Object Definitions testing this odes not make much sense