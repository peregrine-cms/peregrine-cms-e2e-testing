const { I } = inject()

class NotifyUserModal {

  constructor() {
    this.animation = {
      in: 0.3, //s
      out: 0.2, //s
    }
  }

  confirm() {
    I.wait(this.animation.in)
    I.click('ok', {css: '#notifyUserModal'})
    I.wait(this.animation.out)
  }
}

module.exports = new NotifyUserModal()
module.exports.NotifyUserModal = NotifyUserModal