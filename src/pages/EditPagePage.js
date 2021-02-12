const editorPanel = require('../components/EditorPanel')
const richToolbar = require('../components/Richtoolbar')
const editView = require('../components/EditView')
const pathBrowser = require('../components/PathBrowser')
const rightPanel = require('../components/RightPanel')
const editable = require('../components/Editable')
const createComponentModal = require('../components/CreateComponentModal')
const {I} = inject()

class EditPagePage {

  editorPanel
  richToolbar
  editView
  pathBrowser
  rightPanel
  editable
  createComponentModal

  constructor() {
    this.editorPanel = editorPanel
    this.richToolbar = richToolbar
    this.editView = editView
    this.pathBrowser = pathBrowser
    this.rightPanel = rightPanel
    this.editable = editable
    this.createComponentModal = createComponentModal
    this.locator = {
      loadSpinner() {
        return locate({css: '.spinner-wrapper'})
            .as('load spinner')
      }
    }
  }

  loaded() {
    I.waitForNavigation()
    I.seeInTitle('Page Editor')
    I.dontSeeElement(this.locator.loadSpinner())
    this.editView.isReady()
  }
}

module.exports = new EditPagePage()
module.exports.EditPage = EditPagePage