const fs = require('fs');
const path = require('path');
const users = require('./resources/users.json');

const MODULES_PATH = `./src/modules`;
const PAGES_PATH = `./src/pages`;
const COMPONENTS_PATH = `./src/components`;

exports.config = {
  name: 'pcms-testing',
  tests: './tests/*.js',
  output: `./output`,
  verbose: true,
  helpers: {
    Playwright: {
      url: process.env.CODECEPT_URL || 'http://localhost:8080',
      show: !process.env.HEADLESS,
      browser: 'chromium',
      windowSize: '1900x1080',
      keepCookies: true,
    },
    ExtendedRest: {
      require: './src/helpers/ExtendedRest.js',
      endpoint: 'http://localhost:8080/perapi',
      withCredentials: true,
      defaultHeaders: {
        auth: users.admin,
      },
    },
  },
  include: {
    I: './src/actor.codecept',
    // Modules
    perApi: `${MODULES_PATH}/PerApi`,
    // Pages
    loginPage: `${PAGES_PATH}/LoginPage`,
    welcomePage: `${PAGES_PATH}/WelcomePage`,
    editPagePage: `${PAGES_PATH}/EditPagePage`,
    createPagePage: `${PAGES_PATH}/CreatePagePage`,
    pagesPage: `${PAGES_PATH}/PagesPage`,
    assetsPage: `${PAGES_PATH}/AssetsPage`,
    objectsPage: `${PAGES_PATH}/ObjectsPage`,
    templatesPage: `${PAGES_PATH}/TemplatesPage`,
    objectDefinitionsPage: `${PAGES_PATH}/ObjectDefinitionsPage`,
    fileEditor: `${PAGES_PATH}/FileEditor`,
    // Components
    toast: `${COMPONENTS_PATH}/Toast`,
    explorer: `${COMPONENTS_PATH}/Explorer`,
    rightPanel: `${COMPONENTS_PATH}/RightPanel`,
    publishingModal: `${COMPONENTS_PATH}/PublishingModal`,
    renameModal: `${COMPONENTS_PATH}/RenameModal`,
  },
  async teardown() {
    const outputDir = path.join(__dirname, exports.config.output);
    const fileName = `${users.admin.username}_session.json`;

    if (fs.existsSync(path.join(outputDir, fileName))) {
      fs.unlinkSync(path.join(outputDir, fileName));
    }
  },
  mocha: {},
  plugins: {
    pauseOnFail: {
      enabled: false,
    },
    retryFailedStep: {
      enabled: true,
    },
    tryTo: {
      enabled: false,
    },
    screenshotOnFail: {
      enabled: true,
    },
    customLocator: {
      enabled: true,
      attribute: 'data-per-inline',
      prefix: '$$',
    },
    autoLogin: {
      enabled: true,
      saveToFile: true,
      inject: 'loginAs',
      users: {
        admin: {
          login: async (I) => {
            await I.loginAs('admin');
          },
          check: async (I) => {
            await I.amLoggedIn();
          },
        },
      },
    },
  },
};
