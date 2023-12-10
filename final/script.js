const drinks = [
  {
    drink: "bubble-tea",
    name: "Bubble Tea",
    spr: "images/boba.png",
    instructions:
      "1. Get Cup\r\n\
      2. Add Boba\r\n\
      3. Add Tea\r\n\
      4. Add Milk",
  },
  {
    drink: "iced-bubble-tea",
    name: "Iced Bubble Tea",
    spr: "images/iced-boba.png",
    instructions:
      "1. Get Cup\r\n\
      2. Add Boba\r\n\
      3. Add Ice\r\n\
      4. Add Tea\r\n\
      5. Add Milk\r\n",
  },
  {
    drink: "brown-sugar-bubble-tea",
    name: "Brown Sugar Bubble Tea",
    spr: "images/brown-sugar-bubble-tea.png",
    instructions:
      "1. Get Cup\r\n\
      2. Add Syrup\r\n\
      3. Add Boba\r\n\
      4. Add Tea\r\n\
      5. Add Milk\r\n",
  },
];

const failed_drink = {
  spr: "images/failed_drink.png",
};

const recipes = {
  "cup-item": {
    next: {
      "boba-item": {
        next: {
          "tea-item": {
            next: {
              "milk-item": {
                spr: "images/boba.png",
                drink: "bubble-tea",
              },
            },
            spr: "images/boba2.png",
          },
          "ice-item": {
            next: {
              "tea-item": {
                next: {
                  "milk-item": {
                    spr: "images/iced-boba.png",
                    drink: "iced-bubble-tea",
                  },
                },
                spr: "images/iced-boba2.png",
              },
            },
            spr: "images/iced-boba1.png",
          },
        },
        spr: "images/boba1.png",
      },
      "syrup-item": {
        next: {
          "boba-item": {
            next: {
              "tea-item": {
                next: {
                  "milk-item": {
                    spr: "images/brown-sugar-bubble-tea.png",
                    drink: "brown-sugar-bubble-tea",
                  },
                },
                spr: "images/brown-sugar-boba3.png",
              },
            },
            spr: "images/brown-sugar-boba2.png",
          },
        },
        spr: "images/brown-sugar-boba1.png",
      },
    },
    spr: "images/cup.png",
  },
};

let customers_served = 0;
let game_over = false;

function SelectIngredient(ev) {
  AddIngredient(ev.currentTarget.getAttribute("data-ingredient"));
}
document
  .querySelectorAll(".ingredient-item-container, .cup-item-container")
  .forEach((ingredient_button) =>
    ingredient_button.addEventListener("click", (e) => SelectIngredient(e))
  );

const cup_container = document.querySelector(".cup-container img");
function AddIngredient(ingredient) {
  if (ingredient !== "null") {
    // valid ingredient
    if (
      cup_container.getAttribute("data-drink") === "" &&
      recipes.hasOwnProperty(ingredient)
    ) {
      // currently drink station is empty and is adding cup
      // add cup, set sprite, and allow drag
      cup_container.setAttribute(
        "data-drink",
        JSON.stringify(recipes[ingredient])
      );
      cup_container.src = recipes[ingredient].spr;
      cup_container.draggable = true;
    } else if (cup_container.getAttribute("data-drink") !== "") {
      // drink station not empty
      let curr_drink = JSON.parse(cup_container.getAttribute("data-drink"));
      if (
        curr_drink.hasOwnProperty("next") &&
        curr_drink.next.hasOwnProperty(ingredient)
      ) {
        // valid next ingredient
        console.log("Next ingredient ok");
        cup_container.src = curr_drink.next[ingredient].spr;
        cup_container.setAttribute(
          "data-drink",
          JSON.stringify(curr_drink.next[ingredient])
        );
      } else {
        console.log("Does not have next ingredient");
        if (ingredient == "cup-item") return;
        cup_container.src = failed_drink.spr;
        cup_container.setAttribute("data-drink", JSON.stringify(failed_drink));
      }
    }
  }
}

function DiscardDrink() {
  cup_container.setAttribute("data-drink", "");
  cup_container.src =
    "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
  cup_container.draggable = false;
}

function StartDragDrink(ev) {
  ev.dataTransfer.clearData();

  let data_drink = JSON.parse(ev.currentTarget.getAttribute("data-drink"));
  ev.dataTransfer.setData("text/plain", data_drink.drink);
}

function DragDrink() {
  let orders = document.querySelectorAll(".customer-order");
  orders.forEach((order) => order.classList.add("await-drop"));

  let trash = document.querySelector(".trash-item-container");
  trash.classList.add("await-drop");
}

function EndDragDrink() {
  let orders = document.querySelectorAll(".customer-order");
  orders.forEach((order) => {
    order.classList.remove("await-drop");
    order.querySelector(".order-submit-overlay").style.display = "none";
  });

  let trash = document.querySelector(".trash-item-container");
  trash.classList.remove("await-drop");
  trash.classList.remove("drop-over");
}

function OnDragOver(ev) {
  ev.preventDefault();
}

function HighlightTrash(ev) {
  ev.currentTarget.classList.add("drop-over");
}

function StopHighlightTrash(ev) {
  ev.currentTarget.classList.remove("drop-over");
}

function ShowSubmitOrder(ev) {
  ev.currentTarget.querySelector(".order-submit-overlay").style.display =
    "flex";
}

function HideSubmitOrder(ev) {
  ev.currentTarget.querySelector(".order-submit-overlay").style.display =
    "none";
}

const scoreboard = document.querySelector(".scoreboard h1");
function ReceiveDrink(ev) {
  let drink = ev.dataTransfer.getData("text/plain");
  let ordered_drink = ev.currentTarget.getAttribute("data-order");

  if (drink === ordered_drink) {
    console.log("Successful order");
    ev.currentTarget.parentNode.removeChild(ev.currentTarget);
    SetCustomersServed(++customers_served);
  } else {
    console.log("Unsuccessful order");
    EndGame();
  }

  DiscardDrink();
  ev.dataTransfer.clearData();
}
function SetCustomersServed(new_num) {
  customers_served = new_num;
  scoreboard.textContent = customers_served;
}

// ---- CUSTOMERS ----
const customers_container = document.querySelector(".customers-container");
function MakeOrder() {
  `
  <div
    class="customer-order"
    data-order="bubble-tea"
    ondragover="OnDragOver(event)"
    ondrop="ReceiveDrink(event)"
    ondragenter="ShowSubmitOrder(event)"
    ondragleave="HideSubmitOrder(event)"
  >
    <div class="order-icon">
      <img src="images/boba.png" />
    </div>
    <p class="order-name">Order Name</p>
    <progress value="32" max="100">5s</progress>
    <div class="order-submit-overlay">
      <p>Submit Order</p>
    </div>
  </div>
  `;

  let order = drinks[Math.floor(Math.random() * drinks.length)];

  let customer_order = document.createElement("div");
  customer_order.className = "customer-order";
  customer_order.setAttribute("data-order", order.drink);
  customer_order.addEventListener("dragover", (e) => OnDragOver(e));
  customer_order.addEventListener("drop", (e) => ReceiveDrink(e));
  customer_order.addEventListener("dragenter", (e) => ShowSubmitOrder(e));
  customer_order.addEventListener("dragleave", (e) => HideSubmitOrder(e));

  let order_icon = document.createElement("div");
  order_icon.className = "order-icon";
  let order_icon_img = document.createElement("img");
  order_icon_img.src = order.spr;
  order_icon.appendChild(order_icon_img);

  let order_name = document.createElement("p");
  order_name.className = "order-name";
  order_name.textContent = order.name;

  let progress_bar = document.createElement("progress");
  let order_time;
  if (customers_served < 10) {
    order_time = 60;
  } else if (customer_order < 20) {
    order_time = 40;
  } else if (customer_order < 30) {
    order_time = 20;
  } else if (cucstomer_order < 50) {
    order_time = 15;
  } else {
    order_time = 10;
  }
  progress_bar.value = order_time;
  progress_bar.max = order_time;

  let order_submit_overlay = document.createElement("div");
  order_submit_overlay.className = "order-submit-overlay";
  let order_submit_overlay_p = document.createElement("p");
  order_submit_overlay_p.textContent = "Submit Order";
  order_submit_overlay.appendChild(order_submit_overlay_p);

  customer_order.appendChild(order_icon);
  customer_order.appendChild(order_name);
  customer_order.appendChild(progress_bar);
  customer_order.appendChild(order_submit_overlay);

  return customer_order;
}

function DecreaseOrderTimer() {
  if (!game_over) {
    let orders = document.querySelectorAll(".customer-order");
    orders.forEach((order) => {
      let progress_bar = order.querySelector("progress");
      progress_bar.value--;

      if (progress_bar.value <= 0) EndGame();
    });
  }
}
setInterval(DecreaseOrderTimer, 1000);

let spawn_new_order_time = 5000;
function AddOrder() {
  if (!game_over) {
    if (customers_container.childElementCount < 3) {
      customers_container.appendChild(MakeOrder());
    }
  }
}
setInterval(AddOrder, spawn_new_order_time);

// --- RECIPES ---
const previous_button = document.querySelector(".previous-button");
const next_button = document.querySelector(".next-button");
let curr_recipe_index = 0;
previous_button.addEventListener("click", PreviousRecipe);
function PreviousRecipe() {
  if (curr_recipe_index <= 0) return;

  curr_recipe_index--;
  DisplayRecipe();
}

next_button.addEventListener("click", NextRecipe);
function NextRecipe() {
  if (curr_recipe_index >= drinks.length - 1) return;

  curr_recipe_index++;
  DisplayRecipe();
}

const recipe_img = document.querySelector(".drink-header img");
const recipe_name = document.querySelector(".drink-header h2");
const recipe_instructions = document.querySelector(".drink-instructions");
function DisplayRecipe() {
  recipe_img.src = drinks[curr_recipe_index].spr;
  recipe_name.textContent = drinks[curr_recipe_index].name;
  recipe_instructions.innerText = drinks[curr_recipe_index].instructions;

  previous_button.style.display = curr_recipe_index <= 0 ? "none" : "block";
  next_button.style.display =
    curr_recipe_index >= drinks.length - 1 ? "none" : "block";
}

DisplayRecipe();

// ---- END SCREEN ----
const game_over_screen = document.querySelector(".game-over-overlay");
const game_over_score = document.querySelector(".game-over-text-container h1");
function EndGame() {
  game_over_screen.style.display = "flex";
  game_over_score.textContent = `Score: ${customers_served}`;

  game_over = true;
}

// ---- REPLAY ----
function Replay() {
  DiscardDrink();
  SetCustomersServed(0);
  while (customers_container.firstChild) {
    customers_container.removeChild(customers_container.firstChild);
  }

  game_over_screen.style.display = "none";
  game_over = false;
}
const replay_button = document.querySelector(".replay-button");
replay_button.addEventListener("click", Replay);
