const users = require('../../resources/users.json')
const {I} = inject()

class LoginPage {

  constructor() {
    this.url = '/system/sling/form/login'
  }

  async loginAs(user) {
    const {
      username,
      password
    } = users[user]

    I.amOnPage(this.url)
    I.fillField('Username', username)
    I.fillField('Password', secret(password))
    I.click('Log In')
    I.waitForElement('.tenant-tabs', 2 * 60)
    I.see('your websites', 'h2')
  }
}

module.exports = new LoginPage()
module.exports.LoginPage = LoginPage