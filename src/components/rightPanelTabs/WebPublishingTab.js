const renameModal = require('../RenameModal');
const askUserModal = require('../AskUserModal');
const pathBrowser = require('../PathBrowser');

const { I } = inject();

class WebPublishingTab {
  constructor() {
    this.locator = {
      actionList() {
        return locate('.explorer-preview-content .action-list');
      },
      publishToWebBtn() {
        return this.actionList()
          .find('.action i')
          .withText('publish')
          .as('publish-to-web-btn');
      },
    };
  }

  async clickPublishToWeb() {
    I.waitForElement(this.locator.publishToWebBtn(), 10);
    I.click(this.locator.publishToWebBtn());
  }
}

module.exports = new WebPublishingTab();
module.exports.WebPublishingTab = WebPublishingTab;
