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
  //データの編集
  editTask(id, newText, newDeadline){
    this.tasks = this.tasks.map(task =>
      task.id === id
      ? { ...task, text: newText, deadline: newDeadline }
      : task
    );
  }
  //最新のデータの状態を外に渡す関数
  getTasks() {
    return this.tasks;
  }
}

class Storage {
  //データを保存
  saveData(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  //データ読み込み
  loadData() {
    const data = localStorage.getItem("tasks");
    try {
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }
}


let initialTasks = [];

const storage = new Storage();
const manager = new TaskManager(storage.loadData());

let filter = "all";
let editingId = null;

const dateInput = document.getElementById("dateInput");
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const allBtn = document.getElementById("allBtn");
const activeBtn = document.getElementById("activeBtn");
const completedBtn = document.getElementById("completedBtn");


//表示する関数
function render() {
  taskList.innerHTML = "";

  const tasks = manager.getTasks();

  tasks.forEach((task) => {
    if (filter === "active" && task.completed) return;
    if (filter === "completed" && !task.completed) return;
    const li = document.createElement("li");
    
    // 削除ボタン
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "削除";

    deleteBtn.addEventListener("click", () => {
      manager.deleteTask(task.id);
      updateUI();
    });

    //編集ボタン
    const editBtn = document.createElement("button");
    editBtn.textContent = "編集";

    editBtn.addEventListener("click", () => {
      editingId = task.id;
      render();
    });

  let content;

  if (editingId === task.id) {
    // 編集モード
    const input = document.createElement("input");
    input.value = task.text;

    const dateInputEdit = document.createElement("input");
    dateInputEdit.type = "date";
    dateInputEdit.value = task.deadline || "";

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "保存";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "キャンセル";

    saveBtn.addEventListener("click", () => {
      console.log("クリックされた"); 
      if (input.value.trim() === "") {
        alert("タスクを入力してください");
        return;
      }

      manager.editTask(task.id, input.value, dateInputEdit.value);
      editingId = null;
      updateUI();
    });

    cancelBtn.addEventListener("click", () => {
      editingId = null;
      render();
    });

    content = document.createElement("div");
    content.appendChild(input);
    content.appendChild(dateInputEdit);
    content.appendChild(saveBtn);
    content.appendChild(cancelBtn);

  } else {
    //  通常表示
    const span = document.createElement("span");
    span.textContent =
      (task.completed ? "☑ " : "□ ") +
      task.text +
      (task.deadline ? " 期限:" + task.deadline : "");

    if (task.completed) {
      span.classList.add("completed");
    }
     // クリックで状態切り替え
    span.addEventListener("click", () => {
      manager.toggleTask(task.id);
      updateUI();
    });

    content = span;
  }/*
      li.appendChild(span);
      li.appendChild(deleteBtn);
      li.appendChild(editBtn);
      taskList.appendChild(li);
  */
  const buttonGroup = document.createElement("div");
  buttonGroup.appendChild(editBtn);
  buttonGroup.appendChild(deleteBtn);

  li.appendChild(content);
  li.appendChild(buttonGroup);
  taskList.appendChild(li);

  });

}
//アップデート後の処理をまとめた関数
function updateUI() {
  storage.saveData(manager.getTasks());
  render();
  //console.log("更新した");
}

//追加ボタン
addBtn.addEventListener("click", () => {
  const taskText = taskInput.value;
  
  if (taskText.trim() === "") {
    alert("タスクを入力してください");
    return;
  }
  //「見た目は空じゃないけど、実質空」を防ぐため
  manager.addTask(taskInput.value, dateInput.value);
  
  filter = "all";//追加したら全てに戻す

  updateUI();

  taskInput.value = "";
  dateInput.value = "";
});

allBtn.onclick = () => {
  filter = "all";
  render();
};

activeBtn.onclick = () => {
  filter = "active";
  render();
};

completedBtn.onclick = () => {
  filter = "completed";
  render();
};

render();