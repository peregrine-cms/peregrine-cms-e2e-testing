const ExtendedRest = require('./ExtendedRest')

class ExtendedRest2 extends ExtendedRest {

  constructor(config) {
    super(config)
  }

  async sendRestRequest2(req) {
    return super.sendRestRequest(req)
  }
}

module.exports = ExtendedRest2
