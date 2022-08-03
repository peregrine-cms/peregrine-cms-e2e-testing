/**
 * single-test run:
 * npm run test -- ./tests/objects.js
 */

const {Object} = require('../src/const')
const expect = require('expect')
const utils = require('../src/modules/utils')
const {setup} = require('../src/modules/setup')

const FEATURE_NAME = 'objects'
let TENANT
const EXAMPLE_FORM_ALL_NAME = 'example-form-all'
const OBJECT_NAME = 'e2e-test-objects'
const OBJECT_NAME_ALL = 'example-from-all-object-1'
const STRING_VARIABLE_NAME = "string"
const STRING_VARIABLE_VALUE = "test-string-1"

Feature(FEATURE_NAME)

Before(async ({I, loginAs, perApi, objectsPage}) => {
  await setup()
  TENANT = utils.generateRandomName()
  await perApi.createTenant(TENANT)
  await perApi.createObject(TENANT, OBJECT_NAME, 'example/objects/collection')
  await loginAs('admin')
  await I.wait(3)
  await objectsPage.navigate(TENANT)
})

After(async ({perApi}) => {
  await perApi.deleteTenant(TENANT)
})

// Create a new Object from an Object Definitions
Scenario('create a new object',
  async ({I, objectsPage}) => {
    await objectsPage.createNew(EXAMPLE_FORM_ALL_NAME, OBJECT_NAME_ALL)
    await objectsPage.checkEntryByLabel(OBJECT_NAME_ALL)
  }
)

// Create a new Object from an Object Definitions
Scenario('delete an object',
  async ({I, objectsPage}) => {
    await objectsPage.checkEntryByLabel(OBJECT_NAME)
    await objectsPage.deleteEntry(OBJECT_NAME)
  }
)

// Create a new Object from an Object Definitions
Scenario('edit an object',
  async ({I, objectsPage, perApi}) => {
    await objectsPage.createNew(EXAMPLE_FORM_ALL_NAME, OBJECT_NAME_ALL)
    await objectsPage.checkEntryByLabel(OBJECT_NAME_ALL)
    await objectsPage.editEnty(OBJECT_NAME_ALL)
    // console.log(`Check right panel: ${OBJECT_NAME_ALL}`)
    await objectsPage.rightPanel.fillInput(STRING_VARIABLE_NAME, STRING_VARIABLE_VALUE)
    // console.log(`Save Changes to ${OBJECT_NAME}`)
    await objectsPage.saveChanges(OBJECT_NAME_ALL)
    await I.wait(2)
    // Check the object content to make sure the content is saved
    let response = await objectsPage.getObject(TENANT, OBJECT_NAME_ALL)
    const stringValue = response.data[STRING_VARIABLE_NAME]
    expect(stringValue).toBe(STRING_VARIABLE_VALUE)
  }
)

Scenario('remove all items from collection',
    async ({I, perApi, objectsPage}) => {
      const deleteBtnLocator = objectsPage.rightPanel.locator.body()
          .find('.delete-icon').as('delete-btn')

      console.log(`Update Object: ${OBJECT_NAME}`)
      await perApi.updateObject(
          TENANT,
          OBJECT_NAME,
          '/apps/example/objects/collection',
          {
            //'singleList': ['foo', 'bar'],
            'list': [{'name': 'n1234567890', 'key': 'foo', 'value': 'bar'}]
          }
      )
      await I.wait(5)
      await I.refreshPage()
      console.log(`Edit Object: ${OBJECT_NAME}`)
      await objectsPage.editEnty(OBJECT_NAME)
      console.log(`Object Info Tab`)
      await objectsPage.rightPanel.openInfoTab()
      //AS TODO: no more dialogs so this does not work
      // await rightPanel.clickEditBtn()
      // await I.wait(5)
      console.log(`Click Delete Btn`)
      await I.click(deleteBtnLocator)
      //AS TODO: no more dialogs so this does not work - for now we switch the UI to trigger the save dialog
      // await I.wait(5)
      //AS TODO: No more Save Button -> switch
      // await rightPanel.clickSaveBtn()
      // await I.seeInPopup('save edit?')
      // await I.acceptPopup()
      console.log(`Save Changes to ${OBJECT_NAME}`)
      await objectsPage.saveChanges(OBJECT_NAME)
      await I.wait(2)

      // /*
      // This is not supposed to happen. wait-mask should fade after finish loading
      // see issue #254 or more information
      //  */
      // await I.seeElement(locate('#waitMask').as('waiting-mask'))
      // pause()
    })
