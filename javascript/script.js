class Task {
    constructor(id, title, description) {
        this.id = id;
        this.title = title;
        this.description = description;
    }

    get getId() {
        return this.id;
    }

    get getTitle() {
        return this.title;
    }

    get getDesciption() {
        return this.description;
    }
}

var addTaskButton = document.querySelector(".add-button");
var backButton = document.querySelector(".back-button");
var saveTaskButton = document.getElementById("save-task");
var clearCompletedTask = document.getElementById("clear-task");

showMainActivity();

addTaskButton.addEventListener("click", showAddTaskActivity);
backButton.addEventListener("click", showMainActivity);
saveTaskButton.addEventListener("click", createNewTask);
clearCompletedTask.addEventListener("click", clearAllCompletedTask);

function showAddTaskActivity() {
    console.log("called");
    var mainActivity = document.querySelector(".main-activity");
    var addTaskActivity = document.querySelector(".add-task-activity");
    if (mainActivity.style.display != "none") {
        mainActivity.style.display = "none";
    }
    if (addTaskActivity.style.display != "block") {
        addTaskActivity.style.display = "block";
    }

    if (backButton.style.display != "inline-block") {
        backButton.style.display = "inline-block";
    }
}

function showMainActivity() {
    getAllTask();
    getAllCompletedTask();
    var mainActivity = document.querySelector(".main-activity");
    var addTaskActivity = document.querySelector(".add-task-activity");
    if (addTaskActivity.style.display != "none") {
        addTaskActivity.style.display = "none";
    }
    if (mainActivity.style.display != "block") {
        mainActivity.style.display = "block";
    }
    if (backButton.style.display != "none") {
        backButton.style.display = "none";
    }
    calculateHeight();
}

function createNewTask() {
    var inputTitle = document.getElementById("title-input");
    var inputDescription = document.getElementById("desc-input");
    if (inputTitle.value == "") return;

    console.log(inputTitle.value, " + ", inputDescription.innerHTML);

    if (localStorage.getItem("taskArray") == null) {
        var taskArray = [];
        taskArray[0] = new Task(0, inputTitle.value, inputDescription.innerHTML);
        localStorage.setItem("taskArray", JSON.stringify(taskArray));
    } else {
        var taskArray = JSON.parse(localStorage.getItem("taskArray"));
        taskArray.push(new Task(taskArray.length, inputTitle.value, inputDescription.innerHTML));
        localStorage.setItem("taskArray", JSON.stringify(taskArray));
    }
    var taskArray = JSON.parse(localStorage.getItem("taskArray"));
    for (let i = 0; i < taskArray.length; ++i) {
        var task = taskArray[i];
        console.log("Id: ", task.id, " Title: ", task.title);
    }

    console.log(localStorage.getItem("taskArray").toString());
    showMainActivity();
}

function getAllTask() {
    var taskArray = JSON.parse(localStorage.getItem("taskArray"));
    if (taskArray == null) return;
    var taskContainer = document.querySelector(".all-task");
    taskContainer.innerHTML = "";
    for (let i = taskArray.length - 1; i >= 0; --i) {
        // if (i > 4) break;
        var task = taskArray[i];
        var item = "<div class=\"task-item\">" +
                        "<input style=\"display: none;\" type=\"text\" value=\"" + task.id + "\" id=\"taskId" + task.id + "\">" +
                        "<input id=\"checkbox-" + task.id + "\" type=\"checkbox\">" +
                        "<label for=\"checkbox-" + task.id + "\">" +
                            "<i class=\"check-icon fa-xs fa-solid fa-check\"></i>" +
                        "</label>" +
                        "<p class=\"task-short-description\">" + task.title + "</p>" + 
                        "<i class=\"fa-solid fa-angle-down task-more-infor\"></i>" +
                    "</div>";
        taskContainer.innerHTML += item;
    }

    var taskItems = document.querySelectorAll(".all-task .task-item");
    for (let i = 0; i < taskItems.length; ++i) {
        var taskItemInput = taskItems[i].querySelector("input[type=\"checkbox\"");
        taskItemInput.addEventListener('change', (event) => {
            if (event.currentTarget.checked) {
                var taskId = taskItems[i].querySelectorAll("input")[0].value;
                createCompletedTask(taskId);
                deleteTask(taskId);
                taskItems[i].style.animation = 'animation-out 0.3s ease';
                taskItems[i].addEventListener("animationend", () => {
                    taskItems[i].parentNode.removeChild(taskItems[i]);
                    getAllCompletedTask();
                });
            }
        });
    }
}

function createCompletedTask(taskId) {
    var taskArray = JSON.parse(localStorage.getItem("taskArray"));
    var taskTitle, taskDescription;
    for (let i = 0; i < taskArray.length; ++i) {
        if (taskArray[i].id == taskId) {
            taskTitle = taskArray[i].title;
            taskDescription = taskArray[i].description;
            break;
        }   
    }

    if (localStorage.getItem("taskCompletedArray") == null) {
        var taskCompletedArray = [];
        taskCompletedArray.push(new Task(taskId, taskTitle, taskDescription));
        localStorage.setItem("taskCompletedArray", JSON.stringify(taskCompletedArray));
    } else {
        var taskCompletedArray = JSON.parse(localStorage.getItem("taskCompletedArray"));
        taskCompletedArray.push(new Task(taskId, taskTitle, taskDescription));
        localStorage.setItem("taskCompletedArray", JSON.stringify(taskCompletedArray));
    }
    var taskCompletedArray = JSON.parse(localStorage.getItem("taskArray"));
    for (let i = 0; i < taskCompletedArray.length; ++i) {
        var task = taskCompletedArray[i];
        console.log("Id: ", task.id, " Title: ", task.title);
    }
}

function getAllCompletedTask() {
    var taskArray = JSON.parse(localStorage.getItem("taskCompletedArray"));
    var taskContainer = document.querySelector(".all-completed-task");
    taskContainer.innerHTML = "";
    if (taskArray == null) return;
    for (let i = taskArray.length - 1; i >= 0 ; --i) {
        var task = taskArray[i];
        var item = "<div class=\"task-item\">" +
                        "<input style=\"display: none;\" type=\"text\" value=\"" + task.id + "\" id=\"taskId" + task.id + "\">" +
                        "<input checked id=\"checkbox1-" + task.id + "\" type=\"checkbox\">" +
                        "<label for=\"checkbox1-" + task.id + "\">" +
                            "<i class=\"check-icon fa-xs fa-solid fa-check\"></i>" +
                        "</label>" +
                        "<p class=\"task-short-description\">" + task.title + "</p>" + 
                        "<i class=\"fa-solid fa-angle-down task-more-infor\"></i>" +
                    "</div>";
        taskContainer.innerHTML += item;
    }
}

function clearAllCompletedTask() {
    localStorage.removeItem("taskCompletedArray");
    getAllCompletedTask();
}

function deleteTask(taskId) {
    var taskArray = JSON.parse(localStorage.getItem("taskArray"));
    var taskDelete;
    for (let i = 0; i < taskArray.length; ++i) {
        if (taskArray[i].id == taskId) {
            var temp = taskArray[0];
            taskArray[0] = taskArray[i];
            taskArray[i] = temp;
            taskArray.shift();
            break;
        }
    }
    localStorage.setItem("taskArray", JSON.stringify(taskArray));
}

function calculateHeight() {
    var divAllTask = document.querySelector(".all-task");
    var divAllCompletedTask = document.querySelector(".all-completed-task");
    var maxHeight = 360 - divAllTask.getBoundingClientRect().height;
    var maxHeightStr = maxHeight + "px";
    console.log(maxHeight);
    console.log(divAllTask.getBoundingClientRect());
    console.log(divAllCompletedTask.style.maxHeight);
    divAllCompletedTask.style.maxHeight = maxHeightStr;
    console.log(divAllCompletedTask.style.maxHeight);
}