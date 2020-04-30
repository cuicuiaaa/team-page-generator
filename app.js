const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

writeFileAsync = util.promisify(fs.writeFile);

let employees = [];


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)



const questions = () => {
    return inquirer.prompt([
        {
            type: "input",
            message: "What is your manager's name?",
            name: "name"
        },
        {
            type: "input",
            message: "What is your manager's id?",
            name: "id"
        },
        {
            type: "input",
            message: "What is your manager's email",
            name: "email",
            validate: function (email) {
  
                valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    
                if (valid) {
                  
                    return true;
                } else {
                    console.log(".  Please enter a valid email")
                    return false;
                }
            }
        },
        {
            type: "input",
            message: "What is your manager's office number?",
            name: "office-number"
        }
    ])
}

const engineerQuestions = (id) => {
    return inquirer.prompt([
        {
            type: "input",
            message: "What is your engineer's name?",
            name: "name",
        },
        {
            type: "input",
            message: "What is your engineer's id?",
            name: "id",
            validate: function(value) {
                let pass = true;
                
                for (i = 0; i < id.length; i++) {
                    if (value == id[i]) {
                        pass = false;
                    }
                }

                if (pass) {
                    return true;
                } else {
                    return "This ID is already taken. Please enter a different number."
                }
                
            }
        },
        {
            type: "input",
            message: "What is your engineer's email?",
            name: "email",
            validate: function (email) {
  
                valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    
                if (valid) {
                  
                    return true;
                } else {
                    console.log(".  Please enter a valid email")
                    return false;
                }
            }
        },
        {
            type: "input",
            message: "What is your engineer's GitHub username?",
            name: "github"
        },
        
    ])
}

const internQuestions = (id) => {
    return inquirer.prompt([
        {
            type: "input",
            message: "What is your intern's name?",
            name: "name"
        },
        {
            type: "input",
            message: "What is your intern's id?",
            name: "id",
            validate: function(value) {
                let pass = true;
                
                for (i = 0; i < id.length; i++) {
                    if (value == id[i]) {
                        pass = false;
                    }
                }

                if (pass) {
                    return true;
                } else {
                    return "This ID is already taken. Please enter a different number."
                }
                
            }
        },
        {
            type: "input",
            message: "What is your intern's email?",
            name: "email",
            validate: function (email) {
  
                valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    
                if (valid) {
                  
                    return true;
                } else {
                    console.log(".  Please enter a valid email")
                    return false;
                }
            }
        },
        {
            type: "input",
            message: "What is your intern's school?",
            name: "school"
        }
    ])
}

const add = () => {
    return inquirer.prompt({
        type: "list",
        message: "Which type of team member would you like to add?",
        name: "add",
        choices: [
            "Engineer",
            "Intern",
            "I don't want to add any more team members."
        ]
    })
}

async function init() {
    try {
        let id = [];
        
        
        const answers = await questions();
        
        let addAnswers = await add();

        id.push(answers.id);
        
        let addMore = true;
        let engineerAnswers = [];
        let internAnswers = [];

        while (addMore) {
            if (addAnswers.add === "Engineer") {
                
                const newEngineerAnswers = await engineerQuestions(id);
                engineerAnswers.push(newEngineerAnswers);
                id.push(newEngineerAnswers.id);
                addAnswers = await add();
                
            } else if (addAnswers.add === "Intern") {

                const newInternAnswers = await internQuestions(id);
                internAnswers.push(newInternAnswers);
                id.push(newInternAnswers.id);
                addAnswers = await add();
            } else {
                addMore = false;
            }

            
            
        };

        



        const manager = new Manager(answers.name, answers.id, answers.email, answers["office-number"]);

        let engineerArray = [];
        let internArray = [];

        for (i = 0; i < engineerAnswers.length; i++) {
            const engineer = new Engineer(engineerAnswers[i].name, engineerAnswers[i].id, engineerAnswers[i].email, engineerAnswers[i].github);
            engineerArray.push(engineer);
        };
        
        for (i = 0; i < internAnswers.length; i++) {
            const intern = new Intern(internAnswers[i].name, internAnswers[i].id, internAnswers[i].email, internAnswers[i].school);
            internArray.push(intern);
        };

        
        employees = engineerArray.concat(internArray);

        employees.push(manager);

        console.log(employees);

        const html = await render(employees);

        await writeFileAsync(outputPath, html);

        console.log("File written successfully!");




        
    } catch(err) {
        console.log(err);
    }
};

init();

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
