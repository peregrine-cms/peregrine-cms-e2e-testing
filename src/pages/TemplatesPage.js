const BaseNodePage = require('./bases/BaseNodePage')
const {I} = inject()

class TemplatesPage extends BaseNodePage {

  constructor() {
    super()
  }

  getUrl(tenant) {
    return `/content/admin/pages/templates.html/path:/content/${tenant}/templates`
  }

  deleteTemplate(title) {
    this.explorer.deleteNode('template', title)
  }
}

module.exports = new TemplatesPage()
module.exports.TemplatesPage = TemplatesPage