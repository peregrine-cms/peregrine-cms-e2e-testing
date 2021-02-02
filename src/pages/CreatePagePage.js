const {I} = inject()

class CreatePagePage {

  constructor() {
  }

  getUrl(tenant) {
    return `/content/admin/pages/pages/create.html/path:/content/${tenant}/pages`
  }

  createPage(tenant, title, andEdit = false) {
    I.amOnPage(this.getUrl(tenant))
    I.click('Next')
    I.fillField('Title', title)
    I.click('Next')

    if (andEdit) {
      I.click('Finish and Edit!')
    } else {
      I.click('Finish')
    }

    I.dontSee('create a page')
    /**
     * TODO: workaround for broken reactivity in right-panel editor
     * https://github.com/headwirecom/peregrine-cms/issues/637
     */
    if (andEdit) {
      I.wait(4)
    }
  }
}

module.exports = new CreatePagePage()
module.exports.CreateNewPagePage = CreatePagePage