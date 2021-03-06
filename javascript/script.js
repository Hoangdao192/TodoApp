class Task {
    constructor(id, title, description, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
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

    get getStatus() {
        return this.status;
    }
}

var addTaskButton = document.querySelector(".add-button");
var backButton = document.querySelector(".back-button");
var saveTaskButton = document.getElementById("save-task");
var clearCompletedTask = document.getElementById("clear-task");

showMainActivity();

/*Main activity*/
addTaskButton.addEventListener("click", showAddTaskActivity);

/*Side bar*/
console.log(window.innerWidth)
var sidebar = document.querySelector(".sidebar");
var openSidebarButton = document.querySelector(".topbar__title__opensidebar");
openSidebarButton.addEventListener('click', function(){
    sidebar.style.animation = "sidebarIn 0.3s ease";
    sidebar.style.display = "block";
    sidebar.addEventListener('animationend', function(){
        sidebar.style.display = "block";
    })
})
var closeSidebarButton = document.querySelector(".sidebar__close");
closeSidebarButton.addEventListener('click', function(){
    sidebar.style.animation = "sidebarOut 0.3s ease";
    sidebar.addEventListener('animationend', function(){
        sidebar.style.display = "none";
    })
})

/*Add task activity*/
backButton.addEventListener("click", showMainActivity);
var titleInput = document.getElementById("title-input");
var titleDesc = document.getElementById("desc-input");
saveTaskButton.addEventListener("click", function() {
    createNewTask(titleInput.value, titleDesc.innerHTML);
    titleInput.value = "";
    titleDesc.innerHTML = "";
});
clearCompletedTask.addEventListener("click", clearAllCompletedTask);

function showAddTaskActivity() {
    console.log("called");
    var mainActivity = document.querySelector(".main-activity");
    var addTaskActivity = document.querySelector(".add-task-activity");
    var editTaskAcitvity = document.querySelector(".edit-task-activity");
    if (editTaskAcitvity.style.display != "none") {
        editTaskAcitvity.style.display = "none";
    }
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
    var mainActivity = document.querySelector(".main-activity");
    var addTaskActivity = document.querySelector(".add-task-activity");
    var editTaskAcitvity = document.querySelector(".edit-task-activity");
    if (editTaskAcitvity.style.display != "none") {
        editTaskAcitvity.style.display = "none";
    }
    if (addTaskActivity.style.display != "none") {
        addTaskActivity.style.display = "none";
    }

    if (mainActivity.style.display != "block") {
        mainActivity.style.display = "block";
    }
    if (backButton.style.display != "none") {
        backButton.style.display = "none";
    }
}

function showEditTaskActivity(taskId) {
    console.log("called");
    var mainActivity = document.querySelector(".main-activity");
    var addTaskActivity = document.querySelector(".add-task-activity");
    var editTaskAcitvity = document.querySelector(".edit-task-activity");
    var titleInput = document.getElementById("edit-title");
    var titleDesc = document.getElementById("edit-desc");  

    if (addTaskActivity.style.display != "none") {
        addTaskActivity.style.display = "none";
    }
    if (mainActivity.style.display != "none") {
        mainActivity.style.display = "none";
    }

    if (editTaskAcitvity.style.display != "block") {
        editTaskAcitvity.style.display = "block";
    }

    if (backButton.style.display != "inline-block") {
        backButton.style.display = "inline-block";
    }
    
    var taskArray = JSON.parse(localStorage.getItem("taskArray"));
    var taskTitle = "";
    var taskDesc = "";
    for (let i = 0; i < taskArray.length; ++i) {
        var task = taskArray[i];
        if (task.id == taskId) {
            taskTitle = task.title;
            taskDesc = task.description;
            break;
        }
    }
    titleInput.value = taskTitle;
    titleDesc.innerHTML = taskDesc;

    var saveEdit = document.querySelector("#save-edit");
    saveEdit.addEventListener('click', function() {
        for (let i = 0; i < taskArray.length; ++i) {
            var task = taskArray[i];
            if (task.id == taskId) {
                task.title = titleInput.value;
                task.description = titleDesc.innerHTML;
                break;
            }
        }
        localStorage.setItem("taskArray", JSON.stringify(taskArray));
        showMainActivity();
    })
}

function createNewTask(title, description, status = "not completed") {
    if (title == "") return;

    console.log(title, " + ", description);

    if (localStorage.getItem("taskArray") == null) {
        var taskArray = [];
        taskArray[0] = new Task(0, title, description, status);
        localStorage.setItem("taskArray", JSON.stringify(taskArray));
        localStorage.setItem("lastId", 1);
    } else {
        var taskArray = JSON.parse(localStorage.getItem("taskArray"));
        taskArray.push(new Task(parseInt(localStorage.getItem('lastId')) + 1, title, description, status));
        localStorage.setItem("taskArray", JSON.stringify(taskArray));
        localStorage.setItem('lastId', parseInt(localStorage.getItem('lastId')) + 1);
    }
    showMainActivity();
}

function taskToCompleted(taskId) {
    var taskArray = JSON.parse(localStorage.getItem("taskArray"));
    for (let i = 0; i < taskArray.length; ++i) {
        if (taskArray[i].id == taskId) {
            taskArray[i].status = "completed";
            break;
        }
    }
    localStorage.setItem("taskArray", JSON.stringify(taskArray));
}

function taskToNotCompleted(taskId) {
    var taskArray = JSON.parse(localStorage.getItem("taskArray"));
    for (let i = 0; i < taskArray.length; ++i) {
        if (taskArray[i].id == taskId) {
            taskArray[i].status = "not completed";
            break;
        }
    }
    localStorage.setItem("taskArray", JSON.stringify(taskArray));
}

function getAllTask() {
    var taskArray = JSON.parse(localStorage.getItem("taskArray"));
    if (taskArray == null) return;

    var taskNotCompletedContainer = document.querySelector(".all-task");
    var taskCompletedContainer = document.querySelector(".all-completed-task");

    taskNotCompletedContainer.innerHTML = "";
    taskCompletedContainer.innerHTML = "";

    for (let i = taskArray.length - 1; i >= 0; --i) {
        var task = taskArray[i];
        //  Create not completed task
        if (task.status == "not completed") {
            var item = `
                <div taskId="${task.id}" taskTitle="${task.title}" taskDesc="${task.description}" class="task-item">
                    <input style="display: none;" type="text" value=${task.id} id="taskId${task.id}">
                    <input id="checkbox-${task.id}" type="checkbox">
                    <label for="checkbox-${task.id}">
                        <i class="check-icon fa-xs fa-solid fa-check"></i>
                    </label>
                    <p class="task-short-description">${task.title}</p>
                    <div class="more">
                        <p class="task-description">${task.description}</p>
                        <div class="tool">
                            <p class="tool-item tool-item-edit">Edit</p>
                            <p class="tool-item tool-item-delete">Delete</p>
                        </div>
                    </div>
                </div>`;

            taskNotCompletedContainer.innerHTML += item;
        } 
        //  Create completed task
        else {
            var item = `
                <div taskId="${task.id}" taskTitle="${task.title}" taskDesc="${task.description}" class="task-item">
                    <input style="display: none;" type="text" value=${task.id} id="taskId${task.id}">
                    <input checked id="checkbox-${task.id}" type="checkbox">
                    <label for="checkbox-${task.id}">
                        <i class="check-icon fa-xs fa-solid fa-check"></i>
                    </label>
                    <p class="task-short-description">${task.title}</p>
                    <p class="task-description">${task.description}</p>
                </div>`;

            taskCompletedContainer.innerHTML += item;
        }
    }

    var tasksNotCompleted = document.querySelectorAll(".all-task .task-item");
    //  Th??m hi???u ???ng v?? x??? l?? khi check ho??n th??nh task
    for (let i = 0; i < tasksNotCompleted.length; ++i) {
        tasksNotCompleted[i].addEventListener('click', function() {
                var taskMore = tasksNotCompleted[i].querySelector(".more");
                if (taskMore.style.display == "none") {
                    taskMore.style.display = "block";
                } else {
                    taskMore.style.display = "none";
                }
                var deleteButton = taskMore.querySelector(".tool-item-delete");
                deleteButton.addEventListener('click', function() {
                    var taskId = tasksNotCompleted[i].querySelectorAll("input")[0].value;
                    deleteTask(taskId);
                    getAllTask();
                });
                var editButton = taskMore.querySelector(".tool-item-edit");
                editButton.addEventListener('click', function() {
                    var taskId = tasksNotCompleted[i].querySelectorAll("input")[0].value;
                    showEditTaskActivity(taskId);
                });
        });
        
        var taskItemInput = tasksNotCompleted[i].querySelector("input[type=\"checkbox\"");
        taskItemInput.addEventListener('change', (event) => {
            console.log("checkd");
            if (event.currentTarget.checked) {
                var taskId = tasksNotCompleted[i].querySelectorAll("input")[0].value;
                taskToCompleted(taskId);
                tasksNotCompleted[i].style.animation = 'animation-out 0.3s ease';
                tasksNotCompleted[i].addEventListener("animationend", () => {
                    tasksNotCompleted[i].parentNode.removeChild(tasksNotCompleted[i]);
                    getAllTask();
                    calculateHeight();
                });
            }
        });
    }

    //  Th??m hi???u ???ng v?? x??? l?? khi b??? ho??n th??nh task
    var tasksCompleted = document.querySelectorAll(".all-completed-task .task-item");
    for (let i = 0; i < tasksCompleted.length; ++i) {
        var taskDescription = tasksCompleted[i].querySelector(".task-description").style.display = "none";
        tasksCompleted[i].addEventListener('click', function() {
            var taskDescription = tasksCompleted[i].querySelector(".task-description");
            if (taskDescription.style.display == "none") {
                taskDescription.style.display = "inline-block";
            } else {
                taskDescription.style.display = "none";
            }
        });

        var taskItemInput = tasksCompleted[i].querySelector("input[type=\"checkbox\"");
        taskItemInput.addEventListener('change', (event) => {
            if (!event.currentTarget.checked) {
                var taskId = tasksCompleted[i].querySelectorAll("input")[0].value;
                taskToNotCompleted(taskId);
                tasksCompleted[i].style.animation = 'animation-out 0.3s ease';
                tasksCompleted[i].addEventListener("animationend", () => {
                    tasksCompleted[i].parentNode.removeChild(tasksCompleted[i]);
                    getAllTask();
                    calculateHeight();
                });
            }
        });
    }

    calculateHeight();
}

function clearAllCompletedTask() {
    var taskArray = JSON.parse(localStorage.getItem("taskArray"));
    var newTaskArray = [];
    for (let i = 0; i < taskArray.length; ++i) {
        if (taskArray[i].status == "not completed") {
            taskArray[i].id = newTaskArray.length;
            newTaskArray.push(taskArray[i]);
        }
    }
    localStorage.setItem("taskArray", JSON.stringify(newTaskArray));
    getAllTask();
}

function deleteTask(taskId) {
    var taskArray = JSON.parse(localStorage.getItem("taskArray"));
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
    var taskArray = JSON.parse(localStorage.getItem("taskArray"));
        for (let i = 0; i < taskArray.length; ++i) {
            var task = taskArray[i];
            console.log("Id: ", task.id, " Title: ", task.title);
        }
    
        console.log(localStorage.getItem("taskArray").toString());
}

function calculateHeight() {
    
    if (window.innerWidth >= 800) {
        var divAllTask = document.querySelector(".all-task");
        var divAllCompletedTask = document.querySelector(".all-completed-task");
        var content = document.querySelector(".container");
        divAllCompletedTask.style.maxHeight = ((content.getBoundingClientRect().height - 190) + "px");
        divAllTask.style.maxHeight = ((content.getBoundingClientRect().height - 190) + "px");
        console.log("big");
        console.log(divAllCompletedTask.style.maxHeight);
        return;
    }

    console.log("small");
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