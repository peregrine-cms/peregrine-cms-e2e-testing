const teaserVertical = require('../components/TeaserVerticalComponent')
const textComponent = require('../components/TextComponent')
const cardsComponent = require('../components/CardsComponent')

const { I } = inject()

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

  isReady() {
    I.waitForElement(this.locator.frameElement(), 10)
  }

  isPreview() {
    I.seeAttributesOnElements(this.locator.frameElement(), {
      'data-per-mode': 'preview'
    })
  }

  isEditMode() {
    I.seeAttributesOnElements(this.locator.frameElement(), {
      'data-per-mode': ''
    })
  }

  selectNthInlineEdit(position) {
    I.switchTo(this.locator.frame())
    I.click(this.locator.inlineEdit(position))
    I.click(this.locator.inlineEdit(position))
    I.switchTo()
  }

  setNthInlineEditContent(position, content) {
    this.selectNthInlineEdit(position)
    I.pressKey(['CommandOrControl', 'a'])
    I.switchTo(this.locator.frame())
    I.fillField(this.locator.inlineEdit(position), content)
    I.switchTo()
  }

  async grabNthInlineEditContent(position) {
    I.switchTo(this.locator.frame())
    const content = await I.grabTextFrom(this.locator.inlineEdit(position))
    I.switchTo()
    return content
  }

  containsText(text) {
    I.switchTo(this.locator.frame())
    I.see(text)
    I.switchTo()
  }

  openEditImageModal(src) {
    I.switchTo(this.locator.frame())
    I.seeElement(this.locator.img(src))
    I.waitForClickable(this.locator.img(src))
    I.doubleClick(this.locator.img(src))
    I.wait(this.modal.animation.in)
    I.switchTo()
  }

  seeAttributesOnImage(src, attrs) {
    I.switchTo(this.locator.frame())
    I.seeAttributesOnElements(this.locator.img(src), attrs)
  }

  getCurrentRange() {
    return I.executeScript((selector) => {
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