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

  async titleIs(title) {
    return await I.see(title, this.locator.title())
  }

  async selectNthTextEditor(position) {
    await I.click(this.locator.textEditor(position))
  }

  async setNthTextEditorContent(position, content) {
    await this.selectNthTextEditor(position)
    await I.selectAll()
    await I.fillField(this.locator.textEditor(position), content)
  }

  async grabNthTextEditorContent(position) {
    return await I.grabTextFrom(this.locator.textEditor(position))
  }

  async selectNthInput(position) {
    await I.click(this.locator.input(position))
  }

  async setNthInputValue(position, value) {
    await this.selectNthInput(position)
    await I.selectAll()
    await I.fillField(this.locator.input(position), value)
  }

  async grabNthInputValue(position) {
    const answer = await I.grabValueFrom(this.locator.input(position))
    return answer
  }

  async getNthRangeField(position) {
    return await new RangeField(this.locator.rangeField(position))
  }

  async openNthAccordionPanel(position) {
    await I.click(this.locator.accordionPanel(position))
  }
}

module.exports = new EditorPanel()
module.exports.EditorPanel = EditorPanel