const ExplorerPage = require('./ExplorerPage')
const WizardPage = require('./bases/WizardPage')
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
}

module.exports = new ObjectDefinitionsPage()
module.exports.ObjectDefinitionsPage = ObjectDefinitionsPage