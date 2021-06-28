const askUserModal = require('./AskUserModal');
const rightPanel = require('../components/RightPanel');
const { I } = inject();

class Explorer {
  askUserModal;
  rightPanel;

  constructor() {
    this.askUserModal = askUserModal;
    this.rightPanel = rightPanel;
    this.locator = {
      container() {
        return locate('.explorer').as('explorer');
      },
      select(type, title) {
        return this.container()
          .find('a')
          .withAttr({ title: `select '${title}'` })
          .as(`${type} select ("${title}")`);
      },
      infoBtn(type, title) {
        return this.container()
          .find('a')
          .withAttr({ title: `'${title}' info` })
          .as(`${type} info ("${title}")`);
      },
      editButton(type, title) {
        return this.container()
          .find('a')
          .withAttr({ title: `edit '${title}'` })
          .as(`edit ${type} ("${title}")`);
      },
      deleteButton(type, title) {
        return this.container()
          .find('a')
          .withAttr({ title: `delete '${title}'` })
          .as(`delete ${type} ("${title}")`);
      },
      filterSwitch() {
        return this.container()
          .find('.explorer-main .switch > label')
          .as('filter-switch');
      },
    };
  }

  seeNode(type, title) {
    I.seeElement(this.locator.select(type, title));
  }

  dontSeeNode(type, title) {
    I.dontSeeElement(this.locator.select(type, title));
  }

  selectNode(type, title) {
    I.click(this.locator.select(type, title));
  }

  nodeInfo(type, title) {
    I.click(this.locator.infoBtn(type, title));
  }

  deleteNode(type, title) {
    I.waitForElement(this.locator.deleteButton(type, title), 5);
    I.click(this.locator.deleteButton(type, title));
    this.askUserModal.confirm();
    I.dontSeeElement(this.locator.deleteButton(type, title));
  }

  editNode(type, title) {
    I.click(this.locator.editButton(type, title));
  }

  toggleFilter() {
    I.click(this.locator.filterSwitch());
  }
}

module.exports = new Explorer();
module.exports.Explorer = Explorer;
