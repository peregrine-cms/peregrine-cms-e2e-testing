const { I } = inject()

class TopNav {

  constructor() {
    this.locator = {
      container() {
        return locate('.tooling-page nav')
      },
      userDropDownToggle() {
        return this.container()
            .find('.user-link')
            .as(`user-drop-down-toggle`)
      },
      userDropDown() {
        return this.userDropDownToggle()
            .find('.dropdown-content')
            .as('user-drop-down')
      },
      username() {
        return this.userDropDown()
            .find('.username')
            .as('username')
      },
      copyUsernameBtn() {
        return this.userDropDown()
            .find('.copy-username')
            .as('copy-username-btn')
      }
    }
  }

  async toggleUserDropDown() {
    await I.click(this.locator.userDropDownToggle())
  }

  async grabTextFromUsername() {
    return await I.grabTextFrom(this.locator.username())
  }

  async copyUsername() {
    await I.click(this.locator.copyUsernameBtn())
    await I.see('copied username', '.toast')
  }
}

module.exports = new TopNav()
module.exports.TopNav = TopNav