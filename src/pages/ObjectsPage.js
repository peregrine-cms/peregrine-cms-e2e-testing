const BaseNodePage = require('./bases/BaseNodePage')
const {I} = inject()

class ObjectsPage extends BaseNodePage {

  constructor() {
    super()

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

  deleteObject(title) {
    this.explorer.deleteNode('object', title)
  }

  editObject(title) {
    this.explorer.editNode('object', title)
  }
}

module.exports = new ObjectsPage()
module.exports.ObjectsPage = ObjectsPage