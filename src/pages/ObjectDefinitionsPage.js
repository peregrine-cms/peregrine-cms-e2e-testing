const ExplorerPage = require('./ExplorerPage')
const WizardPage = require('./bases/WizardPage')
const FileEditorPage = require("./FileEditorPage");
const {Request} = require('../helpers/ExtendedRest2')
const {I} = inject()

const TYPE = "object-definitions"
const OD_WIZARD_TITLE = 'create an object definition'
const OD_WIZARD_STEP_1 = 'choose an object definition name'
const OD_WIZARD_STEP_2 = 'verify'
const OD_WIZARD_TITLE_INPUT_ID = 'object-template-name'

const BUTTON_NEXT = 'Next'
const BUTTON_FINISH = 'Finish'


class ObjectDefinitionsPage extends ExplorerPage {

  constructor() {
    super(TYPE)
  }

  getAddButtonText() {
    return "add object definition"
  }

  getUrl(tenant) {
    return `/content/admin/pages/${TYPE}.html/path:/content/${tenant}/${TYPE}`
  }

  async showDetails(title) {
    await super.checkBreadcrumbs()
    await super.selectEntryByLabel(title)
  }

  async goToOD() {
    await super.clickBreadcrumb(TYPE)
  }

  async createNew(title) {
    await super.checkBreadcrumbs()
    await super.addNew(title)
    let wizard = new WizardPage()
    await wizard.checkStep(OD_WIZARD_TITLE, OD_WIZARD_STEP_1, BUTTON_NEXT)
    await wizard.fillInput(OD_WIZARD_TITLE_INPUT_ID, title)
    await wizard.gotoNextStep(BUTTON_NEXT)
    await wizard.checkStep(OD_WIZARD_TITLE, OD_WIZARD_STEP_2, BUTTON_FINISH)
    await wizard.gotoNextStep(BUTTON_FINISH)
    await super.checkEntryByLabel(title)
  }

  async editSchema(tenant, odName, schemaName, content, cursorIndex) {
    await this.selectEntryByLabel(schemaName)
    let fileEditor = new FileEditorPage(tenant, odName, schemaName)
    await fileEditor.addContent(content, cursorIndex)
    await this.clickBreadcrumb(odName)
  }

  async getSchemaContent(tenant, odName, schemaName) {
    let response = await I.sendRestRequest2(
      Request.build()
        .withUrl(`/content/${tenant}/${TYPE}/${odName}/${schemaName}`)
        .withGET()
        .withHeader('content-type', 'application/json')
        .as(`Get OD Dialog.json file: "${tenant}"`)
    )
    console.log(`Response Data: ${response.data}`)
    return JSON.stringify(response.data).replace(/ /g, "")
  }
}

module.exports = new ObjectDefinitionsPage()
module.exports.ObjectDefinitionsPage = ObjectDefinitionsPage