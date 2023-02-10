const viewUpper = document.getElementById("view-upper");
const addButton = document.getElementById("add-btn");
let submitButton = document.getElementById("submit-btn");
const updateButton = document.getElementById("update-btn");
const closeButton = document.getElementById("close-btn");
const deleteButton = document.getElementById("delete-btn")

const form = document.getElementById('view-upper');

const OpenUnorderedList = document.getElementById("open");
const progressUnorderedList = document.getElementById("progress");
const reviewUnorderedList = document.getElementById("review");
const doneUnorderedList = document.getElementById("done");
const error = document.getElementById("errorMsg");


const formTitle = document.querySelector("#title-data");
const formDesc = document.querySelector("#description-data");
const formLabels = document.querySelector("#labels-data");

//localStorage.clear();
let EDIT_ELEMENT = null;

let source = "";
let destination = "";

let allTasks = [
   { name: "open", tasks: [] },
   { name: "progress", tasks: [] },
   { name: "review", tasks: [] },
   { name: "done", tasks: [] },
];

addButton.addEventListener("click", (event) => {
  event.preventDefault();
  viewUpper.style.display = "block";
  submitButton.style.display = "block";
  updateButton.style.display="none";
  document.getElementById("view-title").innerText ="Add Task";
// document.getElementById('view-btns').innerHTML = `
//         <button type="submit" id="submit-btn" >Submit</button>
//     `;
//     submitButton = document.getElementById("submit-btn");
   form.task_name.value = ""; 
    form.task_description.value = "";
    form.labels.value = "open";
    error.innerText = "";
});

function closeviewUpper(){
    viewUpper.style.display = "none";
    form.task_name.value = ""; 
    form.task_description.value = "";
    form.labels.value = "open";
    error.innerText = "";
}

closeButton.addEventListener("click", (event) => {
  event.preventDefault();
//   console.log(event)
    
  viewUpper.style.display = "none";
    closeviewUpper();
    document.getElementById("view-title").innerText ="Add Task";
    
});

submitButton.addEventListener("click", (event) => {
   event.preventDefault();
   //console.log(event);
   //console.log("hi");

   const name = document.getElementById("title-data").value;
   const description = document.getElementById("description-data").value;
   const taskLabel = document.getElementById("labels-data").value;
   if (!name || !description) {
     error.innerText = "Please enter title and description!";
     return;
   }
   const newTask = { id: `${new Date().getTime()}`, name, description };

   const taskItem = document.createElement("li");
   taskItem.innerText = name;
   taskItem.setAttribute("id", `${newTask.id}`);
   taskItem.setAttribute("data-description", newTask.description);
   taskItem.setAttribute("draggable", "true");
   taskItem.setAttribute("ondragstart", "drag(event)");
   taskItem.setAttribute("onclick", "EditTask(event)");
   
//    if(localStorage.getItem("tasks")===null || localStorage.getItem("tasks")==="") {
//   localStorage.setItem("tasks",allTasks);
// }
   saveData();
   
   //here i added extra line 

  switch (taskLabel) {
    case "open":
      allTasks[0].tasks.push(newTask);
      OpenUnorderedList.appendChild(taskItem);
      break;
    case "progress":
      allTasks[1].tasks.push(newTask);
      progressUnorderedList.appendChild(taskItem);
      break;
    case "review":
      allTasks[2].tasks.push(newTask);
      reviewUnorderedList.appendChild(taskItem);
      break;
    case "done":
      allTasks[3].tasks.push(newTask);
      doneUnorderedList.appendChild(taskItem);
      break;
  }
  closeviewUpper();

   saveData();
});

function saveData() {
   const tasks = JSON.stringify(allTasks);
   localStorage.setItem("tasks", tasks);
 }

function getDataFromStorage() {
  const tasks = localStorage.getItem("tasks");
  allTasks = JSON.parse(tasks) ? JSON.parse(tasks) : allTasks;
  return allTasks;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  source = ev.target.parentElement.getAttribute("id");
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
   const child = document.getElementById(data);
    ev.target.appendChild(document.getElementById(data));
 
    const targetLocation = ev.target.getAttribute("id");
    destination = targetLocation;
 
   const text = child.innerText;
   const id = child.getAttribute("id");
   const description = child.getAttribute("data-description");
   const taskData = { text, id, description };
   UpdateTaskList(source, destination, taskData);
 }
 
  const UpdateTaskList = (source, destination, data, shouldRemoveChild = false) => {
    const { text, id, description } = data;
    const newTask = { id, name: text, description };
 
    if (source != destination) {
      switch (destination) {
        case "open":
          allTasks[0].tasks.push(newTask);
          break;
        case "progress":
         allTasks[1].tasks.push(newTask);
         break;
       case "review":
         allTasks[2].tasks.push(newTask);
         break;
       case "done":
         allTasks[3].tasks.push(newTask);
         break;
     }

    allTasks = allTasks.map((item) => {
      if (item.name === source) {
        return {
          name: source,
          tasks: item.tasks.filter((task) => task.id !== id),
        };
      } else return item;
    });
  } else {
    allTasks = allTasks.map((item) => {
      if (item.name === source) {
        return {
          name: source,
          tasks: item.tasks.map((task) => {
            if (task.id === id) {
              return newTask;
            } else {
              return task;
            }
          }),
        };
      } else return item;
    });
  }
  if (shouldRemoveChild) {
    const sourceContainer = document.getElementById(source);
    const destinationContainer = document.getElementById(destination);
    const item = document.getElementById(id);
    sourceContainer.removeChild(item);

    const taskItem = document.createElement("li");
    taskItem.innerText = text;
    taskItem.setAttribute("id", `${id}`);
    taskItem.setAttribute("data-description", description);
    taskItem.setAttribute("draggable", "true");
    taskItem.setAttribute("ondragstart", "drag(event)");
    taskItem.setAttribute("onclick", "EditTask(event)");
    destinationContainer.appendChild(taskItem);
  }
  saveData();
};

function EditTask(event) {
  event.preventDefault();
  event.stopPropagation()
  viewUpper.style.display = "block";
  updateButton.style.display = "block";
  submitButton.style.display="none";
  EDIT_ELEMENT = event.target;
  formValue(event);
  document.getElementById("view-title").innerText ="Update Task";
}

updateButton.addEventListener("click", (event) => {
  event.preventDefault();
  const id = EDIT_ELEMENT?.getAttribute("id");

  const text = formTitle.value;
  const description = formDesc.value;

  const source = document.getElementById(id).parentElement.getAttribute("id");

  const dest = formLabels.value;

  const data = { text, id, description };
  UpdateTaskList(source, dest, data, true);

  EDIT_ELEMENT = null;
  closeviewUpper();
});

function formValue(event) {
  const element = event.target;
  const source = element.parentElement.getAttribute("id");

  formTitle.value = element.innerText;
  formDesc.value = element.getAttribute("data-description");
  formLabels.value = source;
}

function renderList(parentId, data) {
  const parentElement = document.getElementById(parentId);

  const { text, id, description } = data;

  const taskItem = document.createElement("li");
  taskItem.innerText = text;
  taskItem.setAttribute("id", `${id}`);
  taskItem.setAttribute("data-description", description);
  taskItem.setAttribute("draggable", "true");
  taskItem.setAttribute("ondragstart", "drag(event)");
  taskItem.setAttribute("onclick", "EditTask(event)");
  parentElement.appendChild(taskItem);
}

 function ShowAllTask() {
   getDataFromStorage();
   const sectoins = ["open", "progress", "review", "done"];

   allTasks?.forEach((item, index) => {
     if (item.tasks.length == 0) {
       return;
     }
     item.tasks?.forEach((task) => {
       const text = task.name;
       const description = task.description;
       const id = task.id;
       const data = { text, id, description };
       const parentId = sectoins[index];
       renderList(parentId, data);
     });
   });
 }

function addNewTask(event) {
    event.preventDefault();
    // console.log(event.target.id);
    form.labels.value = event.target.id;
  viewUpper.style.display = "block";
  submitButton.style.display = "block";
  updateButton.style.display="none";
  document.getElementById("view-title").innerText ="Add Task";
   formTitle.value = "";
  formDesc.value = "";
  
}


 ShowAllTask();
