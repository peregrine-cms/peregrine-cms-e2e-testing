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
    var path = this.getUrl(tenant);
    await I.amOnPage(path)
    await I.waitForElement('.tooling-page', 10)
  }
}

module.exports = BasePage