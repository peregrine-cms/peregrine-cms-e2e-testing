const { I } = inject()

class WebPublishingModal {

  constructor() {
    this.animation = {
      in: 0.3, //s
      out: 0.2, //s
    }
  }

  confirm() {
    I.wait(this.animation.in)
    I.click('submit', { css: '#publishingmodal' })
    I.wait(this.animation.out)
  }

  cancel() {
    I.wait(this.animation.in)
    I.click('cancel', { css: '#publishingmodal' })
    I.wait(this.animation.out)
  }
}

module.exports = new WebPublishingModal()
module.exports.WebPublishingModal = WebPublishingModal