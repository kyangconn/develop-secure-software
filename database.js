const {Client} = require('pg');
require('dotenv').config();

// validate database configs in .env file
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_DATABASE'];
requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        throw new Error(`缺少必需的环境变量: ${varName}`);
    }
});

const client = new Client({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
})

client.connect()
    .then(() => {
        console.log('Connected to database');
    })
    .catch(err => {
        console.log('Connection Error:', err.message)
    });

