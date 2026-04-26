//script.js
//データ管理
class TaskManager {
  constructor(tasks = []) {
    this.tasks = tasks;
  }
  //データ追加
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
  //タスクの状態を変更：completedの値を反転させている
  toggleTask(id) {
    this.tasks = this.tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    );
  }
  //データの削除
  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }
  //最新のデータの状態を外に渡す関数
  getTasks() {
    return this.tasks;
  }
}

let initialTasks = [];

//データの読み込み←関数化するか後で検討
const loadData = localStorage.getItem("tasks");
if (loadData) {
  try {
    initialTasks = JSON.parse(loadData) || [];
  } catch (e) {
    initialTasks = [];
  }
}

const manager = new TaskManager(initialTasks);

let filter = "all";


const dateInput = document.getElementById("dateInput");
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const allBtn = document.getElementById("allBtn");
const activeBtn = document.getElementById("activeBtn");
const completedBtn = document.getElementById("completedBtn");

//表示する
function render() {
  list.innerHTML = "";

  const tasks = manager.getTasks();

  // document.getElementById("allBtn").classList.remove("active");
  // document.getElementById("activeBtn").classList.remove("active");
  // document.getElementById("completedBtn").classList.remove("active");

  // if (filter === "all") {
  //   document.getElementById("allBtn").classList.add("active");
  // }
  // if (filter === "active") {
  //   document.getElementById("activeBtn").classList.add("active");
  // }
  // if (filter === "completed") {
  //   document.getElementById("completedBtn").classList.add("active");
  // }

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
      //task.completed = !task.completed;
       manager.toggleTask(task.id);
      saveData();
      render();
    });

    // 削除ボタン
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "削除";

    deleteBtn.addEventListener("click", () => {
      //tasks = tasks.filter(t => t.id !== task.id);
      manager.deleteTask(task.id);
      saveData();
      render();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });

}

//イベント操作
addBtn.addEventListener("click", () => {
  const taskText = taskInput.value;
  
  if (taskText.trim() === "") return;
  //「見た目は空じゃないけど、実質空」を防ぐため
  manager.addTask(taskInput.value, dateInput.value);
  
  filter = "all";//追加したら全てに戻す

  saveData();
  render();
  taskInput.value = "";
  dateInput.value = "";
  console.log(addBtn);
});

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

//データを保存する関数
function saveData() {
  //localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("tasks", JSON.stringify(manager.getTasks()));
}

render();