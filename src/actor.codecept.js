const loginPage = require('./pages/LoginPage')

module.exports = () => {
  return actor({
    async loginAs(user) {
      await loginPage.loginAs(user)
    },

    async amLoggedIn() {
      await loginPage.amLoggedIn()
    },

    selectAll() {
      this.pressKey(['CommandOrControl', 'a'])
    },

    pressKeyRepeatedly(keys, times = 1) {
      for (let i = 0; i < times; i++) {
        this.pressKey(keys)
      }
    }
  })
}
