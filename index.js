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

async function startApp() {
    try {
        const { action } = await inquirer.createPromptModule({
            name: 'action',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        });

        switch (action) {
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Exit':
                console.log('Goodbye!');
                connection.end();
                break;
        }

        startApp();
    } catch (err) {
        console.error(err);
    }
}

async function viewAllDepartments() {
    const [rows, fields] = await connection.query('SELECT * FROM department');
    console.table(rows);
}

async function viewAllRoles() {
    const [rows, fields] = await connection.query('SELECT * FROM role');
    console.table(rows);
}

async function viewAllEmployees() {
    const [rows, fields] = await connection.query('SELECT * FROM employee');
    console.table(rows);
}

async function addDepartment() {
    const { departmentName } = await inquirer.createPromptModule({
        type: 'input',
        name: 'departmentName',
        message: 'What is the name of the department?',
    });
    await connection.query(`INSERT INTO department (name) VALUES (?)`, [departmentName]);
    console.log('Department added successfully!');
}

async function addRole() {
    const { title, salary, departmentId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the name of the role?',
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?',
        },
        {
            type: 'input',
            name: 'departmentId',
            message: 'What is the department ID of the role?',
        },
    ]);

    await connection.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [title, salary, departmentId]);
    console.log('Role added successfully!');
}

async function addEmployee() {
    const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the first name of the employee?',
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the last name of the employee?',
        },
        {
            type: 'input',
            name: 'roleId',
            message: 'What is the role ID of the employee?',
        },
        {
            type: 'input',
            name: 'managerId',
            message: 'What is the manager ID of the employee (leave blank if none)?',
        },
    ]);

    await connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [
        firstName,
        lastName,
        roleId,
        managerId || null,
      ]);
      console.log('Employee added successfully.');
    }

async function updateEmployeeRole() {
    const { employeeId, newRoleId } = await inquirer.prompt([
        {
            type: 'input',
            name: 'employeeId',
            message: 'What is the ID of the employee you want to update?',
        },
        {
            type: 'input',
            name: 'newRoleId',
            message: 'What is the new role ID of the employee?',
        },
    ]);

    await connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [newRoleId, employeeId]);
    console.log('Employee role updated successfully.');
}

