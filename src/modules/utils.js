const uuid = require('uuid')

function currentTime() {
  const now = new Date()
  const day = `${now.getDate()}`.padStart(2, '0')
  const month = `${now.getMonth() + 1}`.padStart(2, '0')
  const year = `${now.getFullYear()}`
  const hour = `${now.getHours()}`.padStart(2, '0')
  const min = `${now.getMinutes()}`.padStart(2, '0')
  const sec = `${now.getSeconds()}`.padStart(2, '0')
  const ms = `${now.getMilliseconds()}`.padStart(2, '0')

  return `${year}-${month}-${day}_${hour}-${min}-${sec}_${ms}`
}

function generateRandomName() {
  let result = uuid.v4()
  while (result.indexOf('-') > -1) {
    result = result.replace('-', '')
  }

  return result
}

module.exports = {
  currentTime,
  generateRandomName
}