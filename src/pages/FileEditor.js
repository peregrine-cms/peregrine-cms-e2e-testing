const rightPanel = require('../components/RightPanel');
const { I } = inject();

class FileEditor {
  rightPanel;

  constructor() {
    this.rightPanel = rightPanel;
    this.locator = {
      container() {
        return locate('.peregrine-content-view.file-editor').as('file-editor');
      },
      loadSpinner() {
        return this.container().find('.spinner-wrapper').as('load spinner');
      },
      saveBtn() {
        return this.container()
          .find('.actions-wrapper .save-btn')
          .as('save-btn');
      },
      saveAndExitBtn() {
        return this.container()
          .find('.actions-wrapper .save-and-exit-btn')
          .as('save-btn');
      },
      exitBtn() {
        return this.container()
          .find('.actions-wrapper .exit-btn')
          .as('save-btn');
      },
      code() {
        return this.container().find('.CodeMirror .CodeMirror-code').as('code');
      },
      textArea() {
        return this.container()
          .find('.vue-codemirror-wrap > textarea')
          .as('textarea');
      },
    };
  }

  async loaded() {
    await I.waitForNavigation();
    await I.seeInTitle('File Editor');
    await I.dontSeeElement(this.locator.loadSpinner());
  }

  async fillEditor(text) {
    await I.click(this.locator.code());
    await I.selectAll();
    await I.pressKey('Backspace');
    await I.fillField(this.locator.textArea(), text);
  }

  clickSave() {
    I.click(this.locator.saveBtn());
  }
}

module.exports = new FileEditor();
module.exports.FileEditor = FileEditor;
