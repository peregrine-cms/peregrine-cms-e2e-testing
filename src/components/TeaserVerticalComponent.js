const {I} = inject()

class TeaserVerticalComponent {

  inEditView
  inEditorPanel

  constructor() {
    this.inEditView = new InEditView()
    this.inEditorPanel = new InEditorPanel()
  }
}

class InEditView {

  constructor() {
    this.locator = {
      frame() {
        return {frame: '#editview'}
      },
      container(position = 1) {
        return locate('section[class$="-components-teaservertical"]')
            .at(position)
            .as('teaser-vertical')
      },
      title() {
        return locate(this.container())
            .find('$$model.title')
            .as('teaservertical.title')
      },
      subtitle() {
        return locate(this.container())
            .find('$$model.subtitle')
            .as('teaservertical.subtitle')
      },
      text() {
        return locate(this.container())
            .find('$$model.text')
            .as('teaservertical.text')
      },
      button(position) {
        return locate(this.container())
            .find('.teaser-actions')
            .find('a.btn')
            .at(position)
            .as(`teaservertical.button.${position}`)
      }
    }
  }

  selectTitle() {
    I.switchTo(this.locator.frame())
    I.click(this.locator.title())
    I.switchTo()
  }

  async grabTitle() {
    I.switchTo(this.locator.frame())
    const title = await I.grabTextFrom(this.locator.title())
    I.switchTo()
    return title
  }

  async grabSubtitle() {
    I.switchTo(this.locator.frame())
    const subtitle = await I.grabTextFrom(this.locator.subtitle())
    I.switchTo()
    return subtitle
  }

  async grabText() {
    I.switchTo(this.locator.frame())
    const text = await I.grabTextFrom(this.locator.text())
    I.switchTo()
    return text
  }

  async grabButtonText(position) {
    I.switchTo(this.locator.frame())
    const buttonText = await I.grabTextFrom(this.locator.button(position))
    I.switchTo()
    return buttonText
  }
}

class InEditorPanel {

  constructor() {
    this.locator = {
      container() {
        return locate('.editor-panel')
            .as('editor-panel')
      },
      button(position) {
        return locate(this.container())
            .find('.field-collection')
            .at(0)
            .find('.collapsible')
            .find('li')
            .at(position)
            .find('.field-input')
            .at(0)
            .find('input[type="text"].form-control')
      }
    }
  }

  async grabButtonText(position) {
    return I.grabValueFrom(this.locator.button(position))
  }
}

module.exports = new TeaserVerticalComponent()
module.exports.TeaserVerticalComponent = TeaserVerticalComponent