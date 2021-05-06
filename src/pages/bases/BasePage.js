const topNav = require('../../admin/TopNav')

const {I} = inject()

class BasePage {

  topNav

  constructor() {
    this.topNav = topNav
  }

  getUrl(tenant) {
    throw `missing impl.: getUrl(tenant=${tenant})`
  }

  navigate(tenant) {
    I.amOnPage(this.getUrl(tenant))
    I.waitForElement('.tooling-page', 10)
  }
}

module.exports = BasePage