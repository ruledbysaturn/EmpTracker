const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = require('./db');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Beau123!',
    database: 'employee_db'
});