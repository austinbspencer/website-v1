// const fs = require('fs')
const axios = require('axios')
// const pr1_p = document.getElementById("pr1")
const add_button = document.getElementById("add")
const rm_button = document.getElementById("rm")
const language_val = document.getElementById("language")
const project_val = document.getElementById("frontend")
const password_val = document.getElementById("password")
const languages = ["PYTHON", "JAVASCRIPT", "GO", "GOLANG", "C++", "C", "C#", "HTML", "CSS", "PHP", "RUBY", "R", "DJANGO", "JAVA", "PERL", "COBOL", "BASIC", "SQL", "SAS"]
var projNum = 0
var pID = ""
var postData = new Object()
var postRmData = new Object()
let jsonData

const BASE_URL = 'https://guldentech.com'

const getProjects = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/austinapi/projects`);

        const projects = res.data;
        let language = []
        let description = []

        console.log(`GET: Here's the list of projects`, projects);
        
        if (projects === null) {
            initDisplay()
            return
        }

        for (i = 0; i < projects.length; i ++) {
            if (i % 2 === 0) {
                language.push(projects[i])
            } else {
                description.push(projects[i])
            }
        }
        for (i = 0; i < language.length; i++) {
            newRead(language[i], description[i])
        }

        return
    } catch (e) {
        console.error(e);
    }
};

const postProjects = async () => {
    try {
        axios({
          url: `${BASE_URL}/austinapi/projects`,
          method: 'post',
          data: jsonData,
        })
          .then(function (response) {
            // your action after success
            console.log(response)
          })
          .catch(function (error) {
            // your action on error success
            console.log(error)
          })
    } catch (e) {
        console.error(e)
    }
}


const postRmProjects = async () => {
    try {
        axios({
            url: `${BASE_URL}/austinapi/rmprojects`,
            method: 'post',
            data: jsonData,
        })
            .then(function (response) {
                if (response.data === "Error") {
                    alert("Something went wrong!")
                    password_val.value = ''
                } else if (response.data === "Err") {
                    alert("Incorrect password!")
                    password_val.value = ''
                } else {
                    location.reload(true)
                    language_val.value = ''
                    project_val.value = ''
                    password_val.value = ''
                }
            })
            .catch(function (error) {
                alert("Something went wrong, try again if you'd like.")
                password_val.value = ''
                console.log(error)
            })
    } catch (e) {
        console.error(e)
    }
}


function addProject() {
    if (projNum > 14){
        alert("The project list is full!")
        return
    }
    var language = $("#language").val()
    if (!language){
        alert(`Please select a programming language`)
        return
    }
    var project = $("#frontend").val().toLowerCase()
    if (!project){
        alert(`Please give me a description for the project I should write in ${language}`)
        return
    }
    project = toCamelCaseString(project)
    language_val.value = ''
    project_val.value = ''
    var proj = language + " &emsp; || &emsp; " + project
    projNum += 1
    newSetProjects(proj, projNum)
    postData.language = language
    postData.description = project
    jsonData = JSON.stringify(postData)
    console.log(jsonData)
    postProjects()
    // alert("Working on being able to save newly added projects...")
}

function rmProject() {
    if (projNum > 14) {
        alert("The project list is full!")
        return
    }
    var language = $("#language").val()
    if (!language) {
        alert(`Please select a programming language`)
        return
    }
    
    var project = $("#frontend").val()
    if (!project) {
        alert(`Please give me a description for the project I should write in ${language}`)
        return
    }
    project = toCamelCaseString(project)

    var password = $("#password").val()
    
    postRmData.language = language
    postRmData.description = project
    postRmData.password = password
    jsonData = JSON.stringify(postRmData)
    console.log(jsonData)
    postRmProjects()
}

function newRead(language, project) {
    projNum += 1
    fullProject = language + ' &emsp; || &emsp; ' + project
    newSetProjects(fullProject, projNum)
}


// this function call all other functions
function toCamelCaseString(input) {
    let words = toWords(input);
    return toCamelCase(words);
}

// convert string to words
function toWords(input) {
    let regex = input.trim().split('\\s+')
    return regex;
}

function toCamelCase(inputArray) {
    let result = "";
    for (let i = 0, len = inputArray.length; i < len; i++) {
        let currentStr = inputArray[i];
        let tempStr = currentStr.toLowerCase();
        // convert first letter to upper case (the word is in lowercase) 
        tempStr = tempStr.substr(0, 1).toUpperCase() + tempStr.substr(1);
        result += tempStr + " ";
    }
    return result;
}

function initDisplay() {
    fullProject = 'LANGUAGE &emsp; || &emsp; Project Description'
    newSetProjects(fullProject, 1)
}

function newSetProjects(file, num) {
    pID = "pr" + num.toString()
    document.getElementById(pID).innerHTML = file.fontcolor("white")
}

// This is to set up our existing projects on reload of site
function main() {
    getProjects()
    add_button.addEventListener('click', function() {
        addProject()
    })
    rm_button.addEventListener('click', function () {
        rmProject()
    })
}

main()