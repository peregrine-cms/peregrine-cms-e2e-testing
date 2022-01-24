const askUserModal = require('./AskUserModal')
const rightPanel = require('../components/RightPanel')
const {I} = inject()

class Explorer {

  askUserModal
  rightPanel

  constructor() {
    this.askUserModal = askUserModal
    this.rightPanel = rightPanel
    this.locator = {
      container() {
        return locate('.explorer').as('explorer')
      },
      infoBtn(type, title) {
        return this.container()
            .find('a').withAttr({title: `'${title}' info`})
            .as(`${type} info ("${title}")`)
      },
      editButton(type, title) {
        return this.container()
            .find('a').withAttr({title: `edit '${title}'`})
            .as(`edit ${type} ("${title}")`)
      },
      deleteButton(type, title) {
        return this.container()
            .find('a').withAttr({title: `delete '${title}'`})
            .as(`delete ${type} ("${title}")`)
      }
    }
  }

  async saveChanges(type, title) {
    await I.waitForElement(this.locator.infoBtn(type, title), 5)
    await I.click(this.locator.infoBtn(type, title))
    await this.askUserModal.save()
  }

  async nodeInfo(type, title) {
    await I.waitForElement(this.locator.infoBtn(type, title), 5)
    // I.moveCursorTo(this.locator.infoBtn(type, title))
    // I.doubleClick(this.locator.infoBtn(type, title))
    await I.click(this.locator.infoBtn(type, title))
  }

  async deleteNode(type, title) {
    await I.waitForElement(this.locator.deleteButton(type, title), 5)
    await I.click(this.locator.deleteButton(type, title))
    await this.askUserModal.confirm()
    await I.dontSeeElement(this.locator.deleteButton(type, title))
  }

  async editNode(type, title) {
    await I.click(this.locator.editButton(type, title))
  }
}

module.exports = new Explorer()
module.exports.Explorer = Explorer