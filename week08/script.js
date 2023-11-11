let tags = [];

const submit_btn = document.querySelector("#to-do-submit");
const to_do_input = document.querySelector("#toDoInput");
let to_do_list = document.querySelector("#to-do-list");
let complete_list = document.querySelector("#to-do-complete");

submit_btn.addEventListener("click", makeList);

function makeList() {
  let to_do_input_val = to_do_input.value;
  if (to_do_input_val.trim() === "") return;

  let to_do_container = document.createElement("div");
  to_do_container.className = "to-do-item-container";

  let to_do_item = document.createElement("label");
  to_do_item.className = "to-do-item";
  let to_do_checkbox = document.createElement("input");
  to_do_checkbox.setAttribute("type", "checkbox");
  to_do_checkbox.addEventListener("click", () => completeItem(to_do_checkbox));

  let text_container = document.createElement("span");
  text_container.appendChild(document.createTextNode(to_do_input_val));

  let delete_button = document.createElement("button");
  let delete_icon = document.createElement("span");
  delete_icon.className = "material-symbols-outlined";
  delete_icon.textContent = "delete";
  delete_button.appendChild(delete_icon);
  delete_button.addEventListener("click", () => deleteItem(delete_button));

  to_do_list.appendChild(to_do_container);
  to_do_container.appendChild(to_do_item);
  to_do_item.appendChild(to_do_checkbox);
  to_do_item.appendChild(text_container);
  to_do_container.appendChild(delete_button);

  to_do_input.value = "";
}

function deleteItem(e) {
  e.parentNode.remove();
}
function completeItem(e) {
  let text_container = e.parentNode.querySelector("span");

  let task_element = e.parentNode.parentNode;
  if (e.checked) {
    text_container.classList.add("to-do-completed");
    complete_list.appendChild(task_element)
  } else {
    text_container.classList.remove("to-do-completed");
    to_do_list.appendChild(task_element);
  }
}