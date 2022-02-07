/**
 * single-test run:
 * npm run test -- ./tests/graphql-pages.js
 */

const utils = require('../src/modules/utils')
const {setup} = require('../src/modules/setup')

const FEATURE_NAME = 'graphql-pages'
let TENANT
const PAGE_NAME = 'index'
const PAGE = 'simple-text-page'
const CARDS_PERSON_TITLES = ['Person 1', 'Person 2', 'Person 3', 'Person 4', 'Position 5', 'Position 6']
const CARDS_SERVICE_TITLES = ['Service 1', 'Service 2', 'Service 3']
const IMAGE_PATH = 'assets/placeholders/16x9.png'

Feature(FEATURE_NAME)

Before(async ({loginAs, perApi, pagesPage, graphql}) => {
  await setup()
  TENANT = utils.generateRandomName()
  await perApi.createTenant(TENANT)
  await perApi.createPage(TENANT, PAGE)
  await perApi.addComponent(TENANT, PAGE, 'simpletext', 'into-into', 'sample')
  await perApi.addComponent(TENANT, PAGE, 'simpletext', 'into-into', 'sample')
  await perApi.addComponent(TENANT, PAGE, 'simpletext', 'into-into', 'sample')
  await loginAs('admin')
  await pagesPage.navigate(TENANT)
})

After(async ({perApi}) => {
  await perApi.deleteTenant(TENANT)
})

Scenario('Check GraphQL Query over Cards',
  async ({I, graphql}) => {
    let query = 'query {\n' +
      '  cardsComponentList {\n' +
      '    items {\n' +
      '      _path\n' +
      '      cards {\n' +
      '        title\n' +
      '        text\n' +
      '        image\n' +
      '      }\n' +
      '    }\n' +
      '  }\n' +
      '}';
    let queryResult = await graphql.executeQuery(
      TENANT, query
    )
    let result = JSON.parse(queryResult)
    console.log(`Result form Query: ${JSON.stringify(result, null, ' ')}`)
    let imagePath = `/content/${TENANT}/${IMAGE_PATH}`
    let expectedResult = {
      "data": {
        "cardsComponentList": {
          "items": [
            {
              "_path": `/content/${TENANT}/pages/skeleton-pages/team/jcr:content`,
              "CHECK-_path": "startsWith",
              "cards": [
                {
                  "title": CARDS_PERSON_TITLES,
                  "CHECK-title": "includes",
                  'text': '',
                  "CHECK-text": "ignored",
                  'image': '',
                  "CHECK-image": "ignored"
                }
              ],
              "CHECK-cards": "applyToAll"
            },
            {
              "_path": `/content/${TENANT}/pages/${PAGE_NAME}/jcr:content`,
              "CHECK-_path": "startsWith",
              "cards": [
                {
                  "title": CARDS_SERVICE_TITLES,
                  "CHECK-title": "includes",
                  'text': '',
                  "CHECK-text": "ignored",
                  "image": `${imagePath}`
                }
              ],
              "CHECK-cards": "applyToAll"
            }
          ]
        }
      }
    }
    await graphql.checkQueryJSonResult(result, expectedResult)
  }
)

Scenario('Check GraphQL Query By Path',
  async ({I, graphql, pagesPage, editPagePage, perApi}) => {
    // Setup the Page with the Proper Text / Element settings
    await perApi.addComponent(TENANT, PAGE, 'simpletext', 'into-into', 'sample')
    await pagesPage.editPage(PAGE)
    await editPagePage.editView.setNthInlineEditContent(1, 'Text Header H1')
    await editPagePage.rightPanel.selectElement('h1')
    await editPagePage.editView.setNthInlineEditContent(2, 'Text Header H2')
    await editPagePage.rightPanel.selectElement('h2')
    await editPagePage.editView.setNthInlineEditContent(3, 'Second Text Header H1')
    await editPagePage.rightPanel.selectElement('h1')
    await editPagePage.editView.setNthInlineEditContent(4, 'Text Content')
    await editPagePage.rightPanel.saveChanges()
    await I.wait(2)

    let query = 'query {\n' +
      '  simpletextComponentByPath(\n' +
      `    _path: "/content/${TENANT}/pages/simple-text-page"\n` +
      '  ) {\n' +
      '    items {\n' +
      '      _path\n' +
      '      _pagePath\n' +
      '      text\n' +
      '      element\n' +
      '    }\n' +
      '  }\n' +
      '}'
    let queryResult = await graphql.executeQuery(
      TENANT, query
    )
    let result = JSON.parse(queryResult)
    console.log(`Result form Query: ${JSON.stringify(result, null, ' ')}`)
    let imagePath = `/content/${TENANT}/${IMAGE_PATH}`
    let expectedResult = {
      "data": {
        "simpletextComponentByPath": {
          "items": [
            {
              "_path": `/content/${TENANT}/pages/simple-text-page`,
              "CHECK-_path": "startsWith",
              "_pagePath": `/content/${TENANT}/pages/simple-text-page`,
              "text": "Text Header H1",
              "element": "h1"
            },
            {
              "_path": `/content/${TENANT}/pages/simple-text-page`,
              "CHECK-_path": "startsWith",
              "_pagePath": `/content/${TENANT}/pages/simple-text-page`,
              "text": "Text Header H2",
              "element": "h2"
            },
            {
              "_path": `/content/${TENANT}/pages/simple-text-page`,
              "CHECK-_path": "startsWith",
              "_pagePath": `/content/${TENANT}/pages/simple-text-page`,
              "text": "Second Text Header H1",
              "element": "h1"
            },
            {
              "_path": `/content/${TENANT}/pages/simple-text-page`,
              "CHECK-_path": "startsWith",
              "_pagePath": `/content/${TENANT}/pages/simple-text-page`,
              "text": "Text Content",
              "element": "p"
            }
          ]
        }
      }
    }
    await graphql.checkQueryJSonResult(result, expectedResult)
  }
)

Scenario('Check GraphQL Query By Path and Field Value',
  async ({I, graphql, pagesPage, editPagePage}) => {
    // Setup the Page with the Proper Text / Element settings
    await pagesPage.editPage(PAGE)
    await editPagePage.editView.setNthInlineEditContent(1, 'Text Header H1')
    await editPagePage.rightPanel.selectElement('h1')
    await editPagePage.editView.setNthInlineEditContent(2, 'Text Header H2')
    await editPagePage.rightPanel.selectElement('h2')
    await editPagePage.editView.setNthInlineEditContent(3, 'Text Content')
    await editPagePage.rightPanel.saveChanges()
    await I.wait(2)

    let query = 'query {\n' +
      '  simpletextComponentByField(\n' +
      // `    _path: "/content/${TENANT}/pages/simple-text-page",\n` +
      '    fieldName: "element",\n' +
      '    fieldValue: "h1"\n' +
      '  ) {\n' +
      '    items {\n' +
      '      _path\n' +
      '      text\n' +
      '      element\n' +
      '    }\n' +
      '  }\n' +
      '}'
    let queryResult = await graphql.executeQuery(
      TENANT, query
    )
    let result = JSON.parse(queryResult)
    console.log(`Result form Query: ${JSON.stringify(result, null, ' ')}`)
    let imagePath = `/content/${TENANT}/${IMAGE_PATH}`
    let expectedResult = {
      "data": {
        "simpletextComponentByField": {
          "items": [
            {
              "_path": `/content/${TENANT}/pages/authors`,
              "CHECK-_path": "startsWith",
              "text": "Our Authors",
              "element": "h1"
            },
            {
              "_path": `/content/${TENANT}/pages/sitemap`,
              "CHECK-_path": "startsWith",
              "text": "Sitemap",
              "element": "h1"
            },
            {
              "_path": `/content/${TENANT}/pages/simple-text-page`,
              "CHECK-_path": "startsWith",
              "text": "Text Header H1",
              "element": "h1"
            }
          ]
        }
      }
    }
    await graphql.checkQueryJSonResult(result, expectedResult)
  }
)
