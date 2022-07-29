const fs = require('fs')
const path = require('path')
const users = require('./resources/users.json')
const {setHeadlessWhen} = require('@codeceptjs/configure')

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

exports.config = {
  tests: './tests/*.js',
  // tests: './tests/edit-page.js',
  // tests: './tests/explorer.js',
  // tests: './tests/graphiql.js',
  // tests: './tests/graphql-forms.js',
  // tests: './tests/graphql-pages.js',
  // tests: './tests/objects.js',
  // tests: './tests/range-slider.js',
  // tests: './tests/rich-toolbar.js',
  // tests: './tests/switching-components.js',
  // tests: './tests/teaser-vertical-component.js',
  // tests: './tests/user-drop-down.js',
  output: `./output`,
  verbose: true,
  helpers: {
    Playwright: {
      url: process.env.CODECEPT_URL || 'http://localhost:8080',
      show: true,
      browser: 'chromium',
      windowSize: '1900x1080',
      keepCookies: true
    },
    ExtendedRest: {
      require: './src/helpers/ExtendedRest.js',
      endpoint: 'http://localhost:8080/perapi',
      withCredentials: true,
      defaultHeaders: {
        auth: users.admin
      }
    },
    ExtendedRest2: {
      require: './src/helpers/ExtendedRest2.js',
      endpoint: 'http://localhost:8080',
      withCredentials: true,
      defaultHeaders: {
        auth: users.admin
      }
    }
  },
  include: {
    I: './src/actor.codecept',
    perApi: './src/modules/PerApi',
    loginPage: './src/pages/LoginPage',
    welcomePage: './src/pages/WelcomePage',
    editPagePage: './src/pages/EditPagePage',
    createPagePage: './src/pages/CreatePagePage',
    pagesPage: './src/pages/PagesPage',
    assetsPage: './src/pages/AssetsPage',
    objectsPage: './src/pages/ObjectsPage',
    templatesPage: './src/pages/TemplatesPage',
    graphiqlPage: './src/pages/GraphiQLPage',
    graphql: './src/modules/graphql'
  },
  async teardown() {
    const outputDir = path.join(__dirname, exports.config.output)
    const fileName = `${users.admin.username}_session.json`

    await fs.unlinkSync(path.join(outputDir, fileName))
  },
  mocha: {},
  name: 'pcms-testing',
  plugins: {
    pauseOnFail: {
      enabled: false
    },
    retryFailedStep: {
      enabled: true
    },
    tryTo: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    },
    customLocator: {
      enabled: true,
      attribute: 'data-per-inline',
      prefix: '$$'
    },
    autoLogin: {
      enabled: true,
      saveToFile: false,
      inject: 'loginAs',
      users: {
        admin: {
          login: async (I) => {
            await I.loginAs('admin')
          },
          check: async (I) => {
            await I.amLoggedIn()
          }
        }
      }
    }
  }
}