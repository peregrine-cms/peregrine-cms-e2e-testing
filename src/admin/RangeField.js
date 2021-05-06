const { I } = inject()

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

  clickButton() {
    I.click(this.locator.button())
  }

  async grabInputValue() {
    return await I.grabValueFrom(this.locator.input())
  }

  selectInput() {
    I.click(this.locator.input())
  }

  setInputValue(value) {
    this.selectInput()
    I.selectAll()
    I.fillField(this.locator.input(), value)
  }

  async grabRangeValue() {
    return await I.grabValueFrom(this.locator.range())
  }

  selectRange() {
    I.click(this.locator.range())
  }
}

module.exports = module.exports.RangeField = RangeField