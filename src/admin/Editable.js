const { I } = inject()

class Editable {

  constructor() {
    this.locator = {
      container() {
        return locate('#editable')
            .as('editable')
      },
      copyBtn() {
        return this.container()
            .find('.editable-actions')
            .find('a').withAttr({title: 'copy'})
            .as('copy-btn')
      },
      pasteBtn() {
        return this.container()
            .find('.editable-actions')
            .find('a').withAttr({title: 'paste'})
            .as('paste-btn')
      }
    }
  }

  copy() {
    I.click(this.locator.copyBtn())
  }

  paste() {
    I.click(this.locator.pasteBtn())
  }
}

module.exports = new Editable()
module.exports.Editable = Editable