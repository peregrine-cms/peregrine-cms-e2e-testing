const BasePage = require('./BasePage')
const {I} = inject()

class WizardPage extends BasePage{

  constructor() {
    super()

    this.locator = {
      container() {
        return locate('div.tooling-page')
          .find('div.container')
          .as('wizard container')
      },
      title(title) {
        return this.container()
          .find('div.wizard-header')
          .find('h4.wizard-title')
          .withText(title)
          .as(`wizard title: ${title}`)
      },
      stepTitle(title) {
        return this.container()
          .find('div.wizard-navigation')
          .find('li.active')
          .find('span')
          .withText(title)
          .as(`current step title: ${title}`)
      },
      wizard() {
        return this.container()
          .find('div.vue-form-generator')
          .as('wizard container')
      },
      selectByLabel(label) {
        return this.container()
          .find('div.wizard-tab-content')
          .find('li')
          .find('a')
          .withText(label)
      },
      inputById(id) {
        return this.wizard()
          .find('fieldset')
          .find('div.field-wrap')
          .find(`input#${id}`)
          .as('wizard input')
      },
      button(label) {
        return this.container()
          .find('div.wizard-footer-right')
          .find('span')
          .find('button.wizard-btn')
          .withText(label)
          .as(`wizrd button with label: ${label}`)
      }
    }
  }

  async checkStep(title, stepTitle, button) {
    I.waitForElement(this.locator.title(title), 10)
    I.waitForElement(this.locator.stepTitle(stepTitle), 10)
    I.waitForElement(this.locator.button(button), 10)
  }

  async selectFromList(label) {
    I.waitForElement(this.locator.selectByLabel(label), 10)
    I.click(this.locator.selectByLabel(label))
  }

  async fillInput(inputId, value) {
    I.waitForElement(this.locator.inputById(inputId), 10)
    I.fillField(this.locator.inputById(inputId), value)
  }

  async gotoNextStep(button) {
    I.waitForElement(this.locator.button(button), 10)
    I.click(this.locator.button(button))
  }
}

module.exports = WizardPage