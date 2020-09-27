const mysql = require('mysql');
let db = null;

const connectCheck = (err) => {
    if (err) {
        console.error('ERROR::DB::CONNECTION: ' + err.stack);
        return false;
    }
    console.log('SUCCESS::DB::CONNECTION: Connected as ID: ' + db.threadId);
    return true;
}

export default {
    
    connect: () => {
        db = mysql.createConnection({
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PWD,
            database: process.env.MYSQL_DB
        });
        db.connect(connectCheck);
    },

    end: () => {
        db.end();
    },

    insertInto: (table: string, columns: Array<string>, values: Array<any>) : Promise<any> => {
        return new Promise((resolve, reject) => {

            let query = `INSERT INTO ${table} (${columns[0]}`;
            for (let i = 1; i < columns.length; i++) {
                query += `, ${columns[i]}`;
            }
            query += `) VALUES (${values[0]}`;
            for (let i = 1; i < values.length; i++) {
                query += `, ${values[i]}`;
            }
            query += `);`;
            
            db.query(query, (error, result, fields) => {
                if (error) {
                    reject({ status: 0, msg: 'ERROR::DB::' + error.sqlMessage + ', QUERY - ' + query });
                    return;
                }
                resolve({ status: 1 });
            });

        });
    },

    selectColFrom: (columns: Array<string>, table: string) : Promise<any> => {
        return new Promise((resolve, reject) => {

            let query = 'SELECT ';
            if (!columns.length) {
                query += `* FROM ${table};`
            } else {
                query += `${columns[0]}`;
                for (let i = 1; i < columns.length; i++) {
                    query += `, ${columns[i]}`;
                }
                query += ` FROM ${table}`;
            }
            
            db.query(query, (error, result, fields) => {
                if (error) {
                    reject({ status: 0, msg: 'ERROR::DB::' + error.sqlMessage + ', QUERY - ' + query });
                    return;
                }
                let response = [];
                for (const row of result) {
                    let obj = {};
                    for (const key in row) {
                        obj[key] = row[key];
                    }
                    response.push(obj);
                }
                resolve({ status: 1, result: response })
            });

        });
    },

    selectRowFrom: (table: string, condition: string) : Promise<any> => {
        return new Promise((resolve, reject) => {

            let query = `SELECT * FROM ${table} WHERE ${condition};`;
            db.query(query, (error, result, fields) => {
                if (error) {
                    reject({ status: 0, msg: 'ERROR::DB::' + error.sqlMessage + ', QUERY - ' + query });
                    return;
                }

                let response = [];
                for (const row of result) {
                    let obj = {};
                    for (const key in row) {
                        obj[key] = row[key];
                    }
                    response.push(obj);
                }
                resolve({ status: 1, result: response });
            });
        });
    },

    updateRowFrom: (table: string, column: Array<string>, value: Array<any>, condition: string) : Promise<any> => {
        return new Promise((resolve, reject) => {

            let query = `UPDATE ${table} SET ${column[0]}=${value[0]}`;
            for (let i = 1; i < column.length; i++) {
                query += `, ${column[i]}=${value[i]}`;
            }
            if (condition.length)
                query += ` WHERE ${condition};`;
            
            db.query(query, (error, result, fields) => {
                if (error) {
                    reject({ status: 0, msg: 'ERROR::DB::' + error.sqlMessage + ', QUERY - ' + query });
                    return;
                }

                resolve({ status: 1 });
            });

        });
    },

    deleteRowFrom: (table: string, column: string, value: string) : Promise<any> => {
        return new Promise((resolve, reject) => {

            let query = `DELETE FROM ${table} WHERE ${column} = ${value};`;
            db.query(query, (error, result, fields) => {
                if (error) {
                    reject({ status: 0, msg: 'ERROR::DB::' + error.sqlMessage + ', QUERY - ' + query });
                    return;
                }
                resolve({ status: 1 });
            });

        });
    },

    deleteAllFrom: (table: string) : Promise<any> => {
        return new Promise((resolve, reject) => {

            const query = `TRUNCATE TABLE ${table};`;
            db.query(query, (error, result, fields) => {
                if (error) {
                    reject({ status: 0, msg: 'ERROR::DB::' + error.sqlMessage + ', QUERY - ' + query });
                    return;
                }
                resolve({ status: 1 });
            });

        });
    }
}