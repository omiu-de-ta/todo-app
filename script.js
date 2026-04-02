//script.js
let tasks = [];
let filter = "all";

const savedTasks = localStorage.getItem("tasks");
if (savedTasks) {
  tasks = JSON.parse(savedTasks);
}

const input = document.getElementById("taskInput");
const button = document.getElementById("addBtn");
const list = document.getElementById("taskList");

button.addEventListener("click", () => {
  const taskText = input.value;

  if (taskText === "") return;

  tasks.push({
    text: taskText,
    done: false
  });

  filter = "all";//追加したら全てに戻す

  render();
  input.value = "";
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

  tasks.forEach((task, index) => {
    if (filter === "active" && task.done) return;
    if (filter === "done" && !task.done) return;
    const li = document.createElement("li");

    // チェック表示
    const span = document.createElement("span");
    span.textContent = task.done ? "☑ " : "□ ";
    span.textContent += task.text;

    // クリックで状態切り替え
    span.addEventListener("click", () => {
      task.done = !task.done;
      render();
    });

    // 削除ボタン
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "削除";

    deleteBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      render();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);

    list.appendChild(li);
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
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

render();