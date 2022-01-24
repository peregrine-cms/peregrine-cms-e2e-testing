const {I} = inject()

class AskUserModal {

  constructor() {
    this.animation = {
      in: 0.3, //s
      out: 0.2, //s
    }
  }

  async confirm() {
    await I.wait(this.animation.in)
    await I.click('Yes', {css: '#askUserModal'})
    await I.wait(this.animation.out)
  }

  async save() {
    await I.wait(this.animation.in)
    await I.click('Save', {css: '#askUserModal'})
    await I.wait(this.animation.out)
  }
}

module.exports = new AskUserModal()
module.exports.AskUserModal = AskUserModal