const { I } = inject()

const RangeField = require('./RangeField')

class EditorPanel {

  constructor() {
    this.locator = {
      container() {
        return locate('.editor-panel').as('editor-panel')
      },
      title() {
        return this.container()
          .find('.panel-title')
          .as('title')
      },
      textEditor(position) {
        return this.container()
          .find('.field-texteditor')
          .at(position)
          .find('.text-editor').withAttr({ contenteditable: 'true' })
          .as('text-editor')
      },
      input(position) {
        return this.container()
          .find('.field-input')
          .at(position)
          .find('input[type="text"]')
          .as('input')
      },
      rangeField(position) {
        return this.container()
          .find('.range-field')
          .at(position)
          .as(`range-field-${position}`)
      },
      accordionPanel(position) {
        return this.container()
          .find('legend')
          .at(position)
          .as(`accordion-${position}`)
      }
    }
  }

  titleIs(title) {
    return I.see(title, this.locator.title())
  }

  selectNthTextEditor(position) {
    I.click(this.locator.textEditor(position))
  }

  setNthTextEditorContent(position, content) {
    this.selectNthTextEditor(position)
    I.selectAll()
    I.fillField(this.locator.textEditor(position), content)
  }

  async grabNthTextEditorContent(position) {
    return await I.grabTextFrom(this.locator.textEditor(position))
  }

  selectNthInput(position) {
    I.click(this.locator.input(position))
  }

  setNthInputValue(position, value) {
    this.selectNthInput(position)
    I.selectAll()
    I.fillField(this.locator.input(position), value)
  }

  async grabNthInputValue(position) {
    return await I.grabValueFrom(this.locator.input(position))
  }

  getNthRangeField(position) {
    return new RangeField(this.locator.rangeField(position))
  }

  openNthAccordionPanel(position) {
    I.click(this.locator.accordionPanel(position))
  }
}

module.exports = new EditorPanel()
module.exports.EditorPanel = EditorPanel