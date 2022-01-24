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

    await I.amOnPage(this.url)
    await I.fillField('Username', username)
    await I.fillField('Password', secret(password))
    await I.click('Log In')
    await I.waitForElement('.tenant-tabs', 2 * 60)
    await I.see('your websites', 'h2')
  }
}

module.exports = new LoginPage()
module.exports.LoginPage = LoginPage