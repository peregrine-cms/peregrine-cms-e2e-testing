const users = require('../../resources/users.json')
const {I} = inject()

class LoginPage {

  constructor() {
    this.url = '/system/sling/form/login'
    this.locator = {
      container() {
        return locate('div.login-form-wrapper')
      },
      username() {
        return this.container()
          .find('#j_username')
      },
      password() {
        return this.container()
          .find('#j_password')
      },
      loginButton() {
        return this.container()
          .find('button#login')
      }
    }
  }

  async loginAs(user) {
    const {
      username,
      password
    } = users[user]

    await I.amOnPage(this.url)
    await I.waitForElement(this.locator.container(), 10)
    await I.fillField(this.locator.username(), username)
    await I.fillField(this.locator.password(), secret(password))
    await I.click(this.locator.loginButton())
    await I.waitForElement('.tenant-tabs', 2 * 60)
    await I.see('your websites', 'h2')
  }

  async amLoggedIn() {
    await I.amOnPage('/')
    await I.waitForElement('div#peregrine-main')
  }
}

module.exports = new LoginPage()
module.exports.LoginPage = LoginPage