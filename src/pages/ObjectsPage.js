const BaseNodePage = require('./bases/BaseNodePage')
// const rightPanel = require('../components/RightPanel')
const {I} = inject()

class ObjectsPage extends BaseNodePage {

  // rightPanel

  constructor() {
    super()
    // this.rightPanel = rightPanel

    this.locator = {
      container() {
        return locate('.tooling-page')
      },
      createBtn() {
        return this.container()
            .find('a').withAttr({title: 'add object'})
            .as('create-btn')
      }
    }
  }

  getUrl(tenant) {
    return `/content/admin/pages/objects.html/path:/content/${tenant}/objects`
  }

  async deleteObject(title) {
    await this.explorer.deleteNode('object', title)
  }

  async editObject(title) {
    await this.explorer.editNode('object', title)
  }

  async saveChanges(title) {
    await this.explorer.saveChanges('object', title)
  }
}

module.exports = new ObjectsPage()
module.exports.ObjectsPage = ObjectsPage