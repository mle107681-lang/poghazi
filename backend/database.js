const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'poghazi-data.json');

const DEFAULT_DATA = {
    users: [],
    donhang: [],
    lichsu_giao_dich: [],
    nextUserId: 1,
    nextOrderId: 1,
    nextTransactionId: 1
};

function load() {
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
        fs.writeFileSync(
            FILE,
            JSON.stringify(DEFAULT_DATA, null, 2)
        );

        return JSON.parse(
            JSON.stringify(DEFAULT_DATA)
        );
    }
}

let data = load();

function save() {
    fs.writeFileSync(
        FILE,
        JSON.stringify(data, null, 2)
    );
}

function getData() {
    return data;
}

function saveData() {
    save();
}

module.exports = {
    getData,
    saveData
};
