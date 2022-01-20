/**
 * single-test run:
 * npm run test -- ./tests/graphql.js
 */

const utils = require('../src/modules/utils')

const FEATURE_NAME = 'graphql'
let TENANT
const OBJECT_NAME_PREFIX = 'pw-test-object-contact'
const ALL_OBJECT_DEFINITIONS_NAME = 'example-form-all'
const CONTACT_OBJECT_DEFINITIONS_NAME = 'example-form-contact'
const ALL_OBJECT_TYPE_PREFIX = 'exampleFormAll'
const CONTACT_OBJECT_TYPE_PREFIX = 'exampleFormContact'

Feature(FEATURE_NAME)

Before(async ({loginAs, perApi, pagesPage, graphql}) => {
  TENANT = utils.generateRandomName()
  await perApi.createTenant(TENANT)
  let i = 1;
  await graphql.createObjectFromDefinitions(
    perApi, TENANT, `${OBJECT_NAME_PREFIX}-${i}`, CONTACT_OBJECT_DEFINITIONS_NAME, {'email': `test-${i}@test.com`, 'text': `Hi There ${i}`}
  )
  i++
  await graphql.createObjectFromDefinitions(
    perApi, TENANT, `${OBJECT_NAME_PREFIX}-${i}`, CONTACT_OBJECT_DEFINITIONS_NAME, {'email': `test-${i}@test.com`, 'text': `Hi There ${i}`}
  )
  i++
  await graphql.createObjectFromDefinitions(
    perApi, TENANT, `${OBJECT_NAME_PREFIX}-${i}`, CONTACT_OBJECT_DEFINITIONS_NAME, {'email': `test-${i}@test.com`, 'text': `Hi There ${i}`}
  )
  await graphql.createObjectFromDefinitions( perApi, TENANT, `${OBJECT_NAME_PREFIX}-4`, ALL_OBJECT_DEFINITIONS_NAME)
  await graphql.createObjectFromDefinitions( perApi, TENANT, `${OBJECT_NAME_PREFIX}-5`, ALL_OBJECT_DEFINITIONS_NAME)
  await loginAs('admin')
  await pagesPage.navigate(TENANT)
})

After(async ({perApi}) => {
  let i = 1;
  await perApi.deleteObject(TENANT, `${OBJECT_NAME_PREFIX}-${i++}`)
  await perApi.deleteObject(TENANT, `${OBJECT_NAME_PREFIX}-${i++}`)
  await perApi.deleteObject(TENANT, `${OBJECT_NAME_PREFIX}-${i++}`)
  await perApi.deleteObject(TENANT, `${OBJECT_NAME_PREFIX}-${i++}`)
  await perApi.deleteObject(TENANT, `${OBJECT_NAME_PREFIX}-${i++}`)
  await perApi.deleteTenant(TENANT)
})

Scenario('Check GraphQL Query over Contact Form List',
  async ({I, graphql}) => {
    let listQuery = graphql.createListQuery(
      TENANT, CONTACT_OBJECT_TYPE_PREFIX, OBJECT_NAME_PREFIX, ['_path', 'email'],
      [`/content/${TENANT}/objects/${OBJECT_NAME_PREFIX}-{suffix}`, `test-{suffix}@test.com`],
      [1, 2, 3]
    )
    let queryResult = await graphql.executeQuery(
      TENANT, listQuery.query
    )
    graphql.checkQueryResult(queryResult, listQuery.expected)
  }
)

Scenario('Check GraphQL Query over All Form List',
  async ({I, graphql}) => {
    let listQuery = graphql.createListQuery(
      TENANT, ALL_OBJECT_TYPE_PREFIX, OBJECT_NAME_PREFIX, ['_path'],
      [`/content/${TENANT}/objects/${OBJECT_NAME_PREFIX}-{suffix}`],
      [4, 5]
    )
    let queryResult = await graphql.executeQuery(
      TENANT, listQuery.query
    )
    graphql.checkQueryResult(queryResult, listQuery.expected)
  }
)
