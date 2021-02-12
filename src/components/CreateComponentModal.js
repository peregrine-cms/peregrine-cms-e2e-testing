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

  search(query) {
    I.fillField(this.locator.searchField(), query)
  }

  createComponent(fullComponentName) {
    I.pressKey(['CommandOrControl', '.'])
    this.search(fullComponentName)
    I.click(fullComponentName)
  }
}

module.exports = new CreateComponentModal()
module.exports.CreateComponentModal = CreateComponentModal