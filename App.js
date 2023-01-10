
// regular expression for validation
const strRegex =  /^[a-zA-Z\s]*$/; // containing only letters
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
/* supports following number formats - (123) 456-7890, (123)456-7890, 123-456-7890, 123.456.7890, 1234567890, +31636363634, 075-63546725 */
const digitRegex = /^\d+$/;

// -------------------------------------------------- //

// const countryList = document.getElementById('country-list');
const fullscreenSection = document.getElementById('fullscreen-section');
const viewUpper = document.getElementById('view-upper');
const addBtn = document.getElementById('add-btn');
const closeBtn = document.getElementById('close-btn');
const viewBtns = document.getElementById('view-btns');
const form = document.getElementById('view-upper');
const alltask = document.querySelector('#all-task');
// const taskBookList =document.querySelector("#all-task")

// -------------------------------------------------- //

let  taskName = taskDescription = labels = null;
// let taskId = new Date().getTime();
// localStorage.clear();// temporary for checking
// Task class
// localStorage.clear();
class Task{
    
    constructor(taskId, taskName, taskDescription,labels){
        this.taskId = taskId;
        this.taskName = taskName;
        this.taskDescription = taskDescription;
        this.labels = labels;
    }
    

    static getTasks(){
        let tasks;
        if(localStorage.getItem('tasks') == null || localStorage.getItem('tasks') == ""){
            tasks = [];
        } else {
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }
        return tasks;
    }

    static addTask(task){
        console.log(task)
        const tasks = Task.getTasks();
        console.log(tasks);
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    static deleteTask(taskId){
        const tasks = Task.getTasks();
        tasks.forEach((task, index) => {
            if(task.taskId == taskId){
                tasks.splice(index, 1);
                
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        form.reset();
        UI.closeviewUpper();
        //taskBookList.innerHTML = "";    //to be change taskbooklist
        UI.showTaskList();
    }

    static updateTask(item){
        const tasks = Task.getTasks();
        tasks.forEach(task => {
            if(task.taskId == item.taskId){
                task.taskName = item.taskName;
                task.taskDescription = item.taskDescription;
                task.labels = item.labels;
                
                task.taskId = new Date().getTime()
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        // alltask.innerHTML = "";
        // UI.showTaskList();
    }
}

// UI class
class UI{
    static showTaskList(){
        const tasks = Task.getTasks();
        tasks.forEach(task => UI.addToTaskList(task));
        const notes = document.querySelectorAll('.note');
        const fourconts = document.querySelectorAll('.four-section');  //containers
         let selcon = "open";    //selectcontainer in four section
        notes.forEach(ele => {
            let eventofstart ="";
            ele.addEventListener('dragstart' , (eventofsta)=>{
                ele.classList.add("drag")
                eventofstart =eventofsta
                console.log(eventofsta.target)
            })
            ele.addEventListener('dragend' , (event)=>{
                // location.reload();
                ele.classList.remove("drag");
                // If(event.target.id == e.NewLabels) {
                //     NewLabels="open";
                // } else if (event.target.id == progress) {
                //     NewLabels = "progress"
                // } else if (event.target.id== review) {
                //     NewLabels ="review"
                // } else {
                //     NewLabels ="done";
                // }
                console.log(event);
                let newTaskName , newTaskDescription;
                tasks.forEach(e => {
                    console.log(e.taskId);
                    if(e.taskId == ele.taskId){
                        newTaskName = e.taskName;
                        newTaskDescription = e.taskDescription;
                        const taskItem = new Task(ele.taskId, newTaskName, newTaskDescription , selcon);
                        Task.updateTask(taskItem);
                        // Task.deleteTask();
                        location.reload();
                    }
                })
                
                // const taskItem = new Task(ele.taskId, newTaskName, newTaskDescription , selcon);
                
                // Task.updateTask(taskItem);
                //  Task.deleteTask(event.target.data-id);
                
            })
            fourconts.forEach(ele => {
                ele.addEventListener('dragover' , () => {
                    const tarCon = document.querySelector('.drag');
                    ele.appendChild(tarCon);
                    selcon = ele.className;
                })
        })
    })
    }

    static addToTaskList(task){
        // console.log(task)
        // let data=localStorage.getItem("tasks");
        // console.log(data);
        const tableRow = document.createElement('section');
        tableRow.setAttribute('data-id', task.taskId);
        tableRow.innerHTML = `<section >
        <section class="note" id="note" data-id=${task.taskId} draggable="true" > 
        <p><span class = "task-name">${task.taskName}</span></p>
       </section>
       </section>
        `;
        if(task.labels === "open"){
            document.getElementById("open-box").appendChild(tableRow);
        }else if(task.labels === "progress"){
            document.querySelector('.progress-box').appendChild(tableRow);
        }else if(task.labels === "review"){
            document.querySelector('.review-box').appendChild(tableRow);
        }else{
            document.querySelector('.done-box').appendChild(tableRow);
        }
        //here im changing # to . all four
      

    }

    static showViewUpperData(taskId){
        const tasks = Task.getTasks();
        tasks.forEach(task => {
            // console.log(task)
            if(task.taskId == taskId){
                form.task_name.value = task.taskName;       //title view upper
                form.task_description.value = task.taskDescription;
                form.labels.value = task.labels;
                document.getElementById('view-title').innerHTML = "Change Task Details";

                document.getElementById('view-btns').innerHTML = `
                    <button type = "submit" id = "update-btn" data-id = "${taskId}">Update </button>
                    <button type = "button" id = "delete-btn" data-id = "${taskId}">Delete </button>
                `;
            }
        });
    }

    static showViewUpper(){
        viewUpper.style.display = "block";
        fullscreenSection.style.display = "block";
    }

    static closeviewUpper(){
        viewUpper.style.display = "none";
        fullscreenSection.style.display = "none";
    }



}

// DOM Content Loaded
window.addEventListener('DOMContentLoaded', () => {
    eventListeners();
    UI.showTaskList();
});

// event listeners
function eventListeners(){
    // show add item viewUpper
    addBtn.addEventListener('click', () => {
        form.reset();
        document.getElementById("view-btns").innerHTML =
        `<button type="submit" id="submit-btn">Submit</button>`
        ;
        document.getElementById("view-title").innerText ="Add Task";
        
        UI.showViewUpper();
    });

    // close add item viewUpper
    closeBtn.addEventListener('click', UI.closeviewUpper);

    // add a description item
    viewBtns.addEventListener('click', (event) => {
        event.preventDefault();
        // console.log(event.target)
        if(event.target.id == "submit-btn"){
            let isFormValid = getFormData();
            if(!isFormValid){
                form.querySelectorAll('input').forEach(input => {
                    setTimeout(() => {
                        input.classList.remove('errorMsg');
                    }, 1500);
                });
            } else {
                let allItem = Task.getTasks();
                let lastTaskId = (allItem.length > 0) ? allItem[allItem.length - 1].id : 0;
                lastTaskId++;

                const taskItem = new Task(lastTaskId, taskName, taskDescription,labels);
                Task.addTask(taskItem);
                UI.closeviewUpper();
                UI.addToTaskList(taskItem);
                form.reset();
            }
        }
    });

    // table row items
    alltask.addEventListener('click', (event) => {
        UI.showViewUpper();
        let trElement;
        if(event.target.parentElement.tagName == "P"){
            trElement = event.target.parentElement.parentElement;
        }

        if(event.target.parentElement.tagName == "SECTION"){
            trElement = event.target.parentElement;
        }
        let viewID = trElement.taskId;
        UI.showViewUpperData(viewID);
    });

    // delete an task item
    viewBtns.addEventListener('click', (event) => {
        if(event.target.id == 'delete-btn'){
            Task.deleteTask(event.target.data-id);
        }
    });

    // update an task item
    viewBtns.addEventListener('click', (event) => {
        event.preventDefault();
        // location.reload();
        if(event.target.id === "update-btn"){
            console.log(event)
            let taskName=form.task_name.value
            let taskDescription = form.task_description.value ;
            let lables =    form.labels.value ;
            let taskId = new Date().getTime();
            let isFormValid = getFormData();
            if(!isFormValid){
                form.querySelectorAll('input').forEach(input => {
                    setTimeout(() => {
                        input.classList.remove('errorMsg');
                    }, 1500);
                });
            } else {
                const taskItem = new Task(taskId, taskName, taskDescription, labels);
                Task.updateTask(taskItem);
                // Task.deleteTask(taskId);
                UI.closeviewUpper();
                form.reset();
            }
        }
        if(event.target.id == 'delete-btn'){
            console.log(event.target.dataset.taskId);
            Task.deleteTask(event.target.dataset.taskId);
        }
        document.getElementById("view-btns").innerHTML =
        `<button type="submit" id="submit-btn">Submit</button>`
        ;
        document.getElementById("view-title").innerText ="Add Task";
        location.reload();
    });
}





// get form data
function getFormData(){

        if( form.task_name.value.trim().length == 0){ 
        addErrMsg(form.task_name);
        return  false;
    } else {
        taskName = form.task_name.value;
        taskDescription =form.task_description.value;
        labels =form.labels.value;
    }
    return true;
}


function addErrMsg(inputBox){
    alert(`Plz Enter ${inputBox}`);
}
