const BaseNodePage = require('./bases/BaseNodePage');
const { I } = inject();

class AssetsPage extends BaseNodePage {
  constructor() {
    super();
    this.locator = {
      subNav() {
        return locate('.sub-nav').as('sub-nav');
      },
      fileUpload() {
        return this.subNav().find('input[type="file"]').as('file-upload');
      },
    };
  }

  getUrl(tenant) {
    return `/content/admin/pages/assets.html/path:/content/${tenant}/assets`;
  }

  deleteAsset(title) {
    this.explorer.deleteNode('asset', title);
  }

  uploadAsset(filepath) {
    I.attachFile(this.locator.fileUpload(), filepath);
    const filename = filepath.replace('\\', '/').split('/').pop();
    I.waitForText(filename, 10);
  }
}

module.exports = new AssetsPage();
module.exports.AssetsPage = AssetsPage;
