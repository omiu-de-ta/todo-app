//script.js
class TaskManager {
  constructor(tasks = []) {
    this.tasks = tasks;
  }

  addTask(text, deadline) {
    if (text.trim() === "") return;

    const newTask = {
      id: Date.now(),
      text,
      completed: false,
      deadline
    };

    this.tasks.push(newTask);
  }

  toggleTask(id) {
    this.tasks = this.tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    );
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  getTasks() {
    return this.tasks;
  }
}

let initialTasks = [];
const saves = localStorage.getItem("tasks");
if (saves) {
  try {
    initialTasks = JSON.parse(saves) || [];
  } catch (e) {
    initialTasks = [];
  }
}

const manager = new TaskManager(initialTasks);

let filter = "all";
const dateInput = document.getElementById("dateInput");
/*
const savedTasks = localStorage.getItem("tasks");
if (savedTasks) {
  tasks = JSON.parse(savedTasks);
}
*/
const input = document.getElementById("taskInput");
const button = document.getElementById("addBtn");
const list = document.getElementById("taskList");

button.addEventListener("click", () => {
  const taskText = input.value;

  if (taskText.trim() === "") return;
  //「見た目は空じゃないけど、実質空」を防ぐため
  
  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false,
    deadline: dateInput.value
  };

  tasks.push(newTask);

  filter = "all";//追加したら全てに戻す

  saves();
  render();
  input.value = "";
  dateInput.value = "";
});

function render() {
  list.innerHTML = "";

  document.getElementById("allBtn").classList.remove("active");
  document.getElementById("activeBtn").classList.remove("active");
  document.getElementById("completedBtn").classList.remove("active");

  if (filter === "all") {
    document.getElementById("allBtn").classList.add("active");
  }
  if (filter === "active") {
    document.getElementById("activeBtn").classList.add("active");
  }
  if (filter === "completed") {
    document.getElementById("completedBtn").classList.add("active");
  }

  tasks.forEach((task) => {
    if (filter === "active" && task.completed) return;
    if (filter === "completed" && !task.completed) return;
    const li = document.createElement("li");
    
    // チェック表示
    const span = document.createElement("span");
    span.textContent = (task.completed ? "☑ " : "□ ")+
    task.text +
    (task.deadline ? " 期限:" + task.deadline : "");

    if (task.completed) {
    span.classList.add("completed");
    }
    
    // クリックで状態切り替え
    span.addEventListener("click", () => {
      task.completed = !task.completed;
      saves();
      render();
    });

    // 削除ボタン
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "削除";

    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saves();
      render();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });

}

document.getElementById("allBtn").onclick = () => {
  filter = "all";
  render();
};

document.getElementById("activeBtn").onclick = () => {
  filter = "active";
  render();
};

document.getElementById("completedBtn").onclick = () => {
  filter = "completed";
  render();
};

function saves() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

render();