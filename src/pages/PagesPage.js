const BaseNodePage = require('./bases/BaseNodePage')
const editPagePage = require('./EditPagePage')
const {I} = inject()

class PagesPage extends BaseNodePage {
  constructor() {
    super();
  }

  getUrl(tenant) {
    return `/content/admin/pages/pages.html/path:/content/${tenant}/pages`;
  }

  deletePage(title) {
    this.explorer.deleteNode('page', title);
  }

  editPage(title) {
    this.explorer.editNode('page', title);
    editPagePage.loaded();
  }

  editFile(title) {
    this.explorer.editNode('file', title);
    fileEditor.loaded();
  }

  seePage(title) {
    this.explorer.seeNode('page', title);
  }
}

module.exports = new PagesPage()
module.exports.PagesPage = PagesPage