const teaserVertical = require('./TeaserVerticalComponent')
const textComponent = require('./TextComponent')
const cardsComponent = require('./CardsComponent')

const {I} = inject()

class EditView {

  teaserVertical
  textComponent
  cardsComponent

  constructor() {
    this.teaserVertical = teaserVertical.inEditView
    this.textComponent = textComponent.inEditView
    this.cardsComponent = cardsComponent.inEditView
    this.modal = {
      animation: {
        in: 0.3, //s
        out: 0.2, //s
      }
    }
    this.locator = {
      frame() {
        return {frame: '#editview'}
      },
      frameElement() {
        return locate('#editview').as('edit-view-frame')
      },
      inlineEdit(position) {
        return locate('.inline-edit')
            .withAttr({contenteditable: 'true'})
            .at(position)
            .as('inline-edit')
      },
      img(src) {
        return locate('img')
            .withAttr({src})
            .as(src)
      }
    }
  }

  async isReady() {
    await I.waitForElement(this.locator.frameElement(), 10)
  }

  async isPreview() {
    await I.seeAttributesOnElements(this.locator.frameElement(), {
      'data-per-mode': 'preview'
    })
  }

  async isEditMode() {
    await I.seeAttributesOnElements(this.locator.frameElement(), {
      'data-per-mode': ''
    })
  }

  async selectNthInlineEdit(position) {
    await I.switchTo(this.locator.frame())
    await I.click(this.locator.inlineEdit(position))
    await I.click(this.locator.inlineEdit(position))
    await I.switchTo()
  }

  async setNthInlineEditContent(position, content) {
    await this.selectNthInlineEdit(position)
    await I.pressKey(['CommandOrControl', 'a'])
    await I.switchTo(this.locator.frame())
    await I.fillField(this.locator.inlineEdit(position), content)
    await I.switchTo()
  }

  async grabNthInlineEditContent(position) {
    await I.switchTo(this.locator.frame())
    const content = await I.grabTextFrom(this.locator.inlineEdit(position))
    await I.switchTo()
    return content
  }

  async containsText(text) {
    await I.switchTo(this.locator.frame())
    await I.see(text)
    await I.switchTo()
  }

  async openEditImageModal(src) {
    await I.switchTo(this.locator.frame())
    await I.seeElement(this.locator.img(src))
    await I.waitForClickable(this.locator.img(src))
    await I.doubleClick(this.locator.img(src))
    await I.wait(this.modal.animation.in)
    await I.switchTo()
  }

  async seeAttributesOnImage(src, attrs) {
    await I.switchTo(this.locator.frame())
    await I.seeAttributesOnElements(this.locator.img(src), attrs)
  }

  async getCurrentRange() {
    return await I.executeScript((selector) => {
      return {
        start: document.querySelector(
            selector).contentWindow.getSelection().getRangeAt(0).startOffset,
        end: document.querySelector(
            selector).contentWindow.getSelection().getRangeAt(0).endOffset
      }
    }, '#editview')
  }
}

module.exports = new EditView()
module.exports.EditView = EditView