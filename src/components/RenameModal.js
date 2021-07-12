const { BaseModal } = require('./bases/BaseModal');

const { I } = inject();

class RenameModal extends BaseModal {
  constructor() {
    super();
    this.locator = {
      container() {
        return locate('.modal.rename-modal').as('rename-modal');
      },
      titleField() {
        return this.container().find('#title').as('title-field');
      },
      submitBtn() {
        return this.container()
          .find('.modal-footer .modal-action')
          .at(2)
          .as('submit-btn');
      },
    };
  }

  fillTitleField(value) {
    I.wait(this.animation.in);
    I.waitForElement(this.locator.titleField(), 10);
    I.fillField(this.locator.titleField(), value);
  }

  clickSubmit() {
    I.wait(this.animation.in);
    I.waitForElement(this.locator.submitBtn());
    I.click(this.locator.submitBtn());
    I.wait(this.animation.out);
  }
}

module.exports = new RenameModal();
module.exports.RenameModal = RenameModal;
