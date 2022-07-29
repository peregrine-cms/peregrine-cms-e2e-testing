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
        return locate('div.editor-panel')
            .find('fieldset')
            .at(position)
            .as('teaser-vertical')
      },
      title() {
        return locate(this.container())
            .find('input#title')
            .as('teaservertical.title')
      },
      subtitle() {
        return locate(this.container())
            .find('textarea#subtitle')
            .as('teaservertical.subtitle')
      },
      text() {
        return locate(this.container())
            .find('div.text-editor-wrapper')
             .find('p p')
            .as('teaservertical.text')
      },
      button(position) {
        return locate('div.editor-panel')
            .find('div.editor-panel-buttons')
            .find('button')
            .at(position)
            .as(`teaservertical.button.${position}`)
      }
    }
  }

  async selectTitle() {
    await I.click(this.locator.title())
  }

  async grabTitle() {
    const title = await I.grabValueFrom(this.locator.title())
    return title
  }

  async grabSubtitle() {
    const subtitle = await I.grabValueFrom(this.locator.subtitle())
    return subtitle
  }

  async grabText() {
    const text = await I.grabTextFrom(this.locator.text())
    return text
  }

  async grabButtonText(position) {
    const buttonText = await I.grabTextFrom(this.locator.button(position))
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