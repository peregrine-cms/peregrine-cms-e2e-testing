const notifyUser = require('./NotifyUserModal')
const askUser = require('./AskUserModal')

class Modals {

  notifyUser
  askUser

  constructor() {
    this.notifyUser = notifyUser
    this.askUser = askUser
  }
}

module.exports = new Modals()
module.exports.Modals = Modals