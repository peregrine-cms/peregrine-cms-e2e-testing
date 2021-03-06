const fs = require('fs')
const path = require('path')
const users = require('./resources/users.json')
const {setHeadlessWhen} = require('@codeceptjs/configure')

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

exports.config = {
  tests: './tests/*.js',
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
    templatesPage: './src/pages/TemplatesPage'
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
      enabled: false
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
      saveToFile: true,
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