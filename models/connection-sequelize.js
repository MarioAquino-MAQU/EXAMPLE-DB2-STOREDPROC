const Sequelize = require('sequelize-ibmi')
const secret = require('../secret')

let sequelize = new Sequelize({
    odbcConnectionString: `DRIVER=IBM i Access ODBC Driver;UID=${secret.username};PWD=${secret.password};
    SYSTEM=${secret.host};DBQ=${secret.schema};`,
    database: secret.database,
    dialect: 'ibmi',
    protocol: 'TCP/IP',
    operatorsAliases: 0,
    quoteIdentifiers: false,
    pool: {
        max: 20,
        min: 5,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: {
        multipleStatements: true
    }
})

sequelize.options.define.freezeTableName = true;
sequelize.options.define.underscored = true;
sequelize.options.define.underscoredAll = true;

module.exports.connection = sequelize;