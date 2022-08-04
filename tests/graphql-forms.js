/**
 * single-test run:
 * npm run test -- ./tests/graphql-forms.js
 */

const utils = require('../src/modules/utils')

const FEATURE_NAME = 'graphql-forms'
let TENANT
const OBJECT_NAME_PREFIX = 'pw-test-object-contact'
const ALL_OBJECT_DEFINITIONS_NAME = 'example-form-all'
const CONTACT_OBJECT_DEFINITIONS_NAME = 'example-form-contact'

Feature(FEATURE_NAME)

Before(async ({loginAs, perApi, pagesPage, graphql}) => {
  TENANT = utils.generateRandomName()
  await perApi.createTenant(TENANT)
  for(let i = 0; i < 3; i++) {
    await graphql.createObjectFromDefinitions(
      perApi, TENANT, `${OBJECT_NAME_PREFIX}-${i}`, CONTACT_OBJECT_DEFINITIONS_NAME, {'email': `test-${i}@test.com`, 'text': `Hi There ${i}`}
    )
  }
  await graphql.createObjectFromDefinitions( perApi, TENANT, `${OBJECT_NAME_PREFIX}-4`, ALL_OBJECT_DEFINITIONS_NAME)
  await graphql.createObjectFromDefinitions( perApi, TENANT, `${OBJECT_NAME_PREFIX}-5`, ALL_OBJECT_DEFINITIONS_NAME)
  await loginAs('admin')
  await pagesPage.navigate(TENANT)
})

After(async ({perApi}) => {
  for(let i = 0; i < 5; i++) {
    await perApi.deleteObject(TENANT, `${OBJECT_NAME_PREFIX}-${i}`)
  }
  await perApi.deleteTenant(TENANT)
})

Scenario('Check GraphQL Query over Contact Form List',
  async ({I, graphql}) => {
    let query = 'query {\n' +
      '  exampleFormContactObjectList {\n' +
      '    items {\n' +
      '      _path\n' +
      '      email\n' +
      '    }\n' +
      '  }\n' +
      '}'
    let queryResult = await graphql.executeQuery(
      TENANT, query
    )
    let result = JSON.parse(queryResult)
    console.log(`Result form Query: ${JSON.stringify(result, null, ' ')}`)
    let expectedResult = {
      "data": {
        "exampleFormContactObjectList": {
          "items": [
            {
              "_path": `/content/${TENANT}/objects/pw-test-object-contact-0`,
              "email": "test-0@test.com"
            },
            {
              "_path": `/content/${TENANT}/objects/pw-test-object-contact-1`,
              "email": "test-1@test.com"
            },
            {
              "_path": `/content/${TENANT}/objects/pw-test-object-contact-2`,
              "email": "test-2@test.com"
            }
          ]
        }
      }
    }
  }
)

Scenario('Check GraphQL Query over All Form List',
  async ({I, graphql}) => {
    let query = 'query {\n' +
      '  exampleFormAllObjectList {\n' +
      '    items {\n' +
      '      _path\n' +
      '    }\n' +
      '  }\n' +
      '}'
    let queryResult = await graphql.executeQuery(
      TENANT, query
    )
    let result = JSON.parse(queryResult)
    console.log(`Result form Query: ${JSON.stringify(result, null, ' ')}`)
    let expectedResult = {
      "data": {
        "exampleFormAllObjectList": {
          "items": [
            {
              "_path": `/content/${TENANT}/objects/pw-test-object-contact-4`
            },
            {
              "_path": `/content/${TENANT}/objects/pw-test-object-contact-5`
            }
          ]
        }
      }
    }
    await graphql.checkQueryJSonResult(result, expectedResult)
  }
)

Scenario('Check GraphQL Query of All By Path',
  async ({I, graphql}) => {
    let query = 'query {\n' +
      `  exampleFormAllObjectByPath(_path: "/content/${TENANT}/objects/pw-test-object-contact-5") {\n` +
      '    item {\n' +
      '      _path\n' +
      '      number\n' +
      '    }\n' +
      '  }\n' +
      '}'
    let queryResult = await graphql.executeQuery(
      TENANT, query
    )
    let result = JSON.parse(queryResult)
    console.log(`Result form Query: ${JSON.stringify(result, null, ' ')}`)
    let expectedResult = {
      "data": {
        "exampleFormAllObjectByPath": {
          "item": {
            "_path": `/content/${TENANT}/objects/pw-test-object-contact-5`,
            "number": null
          }
        }
      }
    }
    await graphql.checkQueryJSonResult(result, expectedResult)
})
