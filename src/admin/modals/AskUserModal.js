const { I } = inject()

class AskUserModal {

  constructor() {
    this.animation = {
      in: 0.3, //s
      out: 0.2, //s
    }
  }

  confirm() {
    I.wait(this.animation.in)
    I.click('Yes', {css: '#askUserModal'})
    I.wait(this.animation.out)
  }
}

module.exports = new AskUserModal()
module.exports.AskUserModal = AskUserModal