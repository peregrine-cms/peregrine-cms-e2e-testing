const askUserModal = require('../AskUserModal');
const pathBrowser = require('../PathBrowser');

const { I, renameModal } = inject();

class ActionsTab {
  constructor() {
    this.locator = {
      container() {
        return locate('.explorer-preview-content .action-list');
      },
      renameBtn() {
        return this.container()
          .find('.action .icon')
          .withText('text_format')
          .as('rename-btn');
      },
      deleteBtn() {
        return this.container()
          .find('.action .icon')
          .withText('delete')
          .as('delete-btn');
      },
      copyBtn() {
        return this.container()
          .find('.action .icon')
          .withText('content_copy')
          .as('copy-btn');
      },
      moveBtn() {
        return this.container()
          .find('.action .icon')
          .withText('compare_arrows')
          .as('move-btn');
      },
    };
  }

  rename(title, name = null) {
    I.waitForElement(this.locator.renameBtn(), 10);
    I.click(this.locator.renameBtn());
    renameModal.fillTitleField(title);

    if (name) {
      renameModal.fillNameField(name);
    }

    renameModal.clickSubmit();
  }

  delete(needsConfirmation = true) {
    I.waitForElement(this.locator.deleteBtn(), 10);
    I.click(this.locator.deleteBtn());

    if (needsConfirmation) {
      askUserModal.confirm();
    }
  }

  copy() {
    I.waitForElement(this.locator.copyBtn(), 10);
    I.click(this.locator.copyBtn());
    pathBrowser.select();
  }

  async move(to) {
    I.waitForElement(this.locator.moveBtn(), 10);
    I.click(this.locator.moveBtn());
    await pathBrowser.selectBrowseEntry(to);
    pathBrowser.select();
  }
}

module.exports = new ActionsTab();
module.exports.ActionsTab = ActionsTab;
