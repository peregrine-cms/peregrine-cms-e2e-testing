const askUserModal = require('./AskUserModal')
const rightPanel = require('./RightPanel')
const { I } = inject()

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

  nodeInfo(type, title) {
    I.click(this.locator.infoBtn(type, title))
  }

  deleteNode(type, title) {
    I.waitForElement(this.locator.deleteButton(type, title), 5)
    I.click(this.locator.deleteButton(type, title))
    this.askUserModal.confirm()
    I.dontSeeElement(this.locator.deleteButton(type, title))
  }

  editNode(type, title) {
    I.click(this.locator.editButton(type, title))
  }
}

module.exports = new Explorer()
module.exports.Explorer = Explorer