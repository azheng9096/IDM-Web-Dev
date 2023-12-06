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
];

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
                    spr: "images/iced_boba.png",
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
    },
    spr: "images/cup.png",
  },
};

function SelectIngredient(ev) {
  console.log(ev.currentTarget.getAttribute("data-ingredient"));
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
    if (
      cup_container.getAttribute("data-drink") === "" &&
      recipes.hasOwnProperty(ingredient)
    ) {
      cup_container.setAttribute(
        "data-drink",
        JSON.stringify(recipes[ingredient])
      );
      cup_container.src = recipes[ingredient].spr;
      cup_container.draggable = true;
    } else if (cup_container.getAttribute("data-drink") !== "") {
      let curr_drink = JSON.parse(cup_container.getAttribute("data-drink"));
      if (
        curr_drink.hasOwnProperty("next") &&
        curr_drink.next.hasOwnProperty(ingredient)
      ) {
        console.log("Next ingredient ok");
        cup_container.src = curr_drink.next[ingredient].spr;
        cup_container.setAttribute(
          "data-drink",
          JSON.stringify(curr_drink.next[ingredient])
        );
      } else {
        console.log("Does not have next ingredient");
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
}

function EndDragDrink() {
  let orders = document.querySelectorAll(".customer-order");
  orders.forEach((order) => {
    order.classList.remove("await-drop");
    order.querySelector(".order-submit-overlay").style.display = "none";
  });
}

function OnDragOver(ev) {
  ev.preventDefault();
}

function ShowSubmitOrder(ev) {
  ev.currentTarget.querySelector(".order-submit-overlay").style.display =
    "flex";
}

function HideSubmitOrder(ev) {
  ev.currentTarget.querySelector(".order-submit-overlay").style.display =
    "none";
}

function ReceiveDrink(ev) {
  let drink = ev.dataTransfer.getData("text/plain");
  let ordered_drink = ev.currentTarget.getAttribute("data-order");

  if (drink === ordered_drink) {
    console.log("Successful order");
    ev.currentTarget.parentNode.removeChild(ev.currentTarget);
  } else {
    console.log("Unsuccessful order");
  }

  DiscardDrink();
  ev.dataTransfer.clearData();
}

// ---- CUSTOMERS ----
const customers_container = document.querySelector(".customers-container");
function MakeOrder() {
  let order = drinks[0];

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

  let progress_bar = document.createElement("p");
  progress_bar.className = "order-progress";
  let order_time = 100;
  progress_bar.setAttribute("data-order-time", order_time);
  progress_bar.textContent = `Time Left: ${order_time}s`;

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
  let orders = document.querySelectorAll(".customer-order");
  orders.forEach((order) => {
    let progress_bar = order.querySelector(".order-progress");
    let time_left = parseInt(progress_bar.getAttribute("data-order-time"));
    if (time_left > 0) {
      time_left--;
      progress_bar.setAttribute("data-order-time", time_left);
      progress_bar.textContent = `Time Left: ${time_left}s`;
    }
  });
}
setInterval(DecreaseOrderTimer, 1000);

let spawn_new_order_time = 5000;
function AddOrder() {
  if (customers_container.childElementCount < 3) {
    customers_container.appendChild(MakeOrder());
  }
}
setInterval(AddOrder, spawn_new_order_time);
