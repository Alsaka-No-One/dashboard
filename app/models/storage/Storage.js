const mysql = require("mysql");

const config = require.main.require("../config/database.json");

class Storage {
    constructor(connection_params = {}) {
        this.pool = mysql.createPool(Object.assign({
            connectionLimit:    5,
            host:               process.env.MYSQL_HOST || config.host,
            database:           process.env.MYSQL_DATABASE || config.schema,
            user:               process.env.MYSQL_USER || config.user,
            password:           process.env.MYSQL_PASSWORD || config.password,
            multipleStatements: true
        }, connection_params));
    }

    query(sql, ...values) {
        console.debug("SQL query:", sql, values);

        return new Promise((resolve, reject) => {
            this.pool.query(sql, values, (err, result) => {
                if (err)
                    return reject(err);
                console.debug("Result:", result);
                resolve(result);
            });
        });
    }
}

module.exports = Storage;
