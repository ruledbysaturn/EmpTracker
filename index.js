const inquirer = require('inquirer');
const mysql = require('mysql2/promise');

(async () => {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'Beau123!',
            database: 'employee_db'
        });

        console.log('Connected to the database!');

        await startApp(connection);
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
})();

async function startApp(connection) {
    try {
        const { action } = await inquirer.prompt({
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
        console.log('selected action:', action);

        switch (action) {
            case 'View all departments':
                viewAllDepartments(connection);
                break;
            case 'View all roles':
                viewAllRoles(connection);
                break;
            case 'View all employees':
                viewAllEmployees(connection);
                break;
            case 'Add a department':
                await addDepartment(connection);
                break;
            case 'Add a role':
                await addRole(connection);
                break;
            case 'Add an employee':
                await addEmployee(connection);
                break;
            case 'Update an employee role':
                await updateEmployeeRole(connection);
                break;
            case 'Exit':
                console.log('Goodbye!');
                connection.end();
                return;
        }

    
    } catch (err) {
        console.error(err);
    }
    await startApp(connection);
}

async function viewAllDepartments(connection) {
    
    const [rows, fields] = await connection.execute('SELECT * FROM department');
    console.table(rows);
}

async function viewAllRoles(connection) {

    const [rows, fields] = await connection.execute('SELECT * FROM role');
    console.table(rows);
}

async function viewAllEmployees(connection) {
    const [rows, fields] = await connection.execute('SELECT * FROM employee');
    console.table(rows);
}

async function addDepartment(connection) {

    const { departmentName } = await inquirer.prompt({
        type: 'input',
        name: 'departmentName',
        message: 'What is the name of the department?',
    });
    await connection.execute(`INSERT INTO department (name) VALUES (?)`, [departmentName]);
    console.log('Department added successfully!');
}

async function addRole(connection) {

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

    await connection.execute(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [title, salary, departmentId]);
    console.log('Role added successfully!');
}

async function addEmployee(connection) {
    
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

    await connection.execute('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [
        firstName,
        lastName,
        roleId,
        managerId || null,
      ]);
      console.log('Employee added successfully.');
    }

async function updateEmployeeRole(connection) {
    console.log('update role...');
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

    //checking to see if role id exists
    const [roleExists] = await connection.execute('SELECT id FROM role WHERE id = ?', [newRoleId]);
    if (!roleExists.length) {
        console.log('Role ID does not exist. Please try again.');
        return;
    }

    await connection.execute('UPDATE employee SET role_id = ? WHERE id = ?', [newRoleId, employeeId]);
    console.log('Employee role updated successfully.');
}
