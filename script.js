let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
let currentFilter = "All";

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  if (!taskInput) return;
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ text: text, status: "todo" });
  taskInput.value = "";
  save();
  render();
}

function toggleStatus(index) {
  const order = ["todo", "in-progress", "done"];
  const task = tasks[index];
  if (!task) return;
  const next = (order.indexOf(task.status) + 1) % order.length;
  task.status = order[next];
  save();
  render();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  save();
  render();
}

function matchesFilter(task) {
  if (currentFilter === "Active") return task.status !== "done";
  if (currentFilter === "Done") return task.status === "done";
  return true;
}

function render(filter) {
  if (filter) currentFilter = filter;
  if (!taskList) return;
  taskList.innerHTML = "";
  tasks.forEach(function (task, i) {
    if (!matchesFilter(task)) return;
    const li = document.createElement("li");
    li.textContent = task.text + " [" + task.status + "] ";

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "Next status";
    toggleBtn.onclick = function () { toggleStatus(i); };

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = function () { deleteTask(i); };

    li.appendChild(toggleBtn);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

if (addBtn) addBtn.addEventListener("click", addTask);
if (taskInput) {
  taskInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") addTask();
  });
}

document.querySelectorAll("[data-filter]").forEach(function (btn) {
  btn.addEventListener("click", function () {
    render(btn.getAttribute("data-filter"));
  });
});

document.addEventListener("DOMContentLoaded", function () {
  render("All");
});

console.log("Team Task Board loaded");
