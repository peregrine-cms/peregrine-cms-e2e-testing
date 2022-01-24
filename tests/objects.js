/**
 * single-test run:
 * npm run test -- ./tests/objects.js
 */

const {Object} = require('../src/const')
const {setup} = require('../src/modules/setup')

const FEATURE_NAME = 'objects'
const TENANT = 'example'
const OBJECT_NAME = 'e2e-test-objects'

Feature(FEATURE_NAME)

Before(async ({I, loginAs, perApi, objectsPage}) => {
  await setup()
  await perApi.createObject(TENANT, OBJECT_NAME, 'example/objects/collection')
  await loginAs('admin')
  await I.wait(3)
  await objectsPage.navigate(TENANT)
})

After(async ({perApi}) => {
  await perApi.deleteObject(TENANT, OBJECT_NAME)
})

Scenario('remove all items from collection',
    async ({I, perApi, objectsPage}) => {
      const {
        explorer: {
          rightPanel
        }
      } = objectsPage
      const deleteBtnLocator = rightPanel.locator.body()
          .find('.delete-icon').as('delete-btn')

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
      await objectsPage.editObject(OBJECT_NAME)
      await rightPanel.openInfoTab()
      //AS TODO: no more dialogs so this does not work
      // await rightPanel.clickEditBtn()
      // await I.wait(5)
      await I.click(deleteBtnLocator)
      //AS TODO: no more dialogs so this does not work - for now we switch the UI to trigger the save dialog
      // await I.wait(5)
      //AS TODO: No more Save Button -> switch
      // await rightPanel.clickSaveBtn()
      // await I.seeInPopup('save edit?')
      // await I.acceptPopup()
      await objectsPage.saveChanges(OBJECT_NAME)
      await I.wait(20)

      // /*
      // This is not supposed to happen. wait-mask should fade after finish loading
      // see issue #254 or more information
      //  */
      // await I.seeElement(locate('#waitMask').as('waiting-mask'))
      // pause()
    })
