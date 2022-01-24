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

  async selectTitle() {
    await I.switchTo(this.locator.frame())
    await I.click(this.locator.title())
    await I.switchTo()
  }

  async grabTitle() {
    await I.switchTo(this.locator.frame())
    const title = await I.grabTextFrom(this.locator.title())
    await I.switchTo()
    return title
  }

  async grabSubtitle() {
    await I.switchTo(this.locator.frame())
    const subtitle = await I.grabTextFrom(this.locator.subtitle())
    await I.switchTo()
    return subtitle
  }

  async grabText() {
    await I.switchTo(this.locator.frame())
    const text = await I.grabTextFrom(this.locator.text())
    await I.switchTo()
    return text
  }

  async grabButtonText(position) {
    await I.switchTo(this.locator.frame())
    const buttonText = await I.grabTextFrom(this.locator.button(position))
    await I.switchTo()
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
    return await I.grabValueFrom(this.locator.button(position))
  }
}

module.exports = new TeaserVerticalComponent()
module.exports.TeaserVerticalComponent = TeaserVerticalComponent