const {I} = inject()

class CardsComponent {

  inEditView
  inEditorPanel

  constructor() {
    this.inEditView = new InEditView()
  }
}

class InEditView {

  constructor() {
    this.locator = {
      frame() {
        return {frame: '#editview'}
      },
      _container() {
        return locate('section[class$="-components-cards"]')
            .as('cards-component')
      },
      container(position = 1) {
        return this._container()
            .at(position)
            .as(`cards-component-${position}`)
      }
    }
  }

  async seeNumber(count) {
    await I.switchTo(this.locator.frame())
    await I.seeNumberOfElements(this.locator._container(), count)
    await I.switchTo()
  }
}

module.exports = new CardsComponent()
module.exports.CardsComponent = CardsComponent