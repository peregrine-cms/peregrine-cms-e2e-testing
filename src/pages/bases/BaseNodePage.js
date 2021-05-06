const BasePage = require('./BasePage')
const explorer = require('../../admin/Explorer')
const {I} = inject()

class BaseNodePage extends BasePage {

  explorer

  constructor() {
    super()
    this.explorer = explorer
  }

  navigate(tenant) {
    super.navigate(tenant)
    I.waitForElement('.explorer', 10)
  }
}

module.exports = BaseNodePage