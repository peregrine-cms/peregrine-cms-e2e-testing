/**
 * single-test run:
 * npm run test -- ./tests/object-definitions.js
 */

// const {Object} = require('../src/const')
const expect = require('expect')
const utils = require('../src/modules/utils')
const {setup} = require('../src/modules/setup')
const ExplorerPage = require('../src/pages/ExplorerPage')
// const FileEditorPage = require('../src/pages/FileEditorPage')
// const {Request} = require('../src/helpers/ExtendedRest2')

const FEATURE_NAME = 'object-definitions'
let TENANT
const EXAMPLE_FORM_ALL_NAME = 'example-form-all'
const OBJECT_DEFINITION_NAME = 'e2e-test-object-definitions'
const OBJECT_NAME = 'e2e-test-object-1'
// const STRING_VARIABLE_NAME = "string"
const STRING_VARIABLE_NAME = "testString1"
const STRING_VARIABLE_VALUE = "my test value one"
const DIALOG_JSON_NAME = "dialog.json"
const JSON_SCHEMA_JSON_NAME = "json-schema.json"
const UI_SCHEMA_JSON_NAME = "ui-schema.json"
const DIALOG_CONTENT = `{"type":"input","inputType":"text","label":"${STRING_VARIABLE_NAME}","model":"${STRING_VARIABLE_NAME}"}`
const JSON_SCHEMA_CONTENT = `"${STRING_VARIABLE_NAME}":{"type":"string","description":"Test-String-One"}`
const UI_SCHEMA_CONTENT = `{"type":"Control","scope":"#/properties/${STRING_VARIABLE_NAME}"}`

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
  await perApi.deleteTenant(TENANT)
})

// Things to Test
//
// 1. Open Example Form All OD and check JSon files

Scenario('Check Example Form All Object-Definitions',
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

Scenario('Create a New Object Definition and fill in Schemas',
  async ({I, objectDefinitionsPage}) => {
    // Create new OD
    await objectDefinitionsPage.createNew(OBJECT_DEFINITION_NAME)
    await objectDefinitionsPage.showDetails(OBJECT_DEFINITION_NAME)
    const details = new ExplorerPage(FEATURE_NAME + "/" + OBJECT_DEFINITION_NAME)
    await details.checkBreadcrumbs()
    await objectDefinitionsPage.checkEntryByLabel(DIALOG_JSON_NAME)
    await objectDefinitionsPage.checkEntryByLabel(JSON_SCHEMA_JSON_NAME)
    await objectDefinitionsPage.checkEntryByLabel(UI_SCHEMA_JSON_NAME)
    await objectDefinitionsPage.clickBreadcrumb(OBJECT_DEFINITION_NAME)
    // Fill the JSon Files

    let content = '{"type":"input","inputType":"text","label":"test-string-1","model":"string"}'
    await objectDefinitionsPage.editSchema(TENANT, OBJECT_DEFINITION_NAME, DIALOG_JSON_NAME, content, 13)
    let rawContent = await objectDefinitionsPage.getSchemaContent(TENANT, OBJECT_DEFINITION_NAME, DIALOG_JSON_NAME)
    expect(rawContent).toBe(`{"fields":[${content}]}`)

    await objectDefinitionsPage.editSchema(TENANT, OBJECT_DEFINITION_NAME, JSON_SCHEMA_JSON_NAME, JSON_SCHEMA_CONTENT, 33)
    rawContent = await objectDefinitionsPage.getSchemaContent(TENANT, OBJECT_DEFINITION_NAME, JSON_SCHEMA_JSON_NAME)
    expect(rawContent).toBe(`{"type":"object","properties":{${JSON_SCHEMA_CONTENT}}}`)

    await objectDefinitionsPage.editSchema(TENANT, OBJECT_DEFINITION_NAME, UI_SCHEMA_JSON_NAME, content, 41)
    rawContent = await objectDefinitionsPage.getSchemaContent(TENANT, OBJECT_DEFINITION_NAME, UI_SCHEMA_JSON_NAME)
    expect(rawContent).toBe(`{"type":"VerticalLayout","elements":[${content}]}`)
  }
)

// 3. Create a new OD and then create a Object from it

Scenario('Create a New Object Definition with Schemas and create Object From It',
  async ({I, objectDefinitionsPage, objectsPage}) => {
    // Create new OD
    await objectDefinitionsPage.createNew(OBJECT_DEFINITION_NAME)
    await objectDefinitionsPage.showDetails(OBJECT_DEFINITION_NAME)
    const details = new ExplorerPage(FEATURE_NAME + "/" + OBJECT_DEFINITION_NAME)
    await details.checkBreadcrumbs()
    await objectDefinitionsPage.checkEntryByLabel(DIALOG_JSON_NAME)
    await objectDefinitionsPage.checkEntryByLabel(JSON_SCHEMA_JSON_NAME)
    await objectDefinitionsPage.checkEntryByLabel(UI_SCHEMA_JSON_NAME)
    await objectDefinitionsPage.clickBreadcrumb(OBJECT_DEFINITION_NAME)
    // Fill the JSon Files

    await objectDefinitionsPage.editSchema(TENANT, OBJECT_DEFINITION_NAME, DIALOG_JSON_NAME, DIALOG_CONTENT, 13)
    let rawContent = await objectDefinitionsPage.getSchemaContent(TENANT, OBJECT_DEFINITION_NAME, DIALOG_JSON_NAME)
    expect(rawContent).toBe(`{"fields":[${DIALOG_CONTENT}]}`)

    await objectDefinitionsPage.editSchema(TENANT, OBJECT_DEFINITION_NAME, JSON_SCHEMA_JSON_NAME, JSON_SCHEMA_CONTENT, 33)
    rawContent = await objectDefinitionsPage.getSchemaContent(TENANT, OBJECT_DEFINITION_NAME, JSON_SCHEMA_JSON_NAME)
    expect(rawContent).toBe(`{"type":"object","properties":{${JSON_SCHEMA_CONTENT}}}`)

    await objectDefinitionsPage.editSchema(TENANT, OBJECT_DEFINITION_NAME, UI_SCHEMA_JSON_NAME, UI_SCHEMA_CONTENT, 41)
    rawContent = await objectDefinitionsPage.getSchemaContent(TENANT, OBJECT_DEFINITION_NAME, UI_SCHEMA_JSON_NAME)
    expect(rawContent).toBe(`{"type":"VerticalLayout","elements":[${UI_SCHEMA_CONTENT}]}`)

    // Go to Objects, create one from our test OD and check the input field
    await objectsPage.navigate(TENANT)
    await objectsPage.createNew(OBJECT_DEFINITION_NAME, OBJECT_NAME)
    await objectsPage.checkEntryByLabel(OBJECT_NAME)
    await objectsPage.editEntry(OBJECT_NAME)
    await objectsPage.rightPanel.fillInput(STRING_VARIABLE_NAME, STRING_VARIABLE_VALUE)
    await objectsPage.saveChanges(OBJECT_NAME)
    await I.wait(2)
    let response = await objectsPage.getObject(TENANT, OBJECT_NAME)
    const stringValue = response.data[STRING_VARIABLE_NAME]
    expect(stringValue).toBe(STRING_VARIABLE_VALUE)
  }
)
