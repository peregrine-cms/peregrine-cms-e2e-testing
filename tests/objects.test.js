/**
 * single-test run:
 * npm run test -- ./tests/objects.test.js
 * npm run test:headful -- ./tests/objects.test.js
 */

const { toFeatureName, generateRandomName } = require('../src/modules/utils');

const TENANT = generateRandomName();
const OBJECT_NAME = generateRandomName();

Feature(toFeatureName(__filename));

Before(async ({ loginAs, perApi, objectsPage }) => {
  await perApi.createObject(TENANT, OBJECT_NAME, 'example/objects/collection');
  await loginAs('admin');
  await objectsPage.navigate(TENANT);
});

After(async ({ perApi }) => {
  await perApi.deleteObject(TENANT, OBJECT_NAME);
});

Scenario(
  'remove all items from collection',
  async ({ I, perApi, objectsPage }) => {
    const {
      explorer: { rightPanel },
    } = objectsPage;
    const deleteBtnLocator = rightPanel.locator
      .body()
      .find('.delete-icon')
      .as('delete-btn');

    await perApi.updateObject(
      TENANT,
      OBJECT_NAME,
      '/apps/example/objects/collection',
      {
        //'singleList': ['foo', 'bar'],
        list: [{ name: 'n1234567890', key: 'foo', value: 'bar' }],
      }
    );
    I.refreshPage();
    objectsPage.editObject(OBJECT_NAME);
    rightPanel.openInfoTab();
    rightPanel.clickEditBtn();
    I.click(deleteBtnLocator);
    rightPanel.clickSaveBtn();
    I.seeInPopup('save edit?');
    I.acceptPopup();
    /*
      This is not supposed to happen. wait-mask should fade after finish loading
      see issue #254 or more information
       */
    I.seeElement(locate('#waitMask').as('waiting-mask'));
    pause();
  }
);
