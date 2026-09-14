const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const FILE = path.join(__dirname, 'poghazi-data.json');

const DEFAULT_DATA = {
    users: [],
    donhang: [],
    lichsu_giao_dich: [],
    nextUserId: 1,
    nextOrderId: 1,
    nextTransactionId: 1
};

function loadLocal() {
    if (!fs.existsSync(FILE)) {
        fs.writeFileSync(
            FILE,
            JSON.stringify(DEFAULT_DATA, null, 2)
        );
    }

    try {
        return JSON.parse(
            fs.readFileSync(FILE, 'utf8')
        );
    } catch {
        return JSON.parse(
            JSON.stringify(DEFAULT_DATA)
        );
    }
}

let data = loadLocal();

let pool = null;
let ready = Promise.resolve();

if (process.env.DATABASE_URL) {

    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    ready = (async () => {

        await pool.query(`
            CREATE TABLE IF NOT EXISTS poghazi_data (
                id INTEGER PRIMARY KEY,
                data JSONB NOT NULL
            )
        `);

        const result = await pool.query(
            'SELECT data FROM poghazi_data WHERE id = 1'
        );

        if (result.rows.length > 0) {
            data = result.rows[0].data;
        } else {
            await pool.query(
                `
                INSERT INTO poghazi_data (id, data)
                VALUES (1, $1::jsonb)
                `,
                [JSON.stringify(data)]
            );
        }

    })();
}

let saveQueue = Promise.resolve();

function getData() {
    return data;
}

function saveData() {

    if (!pool) {
        fs.writeFileSync(
            FILE,
            JSON.stringify(data, null, 2)
        );
        return;
    }

    saveQueue = saveQueue.then(async () => {

        await ready;

        await pool.query(
            `
            INSERT INTO poghazi_data (id, data)
            VALUES (1, $1::jsonb)
            ON CONFLICT (id)
            DO UPDATE SET data = EXCLUDED.data
            `,
            [JSON.stringify(data)]
        );

    }).catch(err => {
        console.error(
            'Lỗi lưu PostgreSQL:',
            err.message
        );
    });

}

module.exports = {
    getData,
    saveData,
    ready
};
