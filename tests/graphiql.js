/**
 * single-test run:
 * npm run test -- ./tests/graphiql.js
 */

const utils = require('../src/modules/utils')
const {setup} = require('../src/modules/setup')

const FEATURE_NAME = 'graphiql'
let TENANT
const PAGE = FEATURE_NAME
const OBJECT_NAME_PREFIX = 'pw-test-object-contact'
const ALL_OBJECT_DEFINITIONS_NAME = 'example-form-all'
const CONTACT_OBJECT_DEFINITIONS_NAME = 'example-form-contact'
const ALL_OBJECT_TYPE_PREFIX = 'exampleFormAll'
const CONTACT_OBJECT_TYPE_PREFIX = 'exampleFormContact'

Feature(FEATURE_NAME)

Before(async ({ I, loginAs, perApi, pagesPage, graphql }) => {
  await setup()
  TENANT = utils.generateRandomName()
  await perApi.createTenant(TENANT)
  await perApi.createPage(TENANT, PAGE)
  const map = new Map()
  map.set('email', 'test@test1.com')
  map.set('text', 'Hi, this is me')
  for(let i = 1; i <= 3; i++) {
    await graphql.createObjectFromDefinitions(
      perApi, TENANT, `${OBJECT_NAME_PREFIX}-${i}`, CONTACT_OBJECT_DEFINITIONS_NAME, {'email': `test-${i}@test.com`, 'text': `Hi There ${i}`}
    )
  }
  await graphql.createObjectFromDefinitions( perApi, TENANT, `${OBJECT_NAME_PREFIX}-4`, ALL_OBJECT_DEFINITIONS_NAME)
  await graphql.createObjectFromDefinitions( perApi, TENANT, `${OBJECT_NAME_PREFIX}-5`, ALL_OBJECT_DEFINITIONS_NAME)
  await loginAs('admin')
  await I.wait(5)
  await pagesPage.navigate(TENANT)
  console.log('before(), end')
})

After(async ({perApi}) => {
  for(let i = 1; i <= 5; i++) {
    await perApi.deleteObject(TENANT, `${OBJECT_NAME_PREFIX}-${i}`)
  }
  await perApi.deleteTenant(TENANT)
})

Scenario('Check GraphiQL Schema and Query',
  async ({I, graphiqlPage}) => {
    // Check the Schema Explorer
    await graphiqlPage.checkPage(`/content/${TENANT}/graphiql.html`)
    const prefixes = [ALL_OBJECT_TYPE_PREFIX, CONTACT_OBJECT_TYPE_PREFIX]
    await graphiqlPage.checkSchema(prefixes, true)
    let query = 'query {\n' +
      '  exampleFormContactObjectList {\n' +
      '    items {\n' +
      '      _path\n' +
      '      email\n' +
      '    }\n' +
      '  }\n' +
      '}'
    let expectedResult = {
      "data": {
        "exampleFormContactObjectList": {
          "items": [
            {
              "_path": `/content/${TENANT}/objects/pw-test-object-contact-1`,
              "email": "test-1@test.com"
            },
            {
              "_path": `/content/${TENANT}/objects/pw-test-object-contact-2`,
              "email": "test-2@test.com"
            },
            {
              "_path": `/content/${TENANT}/objects/pw-test-object-contact-3`,
              "email": "test-3@test.com"
            }
          ]
        }
      }
    }
    await graphiqlPage.checkQuery(query, expectedResult)
  }
)
