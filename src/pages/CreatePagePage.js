const {I} = inject()

class CreatePagePage {

  constructor() {
  }

  getUrl(tenant) {
    return `/content/admin/pages/pages/create.html/path:/content/${tenant}/pages`
  }

  async createPage(tenant, title, andEdit = false) {
    await I.amOnPage(this.getUrl(tenant))
    await I.click('Next')
    await I.fillField('Title', title)
    await I.click('Next')

    if (andEdit) {
      await I.click('Finish and Edit!')
    } else {
      await I.click('Finish')
    }

    await I.dontSee('create a page')
    /**
     * TODO: workaround for broken reactivity in right-panel editor
     * https://github.com/headwirecom/peregrine-cms/issues/637
     */
    if (andEdit) {
      await I.wait(4)
    }
  }
}

module.exports = new CreatePagePage()
module.exports.CreateNewPagePage = CreatePagePage