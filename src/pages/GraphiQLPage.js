const graphql = require('../modules/graphql')
const {I} = inject()

class GraphiQLPage {

  constructor() {
    this.locator = {
      container() {
        return locate('div#graphiql')
      },
      topBarWrap() {
        return this.container()
            .find('div.topBarWrap')
      },
      docs() {
        return this.topBarWrap()
            .find('button.docExplorerShow')
      },
      executeQuery() {
        return this.topBarWrap()
            .find('div.topBar button.execute-button')
      },
      explorer() {
        return this.container()
            .find('div.docExplorerWrap')
      },
      queryTypeLink() {
        return this.explorer()
            .find('a.type-name')
            .withText('QueryType')
      },
      queryTypeFields() {
        return this.explorer()
            .find('div#doc-fields')
      },
      queryTypeFieldItemField(fieldName) {
        return this.queryTypeFields()
            .find('div.doc-category-item')
            .find('a.field-name')
            .withText(fieldName)
      },
      queryTypeFieldItem(fieldName) {
        return this.queryTypeFields()
            .find('div.doc-category-item')
            .withDescendant(locate('a.field-name').withText(fieldName))
      },
      queryTypeTypeName(fieldName, typeName) {
        return this.queryTypeFieldItem(fieldName)
            .find('a.type-name')
            .withText(typeName)
      },
      queryTypeArg(fieldName, argName) {
        return this.queryTypeFieldItem(fieldName)
            .find('span.arg')
            .find('span.arg-name')
            .withText(argName)
      },
      queryEditor() {
        return this.container()
            .find('div.queryWrap section.query-editor')
      },
      queryEditorTextarea() {
        return this.queryEditor()
            .find('textarea')
      },
      resultWindow() {
        return this.container()
            .find('div.resultWrap section.result-window')
      },
      resultTextarea() {
        return this.resultWindow()
            .find('textarea')
      }
    }
  }

  async checkPage(url) {
    await I.amOnPage(url)
    await I.refreshPage()
    await I.waitForElement(this.locator.container(), 10)
    await tryTo(() => I.click(this.locator.docs()))
    await I.seeElement(this.locator.explorer())
    await I.seeElement(this.locator.queryTypeLink())
  }

  async checkSchema(schemaItemPrefixes) {
    await I.waitForElement(this.locator.queryTypeLink(), 10)
    await I.click(this.locator.queryTypeLink())
    await I.waitForElement(this.locator.queryTypeFields(), 10)
    for(let schemaItemPrefix of schemaItemPrefixes) {
      // Check List query
      await I.seeElement(this.locator.queryTypeFieldItemField(`${schemaItemPrefix}List`))
      await I.seeElement(this.locator.queryTypeFieldItem(`${schemaItemPrefix}List`))
      await I.seeElement(this.locator.queryTypeTypeName(`${schemaItemPrefix}List`, `${schemaItemPrefix}Results`))
      // Check By Path query
      await I.seeElement(this.locator.queryTypeFieldItemField(`${schemaItemPrefix}ByPath`))
      await I.seeElement(this.locator.queryTypeFieldItem(`${schemaItemPrefix}ByPath`))
      await I.seeElement(this.locator.queryTypeArg(`${schemaItemPrefix}ByPath`, '_path'))
      await I.seeElement(this.locator.queryTypeTypeName(`${schemaItemPrefix}ByPath`, `${schemaItemPrefix}Result`))
    }
  }

  async checkQuery(query, expected) {
    await I.seeElement(this.locator.executeQuery())
    await I.seeElement(this.locator.queryEditorTextarea())
    await I.seeElement(this.locator.resultTextarea())
    // It does not seem to be possible to clear the Editor Text Area as they use Code Mirror for that
    // await I.pressKey(['Command', 'A'])
    // await I.pressKey(['Delete'])
    await I.fillField(this.locator.queryEditorTextarea(), query)
    await I.click(this.locator.executeQuery())
    await I.wait(1)
    let queryResult = await I.grabTextFromAll(this.locator.resultWindow())
    if(queryResult != null && queryResult.length == 1) {
      graphql.checkQueryResult(queryResult[0], expected)
    } else {
      throw new Error(`No or too many Query Result found: ${queryResult}`)
    }
  }
}

module.exports = new GraphiQLPage()
module.exports.GraphiQLPage = GraphiQLPage