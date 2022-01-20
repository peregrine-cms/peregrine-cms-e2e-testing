const {Request} = require('../helpers/ExtendedRest2')
const {I} = inject()

class graphql {

  async createObjectFromDefinitions(perApi, tenant, objectName, objectDefinitionsName, valueMap) {
    await perApi.createObject(tenant, objectName)
    await perApi.updateObject(
      tenant, objectName, `/content/${tenant}/object-definitions/${objectDefinitionsName}`,
      valueMap
    )
  }

  async executeQuery(tenant, queryString) {
    console.log(`Execute Query, tenant: ${tenant}, query: ${queryString}`)
    let response = await I.sendRestRequest2(
        Request.build()
          .withUrl(`/content/${tenant}.gql`)
          .withPOST()
          .withHeader('content-type', 'application/json')
          .withFormData({
            query: queryString,
            variables: null
          })
          .as(`Execute Query on Tenant: "${tenant}"`)
    )
    let answer = JSON.stringify(response.data)
    console.log(`Response Data from GraphQL: ${answer}`)
    return answer
  }

  createListQuery(tenant, objectTypePrefix, objectNamePrefix, fields, values, suffixes) {
    let answer = {}
    let query = 'query {\n' +
      `  ${objectTypePrefix}List {\n` +
      '    items {\n';
    for(let field of fields) {
      query += `      ${field}\n`
    }
    query += '    }\n' +
      '  }\n' +
      '}'
    answer.query = query
    let expected =`{"data":{"${objectTypePrefix}List":{"items":[`;
    for(let suffix of suffixes) {
      expected += '{'
      for(let i = 0; i < fields.length; i++) {
        let field = fields[i]
        let value = values[i]
        expected += '"' + field + '":"'
        value = value.replace('{suffix}', suffix)
        expected += value + '",';
      }
      if(expected.endsWith(',')) { expected = expected.substring(0, expected.length - 1) }
      expected += '},'
    }
    if(expected.endsWith(',')) { expected = expected.substring(0, expected.length - 1) }
    expected += ']}}}'
    answer.expected = expected
    return answer
  }

  checkQueryResult(result, expected) {
    if (result !== null) {
      console.log(`Query Result: ${result}`)
      result = result.replace(/\s+/g, '')
      console.log(`Space Removed: Query Result: ${result}`)
      if (expected.length !== result.length) {
        throw new Error(`Result does not have the expected length, expected:\n\n'${expected}'\n\nfound:\n\n'${result}'\n\n`)
      }
      for (let i = 0; i < expected.length; i++) {
        if (result[i] !== expected[i]) {
          throw new Error(`Result does not match at position ${i} (char: ${expected[i]} vs ${result[i]}), expected:\n\n'${expected}'\n\nfound:\n\n'${result}'\n\n`)
        }
      }
    } else {
      throw new Error(`No Result provided, expected:\n\n${expected}`)
    }
  }

}

module.exports = new graphql()
module.exports.graphql = graphql