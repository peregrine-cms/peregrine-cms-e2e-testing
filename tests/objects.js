/**
 * single-test run:
 * npm run test -- ./tests/objects.js
 */

const {Object} = require('../src/const')

const FEATURE_NAME = 'objects'
const TENANT = 'example'
const OBJECT_NAME = 'e2e-test-objects'

Feature(FEATURE_NAME)

Before(async ({loginAs, perApi, objectsPage}) => {
  await perApi.createObject(TENANT, OBJECT_NAME, 'example/objects/collection')
  await loginAs('admin')
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
      I.refreshPage()
      objectsPage.editObject(OBJECT_NAME)
      rightPanel.openInfoTab()
      rightPanel.clickEditBtn()
      I.click(deleteBtnLocator)
      rightPanel.clickSaveBtn()
      I.seeInPopup('save edit?')
      I.acceptPopup()
      I.seeElement(locate('#waitMask').as('waiting-mask'))
    })
