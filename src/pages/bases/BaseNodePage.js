const BasePage = require('./BasePage');
const explorer = require('../../components/Explorer');
const { I } = inject();

class BaseNodePage extends BasePage {
  explorer;

  constructor() {
    super();
    this.explorer = explorer;
  }

  navigate(tenant) {
    super.navigate(tenant);
    I.waitForElement('.explorer', 10);
  }

  open(nodeName) {
    I.click(nodeName, '.explorer');
    I.wait(1);
  }
}

module.exports = BaseNodePage;
