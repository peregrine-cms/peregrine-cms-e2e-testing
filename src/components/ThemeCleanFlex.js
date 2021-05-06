const teaserVertical = require('./TeaserVerticalComponent')
const text = require('./TextComponent')
const cards = require('./CardsComponent')

class ThemeCleanFlex {

  teaserVertical
  text
  cards

  constructor() {
    this.teaserVertical = teaserVertical.inEditView
    this.text = text.inEditView
    this.cards = cards.inEditView
  }
}

module.exports = new ThemeCleanFlex()
module.exports.ThemeCleanFlex = ThemeCleanFlex