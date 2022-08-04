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
      if (expectedItem === undefined || (expectedItem == null && foundItem != null)) {
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
      } else if(foundItem == null) {
        if(expectedItem != null) {
          throw new Error(`Item: ${path} was null but expected: ${expectedItem}`)
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