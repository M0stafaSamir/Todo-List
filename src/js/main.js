const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const todoTasks = document.getElementById("todoTasks");
const switcher = document.getElementById("themeSwitcher");
const main = document.querySelector("main");
const errMsg = document.getElementById("errMsg");

//get user token
(async () => {
  if (!localStorage.getItem("userToken")) {
    document.querySelector(".loader").classList.add("hidden");
    todoTasks.innerHTML = `<p
            class="text-white opacity-80 text-xl p-0 capitalize mt-3">
            your list is empty <br />
            <span class="text-xs"
              ><i class="fa-regular fa-pen-to-square"></i> Write down your daily
              tasks.</span
            >
          </p>`;

    try {
      const response = await fetch(
        "https://todos.routemisr.com/api/v1/getApiKey"
      );
      const { apiKey } = await response.json();
      localStorage.setItem("userToken", apiKey);
    } catch (error) {
      console.log(error);
    }
  }
})();

//display todo

async function getAllTodos() {
  if (localStorage.getItem("userToken")) {
    try {
      const response = await fetch(
        `https://todos.routemisr.com/api/v1/todos/${localStorage.getItem(
          "userToken"
        )}`
      );

      const { todos } = await response.json();

      displayTodos(todos);
    } catch (error) {
      console.log(error);
    }
  }
}
getAllTodos();

async function addTodo(todo) {
  if (validateInput()) {
    const addIcon = document.querySelector("#addBtn i");
    addIcon.classList.remove("fa-plus");
    addIcon.classList.add("fa-spinner", "fa-spin");
    try {
      const response = await fetch("https://todos.routemisr.com/api/v1/todos", {
        method: "POST",
        body: JSON.stringify(todo),

        headers: { "content-type": "application/json" },
      });
      const result = await response.json();
      console.log(result);
      getAllTodos();
    } catch (error) {
      console.log(error);
    } finally {
      taskInput.value = null;
      addIcon.classList.add("fa-plus");
      addIcon.classList.remove("fa-spinner", "fa-spin");
    }
  }
}

addBtn.addEventListener("click", () => {
  const todo = {
    title: taskInput.value,
    apiKey: localStorage.getItem("userToken"),
  };
  addTodo(todo);
});

function displayTodos(todos) {
  let todoBox = ``;
  for (const index in todos) {
    todoBox += `
              <!-- todo -->
            <div
              class="flex justify-between mb-4 gap-4 items-center p-3 rounded-full bg-[#00000038]">
              <p class="text-white opacity-70 ms-1 ${
                todos[index].completed == true ? "line-through" : ""
              }">
                ${todos[index].title}
                
              </p>
              <div>
                <button
                 onclick="markTodo('${todos[index]._id}',${index})"
               ${todos[index].completed && "disabled"}
                  class="mx-1 ${
                    todos[index].completed == true
                      ? "bg-green-500"
                      : "bg-slate-300"
                  }  hover:bg-green-500 p-1 rounded-full w-8 h-8 s">
                
                  <i class="fa-solid fa-check check${index}"></i>
                </button>
                <button
                  onclick="removeTodo('${todos[index]._id}',${index})"
                  class="mx-1 bg-slate-300 hover:bg-red-500 p-1 rounded-full w-8 h-8">
                  <i class="fa-solid fa-trash-can trash${index}"></i>
                </button>
              </div>
            </div>
            <!-- todo -->`;
  }
  todoTasks.innerHTML = todoBox;

  if (todoTasks.innerHTML === "") {
    todoTasks.innerHTML = `<p
            class="text-white opacity-80 text-xl p-0 capitalize mt-3">
            your list is empty <br />
            <span class="text-xs"
              ><i class="fa-regular fa-pen-to-square"></i> Write down your daily
              tasks.</span
            >
          </p>`;
  }
}

async function markTodo(todoId, index) {
  const checkIcon = document.querySelector(`.check${index}`);
  checkIcon.classList.remove("fa-check");
  checkIcon.classList.add("fa-spinner", "fa-spin");

  try {
    const response = await fetch("https://todos.routemisr.com/api/v1/todos", {
      method: "PUT",
      body: JSON.stringify({
        todoId: todoId,
      }),

      headers: { "content-type": "application/json" },
    });
    const result = await response.json();
    console.log(result);
    getAllTodos();
  } catch (error) {
    console.log(error);
  } finally {
    checkIcon.classList.remove("fa-spinner", "fa-spin");
    checkIcon.classList.add("fa-check");
  }
}
async function removeTodo(todoId, index) {
  const trashIcon = document.querySelector(`.trash${index}`);
  trashIcon.classList.remove("fa-trash-can");
  trashIcon.classList.add("fa-spinner", "fa-spin");
  try {
    const response = await fetch("https://todos.routemisr.com/api/v1/todos", {
      method: "DELETE",
      body: JSON.stringify({
        todoId: todoId,
      }),

      headers: { "content-type": "application/json" },
    });
    const result = await response.json();
    console.log(result);
    getAllTodos();
  } catch (error) {
    console.log(error);
  } finally {
    trashIcon.classList.remove("fa-spinner", "fa-spin");
    trashIcon.classList.add("fa-trash-can");
  }
}

//change theme

switcher.addEventListener("click", function (e) {
  if (e.target.tagName === "SPAN") {
    const theme = e.target.classList[0];
    main.classList.remove("default-gradient", "themeOne", "themeTwo");
    main.classList.add(theme);
  }
});

//validation
function validateInput() {
  if (taskInput.value == "") {
    errMsg.classList.replace("hidden", "block");
    return false;
  } else {
    errMsg.classList.replace("block", "hidden");
    return true;
  }
}

function removeErrMsgOnInput() {
  if (!taskInput.value == "" && errMsg.classList.contains("block")) {
  }
  errMsg.classList.replace("block", "hidden");
}
