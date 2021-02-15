const BasePage = require('./bases/BasePage')
const {I} = inject()

class WelcomePage extends BasePage {

  constructor() {
    super()
  }

  getUrl(tenant) {
    return `/content/admin/pages/welcome.html/path:/content/${tenant}`
  }
}

module.exports = new WelcomePage()
module.exports.WelcomePage = WelcomePage