
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
// localStorage.clear();// temporary for checking
// Task class
class Task{
    
    constructor(id, taskName, taskDescription,labels){
        this.id = id;
        this.taskName = taskName;
        this.taskDescription = taskDescription;
        this.labels = labels;
    }

    static getTasks(){
        let tasks;
        if(localStorage.getItem('tasks') == null){
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

    static deleteTask(id){
        const tasks = Task.getTasks();
        tasks.forEach((task, index) => {
            if(task.id == id){
                tasks.splice(index, 1);
                
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        form.reset();
        UI.closeviewUpper();
        taskBookList.innerHTML = "";    //to be change taskbooklist
        UI.showTaskList();
    }

    static updateTask(item){
        const tasks = Task.getTasks();
        tasks.forEach(task => {
            if(task.id == item.id){
                task.taskName = item.taskName;
                task.taskDescription = item.taskDescription;
                task.labels = item.labels;
                
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        alltask.innerHTML = "";
        UI.showTaskList();
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
                ele.addEventListener('dragstart' , ()=>{
                    ele.classList.add("drag")
                })
                ele.addEventListener('dragend' , ()=>{
                    location.reload();
                    ele.classList.remove("drag");
                    let newTaskName , newTaskDescription;
                    tasks.forEach(e => {
                        if(e.id == ele.dataset.id){
                            newTaskName = e.taskName;
                            newTaskDescription = e.taskDescription;
                        }
                    })
                     const taskItem = new Task(ele.dataset.id, newTaskName, newTaskDescription , selcon);
                     Task.updateTask(taskItem);
                    
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
        tableRow.setAttribute('data-id', task.id);
        tableRow.innerHTML = `
        <section id="note-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dot" viewBox="0 0 16 16">
            <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
        </svg>
        <section class="note" id="note" data-id=${task.id} draggable="true" > 
        <p><span class = "task-name">${task.taskName}</span></p>
       </section>
       </section>
        `;
        if(task.labels === "open"){
            document.querySelector('.open-box').appendChild(tableRow);
        }else if(task.labels === "progress"){
            document.querySelector('.progress-box').appendChild(tableRow);
        }else if(task.labels === "review"){
            document.querySelector('.review-box').appendChild(tableRow);
        }else{
            document.querySelector('.done-box').appendChild(tableRow);
        }
        //here im changing # to . all four
      

    }

    static showViewUpperData(id){
        const tasks = Task.getTasks();
        tasks.forEach(task => {
            // console.log(task)
            if(task.id == id){
                form.task_name.value = task.taskName;       //title view upper
                form.task_description.value = task.taskDescription;
                form.labels.value = task.labels;
                document.getElementById('view-title').innerHTML = "Change Task Details";

                document.getElementById('view-btns').innerHTML = `
                    <button type = "submit" id = "update-btn" data-id = "${id}">Update </button>
                    <button type = "button" id = "delete-btn" data-id = "${id}">Delete </button>
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
    //loadJSON(); // loading task list from json file       171 262
    eventListeners();
    UI.showTaskList();
});

// event listeners
function eventListeners(){
    // show add item viewUpper
    addBtn.addEventListener('click', () => {
        form.reset();
        
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
        let viewID = trElement.dataset.id;
        UI.showViewUpperData(viewID);
    });

    // delete an task item
    viewBtns.addEventListener('click', (event) => {
        if(event.target.id == 'delete-btn'){
            Task.deleteTask(event.target.dataset.id);
        }
    });

    // update an task item
    viewBtns.addEventListener('click', (event) => {
        event.preventDefault();
        location.reload();
        if(event.target.id === "update-btn"){
            let id = event.target.dataset.id;
            let isFormValid = getFormData();
            if(!isFormValid){
                form.querySelectorAll('input').forEach(input => {
                    setTimeout(() => {
                        input.classList.remove('errorMsg');
                    }, 1500);
                });
            } else {
                const taskItem = new Task(id, taskName, taskDescription, labels);
                Task.updateTask(taskItem);
                UI.closeviewUpper();
                form.reset();
            }
        }
        
    });
}




// get form data
function getFormData(){

    // if(!strRegex.test(form.task_name.value) || form.task_name.value.trim().length == 0){
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

