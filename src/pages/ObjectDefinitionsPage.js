const BaseNodePage = require('./bases/BaseNodePage');
const { I } = inject();

class ObjectDefinitionsPage extends BaseNodePage {
  constructor() {
    super();
  }

  getUrl(tenant) {
    return `/content/admin/pages/object-definitions.html/path:/content/${tenant}/object-definitions`;
  }

  async addObjectDefinition(name) {
    await I.click('add object definition');
    await I.waitForText('create an object definition', 10);
    await I.fillField('Object Template Name', name);
    await I.click('Next');
    await I.waitForText(`"name": "${name}"`, 10);
    await I.click('Finish');
    await I.waitForText(name, 10);
  }

  deleteObjectDefinition(name) {
    this.explorer.deleteNode('object-definition', name);
  }

  async addFile(name, template = 'ui-schema') {
    await I.click('add ui-schema');
    await I.waitForText('Create UI-Schema', 10);
    await I.fillField('ui-schema name', name);
    await I.click('Next');
    await I.waitForText('Insert template');
    await I.click(template);
    await I.waitForText('"type": "VerticalLayout",');
    await I.click('Next');
    await I.click('Finish');
    await I.waitForText(name, 10);
  }

  seeObjectDefinition(name) {
    this.explorer.seeNode('object-definition', name);
  }

  dontSeeObjectDefinition(name) {
    this.explorer.dontSeeNode('object-definition', name);
  }

  selectObjectDefinition(name) {
    this.explorer.selectNode('object-definition', name);
  }

  seeFile(name) {
    this.explorer.seeNode('object-definition-file', `${name}.json`);
  }

  dontSeeFile(name) {
    this.explorer.dontSeeNode('object-definition-file', `${name}.json`);
  }

  deleteFile(name) {
    this.explorer.deleteNode('object-definition-file', `${name}.json`);
  }

  editFile(name) {
    this.explorer.editNode('object-definition-file', `${name}.json`);
  }
}

module.exports = new ObjectDefinitionsPage();
module.exports.AssetsPage = ObjectDefinitionsPage;
