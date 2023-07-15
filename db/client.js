const {Client} = require('pg')

const DATABASE = process.env.DATABASE || 'fitnesstrackr';
const DB_URL = process.env.DB_URL || `postgres://localhost:5432/${DATABASE}`

const client = new Client("postgres://localhost:5432/fitnesstrackr");

module.exports = client;
