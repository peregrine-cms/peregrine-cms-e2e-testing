# End-to-End Testing for peregrine-cms
This project uses [CodeceptJS](https://codecept.io/) with [Puppeteer](https://codecept.io/puppeteer/) to provide end-to-end testing for [peregrine-cms](https://github.com/headwirecom/peregrine-cms).

## Requirements
- ready-to-run [peregrine-cms](https://github.com/headwirecom/peregrine-cms) system (on `develop` or `develop-sling12` branch)
- [CodeceptJS](https://codecept.io/vue/#how-to-try-it) requirements
  - node >= 10.5
  - npm/yarn
  - vue-cli installed globally

## Quick Start
- start your peregrine-cms instance (including [themeclean-flex](https://github.com/headwirecom/themeclean-flex))
- clone the repository
- open a terminal inside the directory
- run `npm install`
- run `npm run test` *(headless by default)*
#### Alternative run-modes
- `test:headless` - the default run mode with its full name
- `test:headful` - run with visible browser
- `test:ui` - open codecept-ui to start/view/run tests


### Run Single Test
```shell
npx codeceptjs run ./src/test/<test-file> --steps
```
If you don't want to see the steps and just run it remove the `--steps` argument

-------------------------
For more codeceptjs command visit https://codecept.io/commands/

## License
[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)
