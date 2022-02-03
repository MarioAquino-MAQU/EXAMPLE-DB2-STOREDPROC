const express = require('express')
const app = express()
const logger = require('morgan')
const connection = require('./models/connection-sequelize').connection
const odbc = require('odbc')
const secret = require('./secret')
const { QueryTypes } = require('sequelize-ibmi')

const PORT = 8001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.get("/health", (req, res, next) => {
    res.json({"message": "ok"});
})

app.get('/users', async (req, res, next) => {
    let users = await connection.query('select * from users;', {
        type: QueryTypes.SELECT
    });
    res.json(users)
});

app.post('/users/sequelize', async (req, res, next) => {
    /**
     * Call from sequelize
     */

    await connection.query(`
    CALL TOOLSHOP_DEV.CREATE_USER1(
        firstname => 'John',
        lastname => 'Doe',
        email => 'john.doe@easi.net',
        phone => '666',
        "password" => 'super secret');`, {
        type: QueryTypes.SELECT})
    .catch(err => console.error(err))

    let output = await connection.query(`
    values(TOOLSHOP_DEV.OUT1, TOOLSHOP_DEV.OUT2);`, {
        type: QueryTypes.SELECT})
    .catch(err => console.error(err))

    res.json(output)
})

app.post('/users/odbc', async (req, res, next) => {
    /**
     * Call with direct odbc connection
     */
    let odbcconnection = await odbc.connect(`DRIVER={IBM i Access ODBC driver};DATABASE=${secret.database};SYSTEM=${secret.host};UID=${secret.username};PWD=${secret.password};PORT=3306;PROTOCOL=TCPIP;CCSID=1208;`)
                                .catch(err => console.error(err))
    await odbcconnection.query(
        `CALL TOOLSHOP_DEV.CREATE_USER('John', 'Doe', 'john.doe@easi.net', '666', '12345')`)
    .catch(err => console.error(err))

    /*await odbcconnection.callProcedure(null, 'TOOLSHOP_DEV', 'CREATE_USER', [
        'John','Doe', 'john.doe@easi.net', '666', 'super secret'
    ]).catch(err => console.error(err))*/

    let output = await odbcconnection.query(`VALUES(TOOLSHOP_DEV.OUT1, TOOLSHOP_DEV.OUT2)`)
    .catch(err => console.error(err))

    res.json(output)
})

app.delete('/users/test', async (req, res, next) => {
    await connection.query(`delete
    from toolshop_dev.users
    where lower(firstname) = 'john';`)
    .catch(err => console.error(err))

    res.status(204).json({"message": "deleted"})
})