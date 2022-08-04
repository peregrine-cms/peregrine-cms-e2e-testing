const {I} = inject()

class CreateComponentModal {

  constructor() {
    this.locator = {
      wrapper() {
        return locate('.add-component-modal-wrapper')
            .as('add-component-modal-wrapper')
      },
      modal() {
        return this.wrapper()
            .find('.add-component-modal')
            .as('add-component-modal')
      },
      searchField() {
        return this.modal()
            .find('input.filter')
            .as('search-field')
      }
    }
  }

  async search(query) {
    await I.fillField(this.locator.searchField(), query)
  }

  async createComponent(fullComponentName) {
    await I.pressKey(['CommandOrControl', '.'])
    await this.search(fullComponentName)
    await I.click(fullComponentName)
  }
}

module.exports = new CreateComponentModal()
module.exports.CreateComponentModal = CreateComponentModal