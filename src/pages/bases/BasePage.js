const topNav = require('../../components/TopNav')

const {I} = inject()

class BasePage {

  topNav

  constructor() {
    this.topNav = topNav
  }

  getUrl(tenant) {
    throw `missing impl.: getUrl(tenant=${tenant})`
  }

  async navigate(tenant) {
    await I.amOnPage(this.getUrl(tenant))
    await I.waitForElement('.tooling-page', 10)
  }
}

module.exports = BasePage