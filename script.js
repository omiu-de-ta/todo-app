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
  //最新のデータの状態を外に渡す
  getTasks() {
    return this.tasks;
  }
}

//永続化
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

const state = {
   filter: "all",
   editingId: null
 };


const dateInput = document.getElementById("dateInput");
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const allBtn = document.getElementById("allBtn");
const activeBtn = document.getElementById("activeBtn");
const completedBtn = document.getElementById("completedBtn");


//アップデート後の処理をまとめた関数
function updateUI() {
  storage.saveData(manager.getTasks());
  render();
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
  
  state.filter = "all";//追加したら全てに戻す

  updateUI();

  taskInput.value = "";
  dateInput.value = "";
});

allBtn.onclick = () => {
  state.filter = "all";
  render();
};

activeBtn.onclick = () => {
  state.filter = "active";
  render();
};

completedBtn.onclick = () => {
  state.filter = "completed";
  render();
};

//表示する
function render() {
  taskList.innerHTML = "";
  const tasks = manager.getTasks();

  tasks.forEach(task => {
     if (shouldSkip(task)) return;

    const li = createTaskItem(task);
    taskList.appendChild(li);
  });
}

//フィルタリング
function shouldSkip(task) {
  if (state.filter === "active" && task.completed) return true;
  if (state.filter === "completed" && !task.completed) return true;
  return false;
}

//li要素の組み立て
function createTaskItem(task) {
  const li = document.createElement("li");

  if (state.editingId === task.id) {
    li.appendChild(createEditUI(task));
  } else {
    li.appendChild(createNormalUI(task));
    li.appendChild(createButtonGroup(task));
  }

  return li;
}

//通常UI作成(ボタン以外)
function createNormalUI(task) {
  const span = document.createElement("span");

  span.textContent =
    (task.completed ? "☑ " : "□ ") +
    task.text +
    (task.deadline ? " 期限:" + task.deadline : "");

  if (task.completed) {
    span.classList.add("completed");
  }

  // 期限カラー
  const status = getDeadlineStatus(task.deadline);
  if (status === "overdue") {
    span.classList.add("deadline-overdue");
  } else if (status === "today") {
    span.classList.add("deadline-today");
  }

  span.addEventListener("click", () => {
    manager.toggleTask(task.id);
    updateUI();
  });

  return span;
}

//通常UI作成(ボタンのみ)
function createButtonGroup(task) {
  const buttonGroup = document.createElement("div");

  const editBtn = document.createElement("button");
  editBtn.textContent = "編集";

  editBtn.addEventListener("click", () => {
    state.editingId = task.id;
    render();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "削除";

  deleteBtn.addEventListener("click", () => {
    manager.deleteTask(task.id);
    updateUI();
  });

  buttonGroup.appendChild(editBtn);
  buttonGroup.appendChild(deleteBtn);

  return buttonGroup;
}

//編集UI作成
function createEditUI(task) {
  const container = document.createElement("div");

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
    if (input.value.trim() === "") {
      alert("タスクを入力してください");
      return;
    }

    manager.editTask(task.id, input.value, dateInputEdit.value);
    state.editingId = null;
    updateUI();
  });

  cancelBtn.addEventListener("click", () => {
    state.editingId = null;
    render();
  });

  container.appendChild(input);
  container.appendChild(dateInputEdit);
  container.appendChild(saveBtn);
  container.appendChild(cancelBtn);

  return container;
}
//日付を判定
function getDeadlineStatus(deadline) {
  if (!deadline) return null;

  const today = new Date();
  const d = new Date(deadline);

  // 時間リセット（純粋に日付だけ比較）
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);

  if (d < today) return "overdue";   // 過去 → 赤
  if (d.getTime() === today.getTime()) return "today"; // 今日 → オレンジ

  return "future";
}

render();