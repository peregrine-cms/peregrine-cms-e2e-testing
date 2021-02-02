const explorer = require('../../components/Explorer')
const {I} = inject()

class BaseNodePage {

  explorer

  constructor() {
    this.explorer = explorer
  }

  getUrl(tenant) {
    throw `missing impl.: getUrl(tenant=${tenant})`
  }

  navigate(tenant) {
    I.amOnPage(this.getUrl(tenant))
    I.waitForElement('.explorer', 10)
  }
}

module.exports = BaseNodePage