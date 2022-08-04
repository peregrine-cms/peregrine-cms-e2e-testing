const BasePage = require('./BasePage')
const explorer = require('../../components/Explorer')
const {I} = inject()

class BaseNodePage extends BasePage{

  explorer

  constructor() {
    super()
    this.explorer = explorer
  }

  async navigate(tenant) {
    await super.navigate(tenant)
    await I.waitForElement('.explorer', 10)
  }
}

module.exports = BaseNodePage