const {I} = inject()

class RightPanel {

  constructor() {
    this.locator = {
      container(){
        return locate('.explorer-preview')
      },
      referencesTabBtn() {
        return this.container()
            .find('.explorer-preview-nav')
            .find('.nav-left')
            .find('a').withAttr({title: 'references'})
            .as('references-tab-btn')
      },
      reference(position) {
        return this.container()
            .find('.explorer-page-referenced-by')
            .find('.collection-item').at(position)
            .as(`reference no. ${position}`)
      }
    }
  }

  openReferencesTab() {
    I.waitForElement(this.locator.referencesTabBtn(), 10)
    I.click(this.locator.referencesTabBtn())
  }

  clickReference(position) {
    I.click(this.locator.reference(position))
  }
}

module.exports = new RightPanel()
module.exports.RightPanel= RightPanel