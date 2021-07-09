const expect = require('expect');
const rightPanel = require('../components/RightPanel');
const askUserModal = require('../components/AskUserModal');
const { I } = inject();

class FileEditor {
  rightPanel;
  askUserModal;

  constructor() {
    this.rightPanel = rightPanel;
    this.askUserModal = askUserModal;
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
          .as('save-and-exit-btn');
      },
      exitBtn() {
        return this.container()
          .find('.actions-wrapper .exit-btn')
          .as('exit-btn');
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

  seeMyself() {
    I.seeElement(this.locator.container());
  }

  async load(path) {
    await I.amOnPage(`/content/admin/pages/file/edit.html/path:${path}`);
    await this.loaded();
  }

  async loaded() {
    await I.waitForNavigation();
    await I.seeInTitle('File Editor');
    await I.dontSeeElement(this.locator.loadSpinner());
    await I.dontSeeElement(this.locator.loadSpinner());
  }

  async fillCode(text) {
    await I.click(this.locator.code());
    await I.selectAll();
    await I.pressKey('Backspace');
    await I.fillField(this.locator.textArea(), text);
    await this.seeCode(text);
  }

  async seeCode(text) {
    const code = await this.grabCode();

    expect(code).toBe(text);
  }

  async grabCode() {
    I.waitForElement(this.locator.code());
    const value = await I.executeScript((sel) => {
      return document.querySelector(sel).__vue__.editor.getValue();
    }, '.vue-codemirror-wrap');

    return value;
  }

  autoFormat() {
    I.click(this.locator.code());
    I.selectAll();
    I.pressKey(['CommandOrControl', 'Alt', 'l']);
  }

  clickSave() {
    I.click(this.locator.saveBtn());
    I.see('Saved file', locate('.toast.success').as('toast (success)'));
  }

  clickSaveAndExit() {
    I.moveCursorTo(this.locator.saveBtn());
    I.click(this.locator.saveAndExitBtn());
  }

  clickExit(confirm = null) {
    I.moveCursorTo(this.locator.saveBtn());
    I.click(this.locator.exitBtn());

    if (confirm !== null) {
      if (confirm) {
        this.askUserModal.confirm();
      } else {
        this.askUserModal.decline();
      }
    }
  }
}

module.exports = new FileEditor();
module.exports.FileEditor = FileEditor;
