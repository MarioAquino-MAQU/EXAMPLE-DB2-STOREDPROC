const odbc = require('odbc')
const secret = require('../secret')

async function openConnection(callback) {
    return odbc.connect(`DRIVER={IBM i Access ODBC driver};DATABASE=${secret.database};SYSTEM=${secret.host};UID=${secret.username};PWD=${secret.password};PORT=3306;PROTOCOL=TCPIP`,
    callback())
}

module.exports.connection = openConnection