const BaseNodePage = require('./bases/BaseNodePage')
const {I} = inject()

class ObjectsPage extends BaseNodePage{

  constructor() {
    super()
  }

  getUrl(tenant) {
    return `/content/admin/pages/objects.html/path:/content/${tenant}/objects`
  }

  deleteObject(title) {
    this.explorer.deleteNode('object', title)
  }
}

module.exports = new ObjectsPage()
module.exports.ObjectsPage = ObjectsPage