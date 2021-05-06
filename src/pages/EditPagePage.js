const editorPanel = require('../admin/EditorPanel')
const richToolbar = require('../admin/Richtoolbar')
const editView = require('../admin/EditView')
const pathBrowser = require('../admin/PathBrowser')
const rightPanel = require('../admin/RightPanel')
const editable = require('../admin/Editable')
const createComponentModal = require('../admin/CreateComponentModal')
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