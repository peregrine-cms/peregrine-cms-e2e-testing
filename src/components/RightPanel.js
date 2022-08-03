const {I} = inject()

class RightPanel {

  constructor() {
    this.locator = {
      container(){
        return locate('.explorer-preview')
      },
      nav() {
        return this.container()
            .find('.explorer-preview-nav')
            .find('.nav-left')
      },
      body() {
        return this.container()
            .find('.vue-form-generator')
      },
      footer() {
        return this.container()
            .find('.explorer-confirm-dialog')
      },
      infoTabBtn() {
        return this.nav()
            .find('a').at(1)
            .as('info-tab-btn')
      },
      editBtn() {
        return this.footer()
            .find('.btn.right[title^="edit "][title$=" properties"]')
            .as('edit-btn')
      },
      saveBtn() {
        return this.footer()
            .find('.btn.right[title^="save "][title$=" properties"]')
            .as('save-btn')
      },
      referencesTabBtn() {
        return this.nav()
            .find('a').withAttr({title: 'references'})
            .as('references-tab-btn')
      },
      reference(position) {
        return this.container()
            .find('.explorer-page-referenced-by')
            .find('.collection-item').at(position)
            .as(`reference no. ${position}`)
      },
      textInput() {
        return this.container()
          .find('input')
          .withAttr({'placeholder': 'text'})
      },
      elementType() {
        return this.container()
          .find('div.multiselect__select')
      },
      elementOption(value) {
        return this.container()
          .find('ul.multiselect__content')
          .find('li.multiselect__element')
          .withText(value)
      },
      panelButton(title) {
        return this.container()
          .find('div.editor-panel-buttons')
          .find('button')
          .withAttr({'title': title})
      },
      panelTitle(title) {
        return this.container()
          .find('span.panel-title')
          .withText(title)
      },
      inputById(id) {
        return this.body()
          .find('div.wrapper')
          .find(`input#${id}`)
          .as('InputById')
      }
    }
  }

  async openReferencesTab() {
    await I.waitForElement(this.locator.referencesTabBtn(), 10)
    await I.click(this.locator.referencesTabBtn())
  }

  async clickReference(position) {
    await I.click(this.locator.reference(position))
  }

  async openInfoTab() {
    await I.waitForElement(this.locator.infoTabBtn(), 10)
    await I.click(this.locator.infoTabBtn())
  }

  async clickEditBtn() {
    await I.waitForElement(this.locator.editBtn(), 10)
    await I.click(this.locator.editBtn())
  }

  async clickSaveBtn() {
    await I.waitForElement(this.locator.saveBtn(), 10)
    await I.click(this.locator.saveBtn())
  }

  async selectElement(option) {
    await I.waitForElement(this.locator.elementType(), 10)
    await I.click(this.locator.elementType())
    await I.wait(1)
    await I.waitForElement(this.locator.elementOption(option), 10)
    await I.click(this.locator.elementOption(option))
    await I.click(this.locator.panelButton('save'))
  }

  async fillInput(id, value) {
    await I.waitForElement(this.locator.inputById(id), 10)
    await I.click(this.locator.inputById(id))
    await I.fillField(this.locator.inputById(id), value)
    // Does not work with the current Peregrine
    // await I.click(this.locator.panelButton('save'))
  }

  async saveChanges() {
    await I.click(this.locator.panelButton('save'))
  }
}

module.exports = new RightPanel()
module.exports.RightPanel= RightPanel