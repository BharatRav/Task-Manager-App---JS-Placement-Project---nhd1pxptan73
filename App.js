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

// -------------------------------------------------- //
let taskName = taskDescription = labels = "";

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
        const tasks = Task.getTasks();
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
        taskBookList.innerHTML = "";
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
            document.querySelector('#open-box').appendChild(tableRow);
        }else if(task.labels === "progress"){
            document.querySelector('#progress-box').appendChild(tableRow);
        }else if(task.labels === "review"){
            document.querySelector('#review-box').appendChild(tableRow);
        }else{
            document.querySelector('#done-box').appendChild(tableRow);
        }
      

    }

    static showViewUpperData(id){
        const tasks = Task.getTasks();
        tasks.forEach(task => {
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
    loadJSON(); // loading task list from json file
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
                let lastTaskId = (allItem.length > 0) ? allTasks[allItem.length - 1].id : 0;
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
        if(event.target.id == "update-btn"){
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


// load Json Task list
function loadJSON(){
    fetch('countries.json')
    .then(response => response.json())
    .then(data => {
        let html = "";
        data.forEach(country => {
            html += `
                <option> ${country.country} </option>
            `;
        });
    })
}

// get form data
function getFormData(){
    let inputValidStatus = [];

    if(!strRegex.test(form.task_name.value) || form.task_name.value.trim().length == 0){
        addErrMsg(form.task_name);
        inputValidStatus[0] = false;
    } else {
        taskName = form.task_name.value;
        inputValidStatus[0] = true;
    }

   

    if(!(form.task_description.value.trim().length > 0)){
        addErrMsg(form.task_description);
        inputValidStatus[1] = false;
    } else {
        taskDescription = form.task_description.value;
        inputValidStatus[1] = true;
    }

  
    labels = form.labels.value;
    return inputValidStatus.includes(false) ? false : true;
}


function addErrMsg(inputBox){
    inputBox.classList.add('errorMsg');
}










































































































































































// // regular expression for validation
// const strRegex =  /^[a-zA-Z\s]*$/; // containing only letters
// const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
// /* supports following number formats - (123) 456-7890, (123)456-7890, 123-456-7890, 123.456.7890, 1234567890, +31636363634, 075-63546725 */
// const digitRegex = /^\d+$/;

// // -------------------------------------------------- //



// const countryList = document.getElementById('country-list');
// const fullscreenSection = document.getElementById('fullscreen-section');
// const viewUpper = document.getElementById('view-upper');
// const addBtn = document.getElementById('add-btn');
// const closeBtn = document.getElementById('close-btn');
// const viewBtns = document.getElementById('view-btns');

// const allTask = document.querySelector('#all-task');

// //.........................................................



// let addrName = streetAddr = labels = "";

// // Address class
// class Address{
//     constructor(id, addrName, streetAddr,labels){
//         this.id = id;
//         this.addrName = addrName;
//         this.streetAddr = streetAddr;
//         this.labels = labels;
//     }

//     static getAddresses(){
//         let addresses;
//         if(localStorage.getItem('addresses') == null){
//             addresses = [];
//         } else {
//             addresses = JSON.parse(localStorage.getItem('addresses'));
//         }
//         return addresses;
//     }

//     static addAddress(address){
//         const addresses = Address.getAddresses();
//         addresses.push(address);
//         localStorage.setItem('addresses', JSON.stringify(addresses));
//     }

//     static deleteAddress(id){
//         const addresses = Address.getAddresses();
//         addresses.forEach((address, index) => {
//             if(address.id == id){
//                 addresses.splice(index, 1);
//             }
//         });
//         localStorage.setItem('addresses', JSON.stringify(addresses));
//         form.reset();       //viewUpper(pop-up)
//         UI.closeViewUpper();
//         allTask.innerHTML = "";
//         UI.showAddressList();
//     }

//     static updateAddress(item){
//         const addresses = Address.getAddresses();
//         addresses.forEach(address => {
//             if(address.id == item.id){
//                 address.addrName = item.addrName;
//                 address.streetAddr = item.streetAddr;
//                 address.labels = item.labels;
//             }
//         });
//         localStorage.setItem('addresses', JSON.stringify(addresses));
//         allTask.innerHTML = "";
//         UI.showAddressList();
//     }
// }

// // UI class
// class UI{
//     static showAddressList(){
//         const addresses = Address.getAddresses();
//         addresses.forEach(address => UI.addToAddressList(address));
//         const notes = document.querySelectorAll('.note');
//         const fourSec = document.querySelectorAll('.four-section');
//         let selcon = "start";
//         notes.forEach(ele => {
//                 ele.addEventListener('dragstart' , ()=>{
//                     ele.classList.add("drag")
//                 })
//                 ele.addEventListener('dragend' , ()=>{
//                     location.reload();
//                     ele.classList.remove("drag");
//                     let newadd , newdes;
//                     addresses.forEach(e => {
//                         if(e.id == ele.dataset.id){
//                             newadd = e.addrName;
//                             newdes = e.streetAddr;
//                         }
//                     })
//                      const addressItem = new Address(ele.dataset.id, newadd, newdes , selcon);
//                      Address.updateAddress(addressItem);
                    
//                 })
//                 fourSec.forEach(ele => {
//                     ele.addEventListener('dragover' , () => {
//                         const tarCon = document.querySelector('.drag');
//                         ele.appendChild(tarCon);
//                         selcon = ele.className;
//                     })
//             })
//         })
//     }

//     static addToAddressList(address){
//         const tableRow = document.createElement('section');
//         tableRow.setAttribute('data-id', address.id);
//         tableRow.innerHTML = `
//         <section id="note-wrapper">
//         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dot" viewBox="0 0 16 16">
//             <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
//         </svg>
//         <section class="note" id="note" data-id=${address.id} draggable="true" > 
//         <p><span class = "addressing-name">${address.addrName}</span></p>
//        </section>
//        </section>
//         `;
//         if(address.labels === "start"){
//             document.querySelector('#open-box').appendChild(tableRow);
//         }else if(address.labels === "progress"){
//             document.querySelector('#progress-box').appendChild(tableRow);
//         }else if(address.labels === "review"){
//             document.querySelector('#review-box').appendChild(tableRow);
//         }else{
//             document.querySelector('.done').appendChild(tableRow);
//         }
      

//     }

//     static showViewUpperData(id){
//         const addresses = Address.getAddresses();
//         addresses.forEach(address => {
//             if(address.id == id){
//                 form.addr_ing_name.value = address.addrName;
//                 form.street_addr.value = address.streetAddr;
//                 form.labels.value = address.labels;
//                 document.getElementById('view-title').innerHTML = "Change Address Details";

//                 document.getElementById('view-btns').innerHTML = `
//                     <button type = "submit" id = "update-btn" data-id = "${id}">Update </button>
//                     <button type = "button" id = "delete-btn" data-id = "${id}">Delete </button>
//                 `;
//             }
//         });
//     }

//     static showViewUpper(){
//         viewUpper.style.display = "block";
//         fullscreenSection.style.display = "block";
//     }

//     static closeViewUpper(){
//         viewUpper.style.display = "none";
//         fullscreenSection.style.display = "none";
//     }



// }


// // DOM Content Loaded
// window.addEventListener('DOMContentLoaded', () => {
//     loadJSON(); // loading country list from json file
//     eventListeners();
//     UI.showAddressList();
// });

// // event listeners
// function eventListeners(){
//     // show add item viewUpper
//     addBtn.addEventListener('click', () => {
//         viewUpper.reset();
//         document.getElementById('view-title').innerHTML = "Add Address";
//         UI.showViewUpper();
//         document.getElementById('view-btns').innerHTML = `
//             <button type = "submit" id = "submit-btn"> Submit it! </button>
//         `;
//     });

//     // close add item viewUpper
//     closeBtn.addEventListener('click', UI.closeViewUpper);

//     // add an address item
//     viewBtns.addEventListener('click', (event) => {
//         event.preventDefault();
//         if(event.target.id == "save-btn"){
//             let isFormValid = getViewUpperData();
//             if(!isFormValid){
//                 form.querySelectorAll('input').forEach(input => {
//                     setTimeout(() => {
//                         input.classList.remove('errorMsg');
//                     }, 1500);
//                 });
//             } else {
//                 let allItem = Address.getAddresses();
//                 let lastItemId = (allItem.length > 0) ? allItem[allItem.length - 1].id : 0;
//                 lastItemId++;

//                 const addressItem = new Address(lastItemId, addrName, streetAddr,labels);
//                 Address.addAddress(addressItem);
//                 UI.closeViewUpper();
//                 UI.addToAddressList(addressItem);
//                 viewUpper.reset();
//             }
//         }
//     });

//     // table row items
//     allTask.addEventListener('click', (event) => {
//         UI.showViewUpper();
//         let trElement;
//         if(event.target.parentElement.tagName == "P"){
//             trElement = event.target.parentElement.parentElement;
//         }

//         if(event.target.parentElement.tagName == "section"){
//             trElement = event.target.parentElement;
//         }
//         let viewID = trElement.dataset.id;
//         UI.showViewUpperData(viewID);
//     });

//     // delete an address item
//     viewBtns.addEventListener('click', (event) => {
//         if(event.target.id == 'delete-btn'){
//             Address.deleteAddress(event.target.dataset.id);
//         }
//     });

//     // update an address item
//     viewBtns.addEventListener('click', (event) => {
//         event.preventDefault();
//         location.reload();
//         if(event.target.id == "update-btn"){
//             let id = event.target.dataset.id;
//             let isFormValid =getViewUpperData ();
//             if(!isFormValid){
//                 form.querySelectorAll('input').forEach(input => {
//                     setTimeout(() => {
//                         input.classList.remove('errorMsg');
//                     }, 1500);
//                 });
//             } else {
//                 const addressItem = new Address(id, addrName, streetAddr, labels);
//                 Address.updateAddress(addressItem);
//                 UI.closeViewUpper();
//                 viewUpper.reset();
//             }
//         }
        
//     });
// }


// //below completed

// // load countries list
// function loadJSON(){
//     fetch('countries.json')
//     .then(response => response.json())
//     .then(data => {
//         let html = "";
//         data.forEach(country => {
//             html += `
//                 <option> ${country.country} </option>
//             `;
//         });
//     })
// }

// // get viewUpper data
// function getViewUpperData(){
//     let inputValidStatus = [];
  

//     if(!strRegex.test(viewUpper.addr_ing_name.value) || viewUpper.addr_ing_name.value.trim().length == 0){
//         addErrMsg(viewUpper.addr_ing_name);
//         inputValidStatus[0] = false;
//     } else {
//         addrName = viewUpper.addr_ing_name.value;
//         inputValidStatus[0] = true;
//     }

   

//     if(!(viewUpper.street_addr.value.trim().length > 0)){
//         addErrMsg(viewUpper.street_addr);
//         inputValidStatus[1] = false;
//     } else {
//         streetAddr = viewUpper.street_addr.value;
//         inputValidStatus[1] = true;
//     }

  
//     labels = viewUpper.labels.value;
//     return inputValidStatus.includes(false) ? false : true;
// }


// function addErrMsg(inputBox){
//     inputBox.classList.add('errorMsg');
// }
