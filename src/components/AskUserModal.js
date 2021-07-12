const { BaseModal } = require('./bases/BaseModal');

const { I } = inject();

class AskUserModal extends BaseModal {
  constructor() {
    super();
    this.locator = {
      container() {
        return locate('#askUserModal').as('ask-user-modal');
      },
    };
  }

  confirm(yesText = 'Yes') {
    I.wait(this.animation.in);
    I.click(yesText, this.locator.container());
    I.wait(this.animation.out);
  }

  decline(noText = 'No') {
    I.wait(this.animation.in);
    I.click(noText, this.locator.container());
    I.wait(this.animation.out);
  }
}

module.exports = new AskUserModal();
module.exports.AskUserModal = AskUserModal;
