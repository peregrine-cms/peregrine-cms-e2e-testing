const ExplorerPage = require('./ExplorerPage')
const WizardPage = require('./bases/WizardPage')
const {Request} = require('../helpers/ExtendedRest2')
const {I} = inject()

const TYPE = "objects"
const OD_WIZARD_TITLE = 'create an object'
const OD_WIZARD_STEP_1 = 'select object type'
const OD_WIZARD_STEP_2 = 'choose name'
const OD_WIZARD_STEP_3 = 'values'
const OD_WIZARD_TITLE_INPUT_ID = 'object-name'

const BUTTON_NEXT = 'Next'
const BUTTON_FINISH = 'Finish'

class ObjectsPage extends ExplorerPage {

  constructor() {
    super(TYPE)
  }

  getAddButtonText() {
    return "add object"
  }

  getUrl(tenant) {
    return `/content/admin/pages/objects.html/path:/content/${tenant}/objects`
  }

  // Maybe we should move this to a wizard
  async createNew(odName, title) {
    await super.checkBreadcrumbs()
    await super.addNew(title)
    let wizard = new WizardPage()
    await wizard.checkStep(OD_WIZARD_TITLE, OD_WIZARD_STEP_1, BUTTON_NEXT)
    await wizard.selectFromList(odName)
    await wizard.gotoNextStep(BUTTON_NEXT)
    await wizard.checkStep(OD_WIZARD_TITLE, OD_WIZARD_STEP_2, BUTTON_NEXT)
    await wizard.fillInput(OD_WIZARD_TITLE_INPUT_ID, title)
    await wizard.gotoNextStep(BUTTON_NEXT)
    await wizard.checkStep(OD_WIZARD_TITLE, OD_WIZARD_STEP_3, BUTTON_FINISH)
    await wizard.gotoNextStep(BUTTON_FINISH)
    await super.checkEntryByLabel(title)
  }

  async getObject(tenant, objectName) {
    const url = `/content/${tenant}/objects/${objectName}.model.json`
    let request = Request.build()
      .withUrl(url)
      .withGET()
      .as(`Get Object Model, tehant: ${tenant}, object: ${objectName}`);
    return await I.sendRestRequest2(request)
  }
}

module.exports = new ObjectsPage()
module.exports.ObjectsPage = ObjectsPage