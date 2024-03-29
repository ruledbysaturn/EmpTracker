INSERT INTO department (name)
VALUES  ("Sales"),
        ("Engineering"),
        ("Finance"),
        ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES  ("Sales Lead", 100000, 1),
        ("Salesperson", 80000, 1),
        ("Lead Engineer", 150000, 2),
        ("Software Engineer", 120000, 2),
        ("Account Manager", 160000, 3),
        ("Accountant", 125000, 3),
        ("Legal Team Lead", 250000, 4),
        ("Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("John", "Doe", 1, NULL),
        ("Jane", "Doe", 2, 1),
        ("Ribbit", "Sprig", 3, NULL),
        ("Amanda", "Tori Meating", 4, 3),
        ("Trixie", "Mattel", 5, NULL),
        ("Katya", "Zamolodchikova", 6, 5),
        ("Biance", "Del Rio", 7, NULL),
        ("Courtney", "Act", 8, 7);

