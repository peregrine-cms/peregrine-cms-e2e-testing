const {I} = inject()

class TextComponent {

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
        return locate('section[class$="-components-simpletext"]')
            .as('text-component')
      },
      container(position = 1) {
        return this._container()
            .at(position)
            .as(`text-component-${position}`)
      }
    }
  }

  seeNumber(count) {
    I.switchTo(this.locator.frame())
    I.seeNumberOfElements(this.locator._container(), count)
    I.switchTo()
  }
}

module.exports = new TextComponent()
module.exports.TextComponent = TextComponent