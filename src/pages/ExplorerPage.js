const BaseNodePage = require('./bases/BaseNodePage')
const askUserModal = require('../components/AskUserModal')
const rightPanel = require('../components/RightPanel')
const {I} = inject()

// TODO: Shall we keep the Right Panel separate or Integrate into here
class ExplorerPage extends BaseNodePage {

  path = []
  askUserModal
  rightPanel

  constructor(breadcrumbs) {
    super()
    this.askUserModal = askUserModal
    this.rightPanel = rightPanel

    if(breadcrumbs !== undefined) {
      this.path = breadcrumbs.split('/')
    }

    this.locator = {
      container() {
        return locate('.tooling-page')
      },
      breadcrumbByName(name) {
        return this.container()
          .find('div.pathfield')
          .find('span')
          .find('a')
          .withText(name)
          .as(`breadcrumb by name: ${name}`)
      },
      breadcrumbByPositionAndName(position, name) {
        return this.container()
          .find('div.pathfield')
          .find('span')
          .at(position)
          .find('a')
          .withText(name)
          .as(`breadcrumb by position: ${position}, name: ${name}`)
      },
      explorer() {
        return this.container()
          .find('div.explorer')
      },
      collection() {
        return this.explorer()
          .find('div.row')
          .find('ul.collection')
      },
      rowByName(name) {
        return this.collection()
          .find('li')
          .find('a')
          .withText(name)
      },
      rowByPosition(position) {
        return this.collection()
          .find('li.collection-item')
          .at(position)
          .find('a')
      },
      createBtn(label) {
        return this.container()
          .find('a')
          .withAttr({title: label})
          .as('create-btn')
      },
      infoBtn(title) {
        return this.container()
          .find('a').withAttr({title: `'${title}' info`})
          .as(`Info Button: ("${title}")`)
      },
      editButton(title) {
        return this.container()
          .find('a').withAttr({title: `edit '${title}'`})
          .as(`Edit Button: ("${title}")`)
      },
      deleteButton(title) {
        return this.container()
          .find('a').withAttr({title: `delete '${title}'`})
          .as(`Delete Button: ("${title}")`)
      }

    // },
      // selectOD(odName) {
      //   return this.container()
      //     .find('div#selectobjecttype0')
      //     .find('li')
      //     .find('a')
      //     .withText(odName)
      // },
      // nextBtn() {
      //   return this.container()
      //     .find('div.wizard-footer-right')
      //     .find('button')
      //     .withText('Next')
      // },
      // finishBtn() {
      //   return this.container()
      //     .find('div.wizard-footer-right')
      //     .find('button')
      //     .withText('Finish')
      // },
      // objectNameInput() {
      //   return this.container()
      //     .find('div#choosename2')
      //     .find('input#object-name')
      // }
    }
  }

  getAddButtonText() {
    return "add "
  }

  async addNew() {
    console.log(`Add Button Text: ${this.getAddButtonText()}`)
    I.waitForElement(this.locator.createBtn(this.getAddButtonText()), 10)
    I.click(this.locator.createBtn(this.getAddButtonText()))
  }

  async checkBreadcrumbs() {
    let index = 1;
    for(let token of this.path) {
      await I.waitForElement(this.locator.breadcrumbByPositionAndName(index, token))
      index++
    }
  }

  async clickBreadcrumb(name) {
    await I.waitForElement(this.locator.breadcrumbByName(name))
    await I.click(this.locator.breadcrumbByName(name))
  }

  async checkEntryByLabel(label) {
    await I.waitForElement(this.locator.rowByName(label), 10)
  }

  async selectEntryByLabel(label) {
    await I.waitForElement(this.locator.rowByName(label), 10)
    await I.click(this.locator.rowByName(label))
  }

  async deleteEntry(label) {
    await I.waitForElement(this.locator.deleteButton(label), 5)
    await I.click(this.locator.deleteButton(label))
    await this.askUserModal.confirm()
    await I.dontSeeElement(this.locator.deleteButton(label))
  }

  async editEnty(label) {
    await I.waitForElement(this.locator.editButton(label), 5)
    await I.click(this.locator.editButton(label))
  }

  async saveChanges(label) {
    await this.selectEntryByLabel(label)
    await this.askUserModal.save()
  }
}

module.exports = ExplorerPage