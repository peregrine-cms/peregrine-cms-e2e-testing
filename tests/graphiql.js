/**
 * single-test run:
 * npm run test -- ./tests/graphiql.js
 */

const utils = require('../src/modules/utils')

const FEATURE_NAME = 'graphiql'
let TENANT
const OBJECT_NAME_PREFIX = 'pw-test-object-contact'
const ALL_OBJECT_DEFINITIONS_NAME = 'example-form-all'
const CONTACT_OBJECT_DEFINITIONS_NAME = 'example-form-contact'
const ALL_OBJECT_TYPE_PREFIX = 'exampleFormAll'
const CONTACT_OBJECT_TYPE_PREFIX = 'exampleFormContact'

Feature(FEATURE_NAME)

Before(async ({loginAs, perApi, pagesPage, graphiqlPage, graphql}) => {
  TENANT = utils.generateRandomName()
  await perApi.createTenant(TENANT)
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
  await pagesPage.navigate(TENANT)
})

After(async ({perApi}) => {
  for(let i = 1; i <= 5; i++) {
    await perApi.deleteObject(TENANT, `${OBJECT_NAME_PREFIX}-${i}`)
  }
  await perApi.deleteTenant(TENANT)
})

Scenario('Check GraphiQL Schema and Query',
  async ({I, perApi, graphiqlPage, graphql}) => {
    // Check the Schema Explorer
    await graphiqlPage.checkPage(`/content/${TENANT}/graphiql.html`)
    const prefixes = [ALL_OBJECT_TYPE_PREFIX, CONTACT_OBJECT_TYPE_PREFIX]
    await graphiqlPage.checkSchema(prefixes, true)
    let listQuery = graphql.createListQuery(
      TENANT, CONTACT_OBJECT_TYPE_PREFIX, OBJECT_NAME_PREFIX, ['_path', 'email'],
      [`/content/${TENANT}/objects/${OBJECT_NAME_PREFIX}-{suffix}`, `test-{suffix}@test.com`],
      [1, 2, 3]
    )
    // Do a Query
    await graphiqlPage.checkQuery(listQuery.query, listQuery.expected)
  }
)
