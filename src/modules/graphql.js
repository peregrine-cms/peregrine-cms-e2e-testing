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
    return answer
  }

  createListQuery(tenant, objectTypePrefix, objectNamePrefix, fields, values, suffixes) {
    let answer = {}
    let query = 'query {\n' +
      `  ${objectTypePrefix}ObjectList {\n` +
      '    items {\n';
    for(let field of fields) {
      query += `      ${field}\n`
    }
    query += '    }\n' +
      '  }\n' +
      '}'
    answer.query = query
    let expected =`{"data":{"${objectTypePrefix}ObjectList":{"items":[`;
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

  createByPathQuery(tenant, objectTypePrefix, objectName, fieldAndValues) {
    let answer = {}
    let query = 'query {\n' +
      `  ${objectTypePrefix}ObjectByPath(_path: "/content/${tenant}/objects/${objectName}") {\n` +
      '    item {\n';
    for(let field of fieldAndValues.fields) {
      query += `      ${field}\n`
    }
    query += '    }\n' +
      '  }\n' +
      '}'
    answer.query = query
    let expected =`{"data":{"${objectTypePrefix}ObjectByPath":{"item":{`;
    for(let i = 0; i < fieldAndValues.fields.length; i++) {
        let field = fieldAndValues.fields[i]
        let value = fieldAndValues.values[i]
        if(value === 'null') {
          expected += '"' + field + '":null,'
        } else {
          expected += '"' + field + '":"' + value + '",'
        }
    }
    if(expected.endsWith(',')) { expected = expected.substring(0, expected.length - 1) }
    expected += '}}}}'
    answer.expected = expected
    return answer
  }

  async checkQueryResult(result, expected) {
    if (result !== null) {
      result = result.replace(/\s+/g, '')
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

  async checkQueryJSonResult(result, expected) {
    if (result === undefined) {
      throw new Error('Result is undefined')
    }
    if (expected === undefined) {
      throw new Error('Expected is undefined')
    }
    console.log('Before Check Recursively')
    await this.checkQueryJSonItem('root', result, expected)
  }

  async checkQueryJSonItem(path, foundObject, expectedObject) {
    let expectedKeys = []
    let foundEntries = Object.entries(foundObject);
    console.log(`Check Query JSon Item: ${path}, found entries: ${foundEntries}`)
    for (let i = 0; i < foundEntries.length; i++) {
      console.log(`Loop over ${i}`)
      let foundKey = foundEntries[i][0];
      let foundItem = foundEntries[i][1];
      let expectedItem = expectedObject !== undefined && expectedObject.hasOwnProperty(foundKey) ? expectedObject[foundKey] : undefined;
      console.log(`Found Key: ${foundKey}, Item: ${JSON.stringify(foundItem)}, Expected Item: ${expectedItem}`)
      if (expectedItem === undefined || expectedItem == null) {
        throw new Error(`Matching Expected Item not found for Path: ${path} -> ${foundKey}`);
      }
      if (Array.isArray(foundItem)) {
        // Handle Array
        let checkKey = "CHECK-" + foundKey
        let checkValue = ''
        if(expectedObject.hasOwnProperty(checkKey)) {
          checkValue = expectedObject[checkKey]
        }
        for (let j = 0; j < foundItem.length; j++) {
          console.log(`Array: ${foundKey}, index: ${j}`)
          let foundArrayItem = foundItem[j]
          let expectedArrayItem = undefined
          if('applyToAll' === checkValue) {
            expectedArrayItem = Array.isArray(expectedItem) && expectedItem.length > 0 ? expectedItem[0] : undefined
          } else {
            expectedArrayItem = Array.isArray(expectedItem) && expectedItem.length > j ? expectedItem[j] : undefined
          }
          console.log(`Found Array Item: ${JSON.stringify(foundArrayItem)}, Expected Array Item: ${expectedArrayItem}`)
          await this.checkQueryJSonItem(`${path} -> ${foundKey}[${j}]`, foundArrayItem, expectedArrayItem)
        }
      } else if (typeof foundItem === 'object') {
        console.log(`Compare Object: ${foundKey}`)
        // Handle Object recursively
        await this.checkQueryJSonItem(`${path} -> ${foundKey}`, foundItem, expectedItem)
      } else {
        let checkKey = "CHECK-" + foundKey
        let matches = false
        let checkValue = ''
        if(expectedObject.hasOwnProperty(checkKey)) {
          checkValue = expectedObject[checkKey]
          if('ignored' === checkValue) {
            matches = true
          } else if('startsWith' === checkValue) {
            matches = foundItem.startsWith(expectedItem)
          } else if('includes' === checkValue) {
            matches = expectedItem.includes(foundItem)
          } else {
            matches = foundItem === expectedItem
          }
        } else {
          matches = foundItem === expectedItem
        }
        console.log(`Key: ${foundKey}, Found Value: ${foundItem}, Expected Value: ${expectedItem}, Check: ${checkValue}, Comparison: ${matches}`)
        // Handle special comparison
        if (!matches) {
          throw new Error(`Item: ${path} does not match, found: ${foundItem}, expected: ${expectedItem}`)
        }
      }
      expectedKeys.push(foundKey);
    }
    return null;
  }
}

module.exports = new graphql()
module.exports.graphql = graphql