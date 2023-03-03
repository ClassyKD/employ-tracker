// Import and require mysql2
const connection = require('./db/connection.js')
const { prompt } = require('inquirer')
require("console.table")
const mysql = require('mysql2');
const queries = require("./Queries.js")


// appendFile.use(express.urlencoded({ extended: false }));
// appendFile.use(express.json());

function init() {
  loadInitialQuestions()
}

function loadInitialQuestions() {
  prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        {
          name: "View all Departments",
          value: "VIEW_DEPARTMENTS"
        },
        {
          name: "Add a Department",
          value: "ADD_DEPARTMENT"
        },
        {
          name: "Update Employee Role",
          value: "UPDATE_EMPLOYEE_ROLE"
        },
        {
          name: "View all roles",
          value: "VIEW_ROLES"
        },
        {
          name: "add a role",
          value: "ADD_ROLE"
        },
        {
          name: "view all employees",
          value: "VIEW_EMPLOYEES"
        },
        {
          name: "add a employee",
          value: "ADD_EMPLOYEE"
        },
      ]
    }
  ])
  .then(choice => {
    let answer = choice.action

    switch(answer) {
      case "VIEW_DEPARTMENTS": 
        viewDepartments();
        break;
      case "ADD_DEPARTMENT": 
        addDepartment();
        break;
      case "UPDATE_EMPLOYEE_ROLE": 
        updateEmployeeRole();
        break;
      case "VIEW_ROLES": 
        viewRoles();
        break;
      case "VIEW_EMPLOYEES": 
        viewEmployees();
        break;
      case "ADD_ROLE": 
        addRole();
        break;
      case "ADD_EMPLOYEE": 
        addEmployee();
        break;
    }
  })
}

//Pulls department data and logs it
function viewDepartments() {
  queries.viewDepartments()
      .then(([rows,fields]) => {
        console.table(rows)
      })
      .then(() => {
        loadInitialQuestions();
      })
}

//Pull role data and logs it
function viewRoles() {
  queries.viewRoles()
      .then(([rows,fields]) => {
        console.table(rows)
      })
      .then(() => {
        loadInitialQuestions();
      })
}

//Pulls employee data and logs it
function viewEmployees() {
  queries.
    viewEmployees()
      .then(([rows,fields]) => {
        console.table(rows)
      })
      .then(() => {
        loadInitialQuestions();
      })
}

//Adds 
function addDepartment() {
  prompt({
    type: "input",
    message: "What is the name of the department?",
    name: "deptName"
  })
  .then(function(answer){
    connection.query("INSERT INTO department (name) VALUES (?)", [answer.deptName] , 
    function(err, res) {
        if (err) throw err;
        console.table(res)
        loadInitialQuestions()
    })
  })
}

function addRole() {
    prompt([
      {
        type: "input",
        message: "What's the name of the role?",
        name: 'roleName'
      },
      {
        type: "input",
        message: "What is the salary for this role?",
        name: 'salaryTotal'
      },
      {
        type: "input",
        message: "What is the department id number?",
        name: 'deptID'
      }
    ])
    .then(function(answer) {
      connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.roleName, answer.salaryTotal, answer.deptID], 
        function(err, res) {
          if (err) throw err;
          console.table(res);
          loadInitialQuestions();
      });
    });
}

function addEmployee() {
  prompt([
      {
        type: "input",
        message: "What's the first name of the employee?",
        name: "eeFirstName"
      },
      {
        type: "input",
        message: "What's the last name of the employee?",
        name: "eeLastName"
      },
      {
        type: "input",
        message: "What is the employee's role id number?",
        name: "roleID"
      },
      {
        type: "input",
        message: "What is the manager id number?",
        name: "managerID"
      }
    ])
    .then(function(answer) {
      connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [answer.eeFirstName, answer.eeLastName, answer.roleID, answer.managerID], 
      function(err, res) {
        if (err) throw err;
        console.table(res);
        loadInitialQuestions();
      });
    });
}

function updateEmployeeRole(employeeId, roleId) {
  queries.viewEmployees()
  .then(([employees]) => {
    const employeeArray = employees.map(({id, first_name, last_name}) =>{
      return ({
        name: `${first_name} ${last_name}`,
        value: id
      })
    })
    prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which employees role would you like to update",
        choices: employeeArray
      },
    ])
    .then(({ employeeId }) => {
      queries.viewRoles()
      .then(([roles]) => {
        const roleArray = roles.map(({id, title}) =>{
          return ({
            name: title,
            value: id
          })
      })
      prompt([{
        type: "list",
        name: "roleId",
        message: "WHich role would you like to update the employee to?",
        choices: roleArray,
      }])
      .then(({ roleid }) => {
        queries
        .updateEmployeeRole(employeeId, roleId)
        .then(() => console.log("Updated Employees Role"))
        .then(() => loadInitialQuestions())
      })
    })
  })
})
}


init()
