const { I } = inject()

const ACTIVE_BTN_BG_COLOR = 'rgb(255, 152, 0)'
const INACTIVE_BTN_BG_COLOR = 'rgb(55, 71, 79)'
const BTN_TRANSITION = .2 //s

class RichToolbar {

  constructor() {
    this.dropDown = {
      animation: {
        in: 0.3, //s
        out: 0.225, //s
      }
    }
    this.modal = {
      animation: {
        in: 0.3, //s
        out: 0.2, //s
      }
    }
    this.locator = {
      container() {
        return locate('.richtoolbar.on-sub-nav').as('rich-toolbar')
      },
      toggle(group) {
        return locate(`.btn-group.group-${group}`)
            .as(`toggle ${group}`)
      },
      previewBtn(inNewTab = false) {
        return locate(this.toggle('always-active'))
            .find('button.btn.always-active')
            .at(!inNewTab? 1 : 2)
            .as('preview-btn')
      },
      iconItem(name) {
        return locate(this.toggle('icons'))
            .find('.items-list')
            .find('.item').withText(name)
            .as(name)
      }
    }
  }

  async togglePreview() {
    const cls = await I.grabAttributeFrom(this.locator.previewBtn(), 'class')
    const isActive = cls.split(' ').includes('active')
    I.click(this.locator.previewBtn())
    I.moveCursorTo(this.locator.container(), 500, 500)
    I.wait(BTN_TRANSITION)
    I.seeCssPropertiesOnElements(this.locator.previewBtn(), {
      'background-color': !isActive ? ACTIVE_BTN_BG_COLOR : INACTIVE_BTN_BG_COLOR
    })
  }

  async openPreviewInNewTab(tenant, page) {
    I.click(this.locator.previewBtn(true))
    I.switchToNextTab()
    I.seeInCurrentUrl(`/content/${tenant}/pages/${page}.html`)
  }

  insertIcon(name) {
    I.click(this.locator.toggle('icons'))
    I.wait(this.dropDown.animation.in)
    I.see(name)
    I.click(this.locator.iconItem(name))
    I.wait(this.dropDown.animation.out)
  }

  openImageBrowser() {
    I.click(this.locator.toggle('image'))
    I.wait(this.modal.animation.in)
  }
}

module.exports = new RichToolbar()
module.exports.RichToolbar = RichToolbar