const {I} = inject()

class RangeField {

  constructor(container) {
    this.locator = {
      button() {
        return container.find('button')
            .as('range-field-button')
      },
      input() {
        return container.find('input[type="text"]')
            .as('range-field-input')
      },
      range() {
        return container.find('input[type="range"]')
            .as('range-field-range')
      }
    }
  }

  async clickButton() {
    await I.click(this.locator.button())
  }

  async grabInputValue() {
    return await I.grabValueFrom(this.locator.input())
  }

  async selectInput() {
    await I.click(this.locator.input())
  }

  async setInputValue(value) {
    await this.selectInput()
    await I.selectAll()
    await I.fillField(this.locator.input(), value)
  }

  async grabRangeValue() {
    return await I.grabValueFrom(this.locator.range())
  }

  async selectRange() {
    await I.click(this.locator.range())
  }
}

module.exports = module.exports.RangeField = RangeField