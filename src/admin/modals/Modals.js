const notifyUser = require('./NotifyUserModal')
const askUser = require('./AskUserModal')
const publishing = require('./WebPublishingModal')

class Modals {

  notifyUser
  askUser
  publishing

  constructor() {
    this.notifyUser = notifyUser
    this.askUser = askUser
    this.publishing = publishing
  }
}

module.exports = new Modals()
module.exports.Modals = Modals