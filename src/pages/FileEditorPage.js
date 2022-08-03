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
        return this.codemirror()
          .find('div div textarea')
      },
      actions() {
        return this.container()
          .find('div.actions')
      },
      save() {
        return this.actions()
          .find('a')
          .withAttr({title: 'save'})
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

  async addContent(content, insertIndex) {
    // Just test CodeMirror to see if we can enter some code there
    let attribute = await I.grabAttributeFrom(this.locator.textarea(), 'spellcheck')
    console.log(`Textarea Spellcheck Attribute: ${attribute}`)

    let currentContent = await I.grabValueFrom(this.locator.textarea())
    console.log(`Textarea Content: ${currentContent}`)


    // To add content we have to move the cursor to the code mirror (tab to get to the CM element and then arrow right
    // to move the cursor to where we add content
    await I.waitForElement(this.locator.textarea(), 10)
    for (let i = 0; i < 14; i++) {
      await I.pressKey('Tab')
    }
    await I.pressKey('Tab')
    for (let i = 0; i < insertIndex; i++) {
      await I.pressKey('ArrowRight')
    }
    await I.fillField(this.locator.textarea(), content)
    // console.log('Start waiting 20s for manual saving')
    // await I.wait(20)
    // console.log('Done waiting')

    await I.moveCursorTo(this.locator.actions())
    await I.waitForElement(this.locator.save(), 10)
    await I.click(this.locator.save())
  }
}

module.exports = FileEditorPage