const ExplorerPage = require('./ExplorerPage')
const WizardPage = require('./bases/WizardPage')
const {I} = inject()

const TYPE = "object-definitions/"
const OD_WIZARD_TITLE = 'create an object definition'
const OD_WIZARD_STEP_1 = 'choose an object definition name'
const OD_WIZARD_STEP_2 = 'verify'
const OD_WIZARD_TITLE_INPUT_ID = 'object-template-name'

const BUTTON_NEXT = 'Next'
const BUTTON_FINISH = 'Finish'


class FileEditorPage extends ExplorerPage {

  tenant
  odName
  fileName

  constructor(tenant, odName, fileName) {
    super(TYPE + '/' + odName + '/' + fileName)

    this.locator = {
      ...this.locator,
      codemirror() {
        return this.container()
          .find('div.vue-codemirror-wrap')
      },
      textarea() {
        return this.container()
          .find('div div textarea')
      },
      saveAndClose() {
        return this.container()
          .find('div.actions')
          .find('a')
          .withAttr({title: 'save & exit'})
      }
    }

    this.tenant = tenant
    this.odName = odName
    this.fileName = fileName
  }

  getAddButtonText() {
    return 'does not exist !!!'
  }

  getUrl(tenant) {
    return `/content/admin/pages/file/edit.html/path:/content/${this.tenant}/${TYPE}/${this.odName}/${this.fileName}`;
  }

  async setContent(content) {
    // TODO: I cannot test the File Editor because it uses CodeMirror and I cannot edit it as is
    await I.waitForElement(this.locator.textarea(), 10)
    await I.fillField(this.locator.textarea(), content)
    await I.wait(20)
    // await I.waitForElement(this.locator.saveAndClose(), 10)
    // await I.click(this.locator.saveAndClose())
  }
}

module.exports = FileEditorPage