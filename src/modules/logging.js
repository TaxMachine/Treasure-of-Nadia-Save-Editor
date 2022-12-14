const { appendFileSync } = require('fs')

const log = async (message) => {
    let
        time = new Date(),
        fulltime = `[${time.toDateString()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}]`,
        filename = `${time.getFullYear()}-${time.getMonth()}-${time.getDay()}.log`
    appendFileSync(filename, `${fulltime} ${message}`)
}

module.exports = { log }