const {Request} = require('../helpers/ExtendedRest')
const {ColorPalette} = require('../const')
const {I} = inject()

class PerApi {

  async createTenant(tenant, title = tenant, palette = ColorPalette.default) {
    return I.sendRestRequest(
        Request.build()
            .withUrl('/admin/createTenant.json')
            .withPOST()
            .withFormData({
              fromTenant: 'themecleanflex',
              toTenant: tenant,
              tenantTitle: title,
              colorPalette: palette
            })
            .as(`create tenant "${tenant}"`)
    )
  }

  async deleteTenant(tenant) {
    return I.sendRestRequest(
        Request.build()
            .withUrl(`/admin/deleteTenant.json`)
            .withPOST()
            .withFormData({name: tenant})
            .as(`delete tenant "${tenant}"`)
    )
  }

  async createPage(tenant, name, title = name) {
    return I.sendRestRequest(
        Request.build()
            .withUrl(`/admin/createPage.json/content/${tenant}/pages`)
            .withPOST()
            .withFormData({
              name,
              templatePath: `/content/${tenant}/templates/blank`,
              title
            })
            .as('create page')
    )
  }

  async addComponent(tenant, page, componentName, drop, variation) {
    const component = `/apps/${tenant}/components/${componentName}`
    return I.sendRestRequest(
        Request.build()
            .withUrl(
                `/admin/insertNodeAt.json/content/${tenant}/pages/${page}/jcr:content`)
            .withPOST()
            .withFormData({component, drop, variation})
            .as(`add component "${componentName}" to page "${page}"`)
    )
  }

  createFolder(tenant, path, name) {
    return I.sendRestRequest(
        Request.build()
            .withUrl(`/admin/createFolder.json/content/${tenant}/${path}`)
            .withPOST()
            .withFormData({name})
            .as(`add folder "${name}" to path "${path}"`)
    )
  }

  createObject(tenant, name, templatePath = 'admin/objects/tag') {
    return I.sendRestRequest(
        Request.build()
            .withUrl(`/admin/createObject.json/content/${tenant}/objects`)
            .withPOST()
            .withFormData({name, templatePath})
            .as(`add object "${name}"`)
    )
  }

  updateObject(tenant, name, objectPath, params) {
    return I.sendRestRequest(
        Request.build()
            .withUrl(`/admin/updateResource.json/content/${tenant}/objects/${name}`)
            .withPOST()
            .withFormData({
              content: {
                path: `/content/${tenant}/objects`,
                name,
                objectPath,
                ...params
              }
            })
            .as(`update object "${name}"`)
    )
  }

  deleteObject(tenant, name) {
    return I.sendRestRequest(
        Request.build()
            .withUrl(`/admin/deleteNode.json/content/${tenant}/objects/${name}`)
            .withPOST()
            .as(`delete object "${name}"`)
    )
  }

  createTemplate(tenant, name, title = name,
      component = `${tenant}/components/page`) {
    return I.sendRestRequest(
        Request.build()
            .withUrl(`/admin/createTemplate.json/content/${tenant}/templates`)
            .withPOST()
            .withFormData({name, title, component})
            .as(`add object "${name}"`)
    )
  }
}

module.exports = new PerApi()
module.exports.PerApi = PerApi