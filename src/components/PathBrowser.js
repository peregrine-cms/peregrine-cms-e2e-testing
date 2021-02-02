const {Website} = require('../const')

const {I} = inject()

class PathBrowser {

  constructor() {
    this.animation = {
      in: 0.3, //s
      out: 0.2, //s
    }
    this.locator = {
      container() {
        return locate('.pathbrowser')
            .as('container')
      },
      browserEntry(name) {
        return locate(this.container())
            .find('.browse-list')
            .find('span').withText(name)
            .as(name)
      },
      selectedPath() {
        return locate(this.container())
            .find('.pathbrowser-selected-path')
            .as('selected path')
      },
      header() {
        return locate(this.container())
            .find('.modal-header')
            .as('header')
      },
      linkTab() {
        return locate(this.container())
            .find('.pathbrowser-tabs')
            .find('.tab')
            .find('.material-icons').withText('link')
            .as('link-tab')
      },
      imgWidth() {
        return locate('#imgWidth').as('Image Width (px)')
      },
      imgHeight() {
        return locate('#imgHeight').as('Image Height (px)')
      }
    }
  }

  select() {
    I.click('select', this.locator.container())
    I.wait(this.animation.out)
  }

  async selectBrowseEntry(name) {
    const currentPath = await I.grabTextFrom(this.locator.selectedPath())
    await I.click(this.locator.browserEntry(name))
    await I.see(`${currentPath}/${name}`, this.locator.selectedPath())
  }

  headerIs(header) {
    I.see(header, this.locator.header())
  }

  setImageDimensions(width, height) {
    I.click(this.locator.linkTab())
    I.fillField(this.locator.imgWidth(), width)
    I.fillField(this.locator.imgHeight(), height)
  }
}

module.exports = new PathBrowser()
module.exports.PathBrowser = PathBrowser