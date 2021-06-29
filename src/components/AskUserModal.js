const { I } = inject();

class AskUserModal {
  constructor() {
    this.animation = {
      in: 0.3, //s
      out: 0.2, //s
    };
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
