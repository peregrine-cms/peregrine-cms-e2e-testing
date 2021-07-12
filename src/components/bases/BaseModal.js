const { I } = inject();

class BaseModal {
  constructor() {
    this.animation = {
      in: 0.3, //s
      out: 0.2, //s
    };
  }
}

module.exports = new BaseModal();
module.exports.BaseModal = BaseModal;
