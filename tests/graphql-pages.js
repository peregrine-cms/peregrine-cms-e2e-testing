/**
 * single-test run:
 * npm run test -- ./tests/graphql-pages.js
 */

const utils = require('../src/modules/utils')

const FEATURE_NAME = 'graphql-pages'
let TENANT
const PAGE_NAME = 'index'
const CARDS_TITLES = ['Service 1', 'Service 2', 'Service 3']
const IMAGE_PATH = 'assets/placeholders/16x9.png'

Feature(FEATURE_NAME)

Before(async ({loginAs, perApi, pagesPage, graphql}) => {
  TENANT = utils.generateRandomName()
  await perApi.createTenant(TENANT)
  await loginAs('admin')
  await pagesPage.navigate(TENANT)
})

After(async ({perApi}) => {
  await perApi.deleteTenant(TENANT)
})

Scenario('Check GraphQL Query over Cards',
  async ({I, graphql}) => {
    let query = 'query {\n' +
      '  cardsList {\n' +
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
    let data = result.data
    if(data === undefined) {
      throw new Error(`Result: '${queryResult}' does not contain 'data' item`)
    }
    let dataString = JSON.stringify(data)
    let cardsList = data.cardsList
    if(cardsList === undefined) {
      throw new Error(`Data Entry: '${dataString}' does not contain 'cardsList' item`)
    }
    let cardsListString = JSON.stringify(cardsList)
    let items = cardsList.items
    if(items === undefined) {
      throw new Error(`CardsList Entry: '${cardsListString}' does not contain 'items' item`)
    }
    let itemsString = JSON.stringify(items)
    if(!Array.isArray(items)) {
      throw new Error(`Items Entry: '${itemsString}' is not an Array`)
    }
    if(items.length !== 2) {
      throw new Error(`Items Entry: '${itemsString}' does not contain 2 entries`)
    }
    let count = 0;
    let found = false
    for(let item of items) {
      let itemString = JSON.stringify(item)
      let path = item['_path']
      if(path === undefined) {
        throw new Error(`Item Entry: '${itemString}' does not contain '_path' item`)
      }
      if(path.startsWith(`/content/${TENANT}/pages/${PAGE_NAME}/jcr:content`)) {
        let cards = item.cards
        if(cards === undefined) {
          throw new Error(`Item Entry: '${itemString}' does not contain 'cards' item`)
        }
        let cardsString = JSON.stringify(cards)
        if(!Array.isArray(cards)) {
          throw new Error(`Cards Entry: '${cardsString}' is not an Array`)
        }
        if(cards.length !== 3) {
          throw new Error(`Cards Entry: '${cardsString}' does not contain 3 entries`)
        }
        for(let card of cards) {
          let cardString = JSON.stringify(card)
          let title = card.title
          if(title === undefined) {
            throw new Error(`Card Entry: '${cardString}' does not contain 'title' item`)
          }
          let image = card.image
          if(image === undefined) {
            throw new Error(`Card Entry: '${cardString}' does not contain 'image' item`)
          }
          if(!CARDS_TITLES.includes(title)) {
            throw new Error(`Card Entry: '${cardString}' does not contain 'title' item with a value of '${CARDS_TITLES}`)
          }
          let imagePath = `/content/${TENANT}/${IMAGE_PATH}`
          if(imagePath !== image) {
            throw new Error(`Image Entry: '${image}' does not contain 'image' item with a value of '${imagePath}`)
          }
        }
      }
    }
  }
)
