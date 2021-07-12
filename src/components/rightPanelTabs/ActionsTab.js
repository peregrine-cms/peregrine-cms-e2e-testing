const renameModal = require('../RenameModal');
const askUserModal = require('../AskUserModal');

const { I } = inject();

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

  delete() {
    I.waitForElement(this.locator.deleteBtn(), 10);
    I.click(this.locator.deleteBtn());
    askUserModal.confirm();
  }
}

module.exports = new ActionsTab();
module.exports.ActionsTab = ActionsTab;
