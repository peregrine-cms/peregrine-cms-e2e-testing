const { BaseModal } = require('./bases/BaseModal');

const { I } = inject();

class PublishingModal extends BaseModal {
  constructor() {
    super();
    this.locator = {
      container() {
        return locate('.publishing-modal').as('publishing-modal');
      },
      footer() {
        return this.container().find('.modal-footer').as('footer');
      },
      submitBtn() {
        return this.footer()
          .find('.modal-action')
          .withText('submit')
          .as('submit-btn');
      },
    };
  }

  clickSubmit() {
    I.waitForElement(this.locator.submitBtn(), 10);
    I.click(this.locator.submitBtn());
  }
}

module.exports = new PublishingModal();
module.exports.PublishingModal = PublishingModal;
