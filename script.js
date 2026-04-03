//script.js
let tasks = [];
let filter = "all";
const dateInput = document.getElementById("dateInput");

const savedTasks = localStorage.getItem("tasks");
if (savedTasks) {
  tasks = JSON.parse(savedTasks);
}

const input = document.getElementById("taskInput");
const button = document.getElementById("addBtn");
const list = document.getElementById("taskList");

button.addEventListener("click", () => {
  const taskText = input.value;

  if (taskText.trim() === "") return;
  //「見た目は空じゃないけど、実質空」を防ぐため
  
  tasks.push({
    id: Date.now(),
    text: taskText,
    done: false,
    deadline: dateInput.value
  });

  filter = "all";//追加したら全てに戻す

  saveTasks();
  render();
  input.value = "";
  dateInput.value = "";
});

function render() {
  list.innerHTML = "";

  document.getElementById("allBtn").classList.remove("active");
  document.getElementById("activeBtn").classList.remove("active");
  document.getElementById("doneBtn").classList.remove("active");

  if (filter === "all") {
    document.getElementById("allBtn").classList.add("active");
  }
  if (filter === "active") {
    document.getElementById("activeBtn").classList.add("active");
  }
  if (filter === "done") {
    document.getElementById("doneBtn").classList.add("active");
  }

  tasks.forEach((task) => {
    if (filter === "active" && task.done) return;
    if (filter === "done" && !task.done) return;
    const li = document.createElement("li");

    // チェック表示
    const span = document.createElement("span");
    span.textContent = task.done ? "☑ " : "□ ";
    span.textContent += task.text;
    
    span.textContent += task.deadline
      ? `（期限: ${task.deadline}）`
      : "（期限なし）";
    

    // クリックで状態切り替え
    span.addEventListener("click", () => {
      task.done = !task.done;
      saveTasks();
      render();
    });

    // 削除ボタン
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "削除";

    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
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

document.getElementById("doneBtn").onclick = () => {
  filter = "done";
  render();
};

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

render();