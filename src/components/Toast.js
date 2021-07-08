const { I } = inject();

class Toast {
  constructor() {
    this.locator = {
      container() {
        return locate('.toast-container').as('toast-container');
      },
      toast(type) {
        return this.container().find(`.toast.${type}`).as(`toast (${type})`);
      },
    };
  }

  see(type, message) {
    I.see(message, this.locator.toast(type));
  }
}

module.exports = new Toast();
module.exports.Toast = Toast;
