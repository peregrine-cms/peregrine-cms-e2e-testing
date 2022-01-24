const BaseNodePage = require('./bases/BaseNodePage')
const editPagePage = require('./EditPagePage')
const {I} = inject()

class PagesPage extends BaseNodePage {

  constructor() {
    super()
  }

  getUrl(tenant) {
    return `/content/admin/pages/pages.html/path:/content/${tenant}/pages`
  }

  async deletePage(title) {
    await this.explorer.deleteNode('page', title)
  }

  async editPage(title) {
    await this.explorer.editNode('page', title)
    await editPagePage.loaded()
  }
}

module.exports = new PagesPage()
module.exports.PagesPage = PagesPage