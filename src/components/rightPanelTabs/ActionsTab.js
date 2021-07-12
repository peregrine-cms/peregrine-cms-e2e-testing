const { I } = inject();

class ActionsTab {
  constructor() {
    this.locator = {
      container() {
        return locate('.explorer-preview-content .action-list');
      },
      renamePageBtn() {
        return this.container()
          .find('.action .icon')
          .withText('text_format')
          .as('rename-page-btn');
      },
    };
  }

  clickRenamePage() {
    I.waitForElement(this.locator.renamePageBtn(), 10);
    I.click(this.locator.renamePageBtn());
  }
}

module.exports = new ActionsTab();
module.exports.ActionsTab = ActionsTab;
