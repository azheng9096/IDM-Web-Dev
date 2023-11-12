let to_dos = {};
let uuid = 0;
let tags = { };

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

  let to_do_left = document.createElement("div");
  to_do_left.className = "to-do-left";

  let to_do_tags_container = document.createElement("div");
  to_do_tags_container.className = "to-do-tags-container";

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
  to_do_container.appendChild(to_do_left);
  to_do_left.appendChild(to_do_tags_container);
  to_do_left.appendChild(to_do_item);
  to_do_item.appendChild(to_do_checkbox);
  to_do_item.appendChild(text_container);
  to_do_container.appendChild(delete_button);

  to_do_input.value = "";

  // add tags
  let selected_tags = inlineButtonComponent.getAllSelected();
  selected_tags.forEach((t) => {
    let to_do_tag = document.createElement("div");
    to_do_tag.className = "to-do-tag";
    to_do_tag.style.backgroundColor = tags[t];
    if (useDark(hexToRgb(tags[t]))) to_do_tag.classList.add("dark");

    to_do_tags_container.appendChild(to_do_tag);

    // text
    let to_do_text_container = document.createElement("span");
    to_do_text_container.textContent = t;
    to_do_tag.appendChild(to_do_text_container);
  });

  let td_uuid = "td" + getUUID();
  to_do_container.id = td_uuid;
  to_dos[td_uuid] = { complete: false, tags: selected_tags };

  inlineButtonComponent.deselectAll();
}

function deleteItem(e) {
  let task_element = e.parentNode;
  delete to_dos[task_element.id];

  task_element.remove();
}
function completeItem(e) {
  let text_container = e.parentNode.querySelector("span");

  let task_element = e.parentNode.parentNode;
  if (e.checked) {
    text_container.classList.add("to-do-completed");
    complete_list.appendChild(task_element);
    to_dos[task_element.id]["complete"] = true;
  } else {
    text_container.classList.remove("to-do-completed");
    to_do_list.appendChild(task_element);
    to_dos[task_element.id]["complete"] = false;
  }
}

function getUUID() {
  return uuid++ + "";
}

function hexToRgb(hex) {
  // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
function useDark(c) {
  // reference: https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
  var L =
    0.2126 * (c.r / 255.0) + 0.7152 * (c.g / 255.0) + 0.0722 * (c.b / 255.0);
  return L > 0.179;
}

const tag_input_element = document.querySelector("#newTagInput");
const submit_tag_btn = document.querySelector("#new-tag-submit");
submit_tag_btn.addEventListener("click", addTag);
function addTag() {
  let input_tag_val = tag_input_element.value.trim();
  if (input_tag_val.trim() === "") return;
  if (Object.keys(tags).indexOf(input_tag_val.trim()) >= 0) {
    alert("Tag already exists");
    return;
  }
  let input_tag_color = document.querySelector("#newTagColor").value;
  tags[input_tag_val] = input_tag_color;

  tag_input_element.value = "";
  inlineButtonComponent.refreshOptions(Object.keys(tags));

  addFilterOptions(input_tag_val);
}

const tag_filters_container = document.querySelector(".tag-filters");
function addFilterOptions(tag) {
  let filter_item = document.createElement("label");
  filter_item.className = "tag-filter-item";

  let checkbox_el = document.createElement("input");
  checkbox_el.type = "checkbox";

  let tag_el = document.createElement("span");
  tag_el.textContent = tag;
  tag_el.style.backgroundColor = tags[tag];

  if (useDark(hexToRgb(tags[tag]))) tag_el.classList.add("dark");

  tag_filters_container.appendChild(filter_item);
  filter_item.appendChild(checkbox_el);
  filter_item.appendChild(tag_el);
}

const filter_btn = document.querySelector("#apply-filter-btn");
filter_btn.addEventListener("click", applyFilter);
function applyFilter() {
  let filter_items = tag_filters_container.querySelectorAll(".tag-filter-item");
  let filter_tags = [];
  filter_items.forEach((f) => {
    let checkbox_el = f.querySelector("input");
    if (checkbox_el.checked) {
      let tag = f.querySelector("span").textContent.trim();
      filter_tags.push(tag);
    }
  });

  let contains_all_tags = (arr, target) => target.every(v => arr.includes(v));
  for (const td_id in to_dos) {
    let td_el = document.querySelector(`#${td_id}`)
    if (contains_all_tags(to_dos[td_id].tags, filter_tags)) {
      td_el.style.display = "";
    } else {
      td_el.style.display = "none"
    }
  }
}

// https://www.24a11y.com/2019/select-your-poison-part-2/
const Keys = {
  Backspace: "Backspace",
  Clear: "Clear",
  Down: "ArrowDown",
  End: "End",
  Enter: "Enter",
  Escape: "Escape",
  Home: "Home",
  Left: "ArrowLeft",
  PageDown: "PageDown",
  PageUp: "PageUp",
  Right: "ArrowRight",
  Space: " ",
  Tab: "Tab",
  Up: "ArrowUp",
};

const MenuActions = {
  Close: 0,
  CloseSelect: 1,
  First: 2,
  Last: 3,
  Next: 4,
  Open: 5,
  Previous: 6,
  Select: 7,
  Space: 8,
  Type: 9,
};

// filter an array of options against an input string
// returns an array of options that begin with the filter string, case-independent
function filterOptions(options = [], filter, exclude = []) {
  return options.filter((option) => {
    const matches = option.toLowerCase().indexOf(filter.toLowerCase()) === 0;
    return matches && exclude.indexOf(option) < 0;
  });
}

// return an array of exact option name matches from a comma-separated string
function findMatches(options, search) {
  const names = search.split(",");
  return names
    .map((name) => {
      const match = options.filter(
        (option) => name.trim().toLowerCase() === option.toLowerCase()
      );
      return match.length > 0 ? match[0] : null;
    })
    .filter((option) => option !== null);
}

// return combobox action from key press
function getActionFromKey(key, menuOpen) {
  // handle opening when closed
  if (!menuOpen && key === Keys.Down) {
    return MenuActions.Open;
  }

  // handle keys when open
  if (key === Keys.Down) {
    return MenuActions.Next;
  } else if (key === Keys.Up) {
    return MenuActions.Previous;
  } else if (key === Keys.Home) {
    return MenuActions.First;
  } else if (key === Keys.End) {
    return MenuActions.Last;
  } else if (key === Keys.Escape) {
    return MenuActions.Close;
  } else if (key === Keys.Enter) {
    return MenuActions.CloseSelect;
  } else if (key === Keys.Backspace || key === Keys.Clear || key.length === 1) {
    return MenuActions.Type;
  }
}

// get index of option that matches a string
function getIndexByLetter(options, filter) {
  const firstMatch = filterOptions(options, filter)[0];
  return firstMatch ? options.indexOf(firstMatch) : -1;
}

// get updated option index
function getUpdatedIndex(current, max, action) {
  switch (action) {
    case MenuActions.First:
      return 0;
    case MenuActions.Last:
      return max;
    case MenuActions.Previous:
      return Math.max(0, current - 1);
    case MenuActions.Next:
      return Math.min(max, current + 1);
    default:
      return current;
  }
}

// check if an element is currently scrollable
function isScrollable(element) {
  return element && element.clientHeight < element.scrollHeight;
}

// ensure given child element is within the parent's visible scroll area
function maintainScrollVisibility(activeElement, scrollParent) {
  const { offsetHeight, offsetTop } = activeElement;
  const { offsetHeight: parentOffsetHeight, scrollTop } = scrollParent;

  const isAbove = offsetTop < scrollTop;
  const isBelow = offsetTop + offsetHeight > scrollTop + parentOffsetHeight;

  if (isAbove) {
    scrollParent.scrollTo(0, offsetTop);
  } else if (isBelow) {
    scrollParent.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight);
  }
}

/*
 * Multiselect Combobox w/ Buttons code
 */
const MultiselectButtons = function (el, options) {
  // element refs
  this.el = el;
  this.comboEl = el.querySelector("[role=combobox]");
  this.inputEl = el.querySelector("input");
  this.listboxEl = el.querySelector("[role=listbox]");

  this.idBase = this.inputEl.id;
  this.selectedEl = document.getElementById(`${this.idBase}-selected`);

  // data
  this.options = options;
  this.filteredOptions = options;

  // state
  this.activeIndex = 0;
  this.open = false;
};

MultiselectButtons.prototype.init = function () {
  this.inputEl.addEventListener("input", this.onInput.bind(this));
  this.inputEl.addEventListener("blur", this.onInputBlur.bind(this));
  this.inputEl.addEventListener("click", () => this.updateMenuState(true));
  this.inputEl.addEventListener("keydown", this.onInputKeyDown.bind(this));

  this.options.map((option, index) => {
    const optionEl = document.createElement("div");
    optionEl.setAttribute("role", "option");
    optionEl.id = `${this.idBase}-${index}`;
    optionEl.className =
      index === 0 ? "combo-option option-current" : "combo-option";
    optionEl.setAttribute("aria-selected", "false");
    optionEl.innerText = option;

    optionEl.addEventListener("click", () => {
      this.onOptionClick(index);
    });
    optionEl.addEventListener("mousedown", this.onOptionMouseDown.bind(this));

    this.listboxEl.appendChild(optionEl);
  });
};

MultiselectButtons.prototype.refreshOptions = function (options) {
  while (this.listboxEl.lastElementChild) {
    this.listboxEl.removeChild(this.listboxEl.lastElementChild);
  }

  this.options = options;

  this.options.map((option, index) => {
    const optionEl = document.createElement("div");
    optionEl.setAttribute("role", "option");
    optionEl.id = `${this.idBase}-${index}`;
    optionEl.className =
      index === 0 ? "combo-option option-current" : "combo-option";
    optionEl.setAttribute("aria-selected", "false");
    optionEl.innerText = option;

    optionEl.addEventListener("click", () => {
      this.onOptionClick(index);
    });
    optionEl.addEventListener("mousedown", this.onOptionMouseDown.bind(this));

    this.listboxEl.appendChild(optionEl);
  });
};

MultiselectButtons.prototype.filterOptions = function (value) {
  this.filteredOptions = filterOptions(this.options, value);

  // hide/show options based on filtering
  const options = this.el.querySelectorAll("[role=option]");
  [...options].forEach((optionEl) => {
    const value = optionEl.innerText;
    if (this.filteredOptions.indexOf(value) > -1) {
      optionEl.style.display = "block";
    } else {
      optionEl.style.display = "none";
    }
  });
};

MultiselectButtons.prototype.onInput = function () {
  const curValue = this.inputEl.value;
  this.filterOptions(curValue);

  // if active option is not in filtered options, set it to first filtered option
  if (this.filteredOptions.indexOf(this.options[this.activeIndex]) < 0) {
    const firstFilteredIndex = this.options.indexOf(this.filteredOptions[0]);
    this.onOptionChange(firstFilteredIndex);
  }

  const menuState = this.filteredOptions.length > 0;
  if (this.open !== menuState) {
    this.updateMenuState(menuState, false);
  }
};

MultiselectButtons.prototype.onInputKeyDown = function (event) {
  const { key } = event;

  const max = this.filteredOptions.length - 1;
  const activeFilteredIndex = this.filteredOptions.indexOf(
    this.options[this.activeIndex]
  );

  const action = getActionFromKey(key, this.open);

  switch (action) {
    case MenuActions.Next:
    case MenuActions.Last:
    case MenuActions.First:
    case MenuActions.Previous:
      event.preventDefault();
      const nextFilteredIndex = getUpdatedIndex(
        activeFilteredIndex,
        max,
        action
      );
      const nextRealIndex = this.options.indexOf(
        this.filteredOptions[nextFilteredIndex]
      );
      return this.onOptionChange(nextRealIndex);
    case MenuActions.CloseSelect:
      event.preventDefault();
      return this.updateOption(this.activeIndex);
    case MenuActions.Close:
      event.preventDefault();
      return this.updateMenuState(false);
    case MenuActions.Open:
      return this.updateMenuState(true);
  }
};

MultiselectButtons.prototype.onInputBlur = function () {
  if (this.ignoreBlur) {
    this.ignoreBlur = false;
    return;
  }

  if (this.open) {
    this.updateMenuState(false, false);
  }
};

MultiselectButtons.prototype.onOptionChange = function (index) {
  this.activeIndex = index;
  this.inputEl.setAttribute("aria-activedescendant", `${this.idBase}-${index}`);

  // update active style
  const options = this.el.querySelectorAll("[role=option]");
  [...options].forEach((optionEl) => {
    optionEl.classList.remove("option-current");
  });
  if (index !== -1) options[index].classList.add("option-current");

  if (this.open && isScrollable(this.listboxEl)) {
    maintainScrollVisibility(options[index], this.listboxEl);
  }
};

MultiselectButtons.prototype.onOptionClick = function (index) {
  this.onOptionChange(index);
  this.updateOption(index);
  this.inputEl.focus();
};

MultiselectButtons.prototype.onOptionMouseDown = function () {
  this.ignoreBlur = true;
};

MultiselectButtons.prototype.removeOption = function (index) {
  const option = this.options[index];

  // update aria-selected
  const options = this.el.querySelectorAll("[role=option]");
  options[index].setAttribute("aria-selected", "false");
  options[index].classList.remove("option-selected");

  // remove button
  const buttonEl = document.getElementById(`${this.idBase}-remove-${index}`);
  this.selectedEl.removeChild(buttonEl.parentElement);
};

MultiselectButtons.prototype.selectOption = function (index) {
  const selected = this.options[index];
  this.activeIndex = index;

  // update aria-selected
  const options = this.el.querySelectorAll("[role=option]");
  options[index].setAttribute("aria-selected", "true");
  options[index].classList.add("option-selected");

  // add remove option button
  const buttonEl = document.createElement("button");
  const listItem = document.createElement("li");
  buttonEl.className = "remove-option";
  buttonEl.style.backgroundColor = tags[selected];
  if (useDark(hexToRgb(tags[selected]))) {
    buttonEl.classList.add("dark");
  }
  buttonEl.type = "button";
  buttonEl.id = `${this.idBase}-remove-${index}`;
  buttonEl.setAttribute("aria-describedby", `${this.idBase}-remove`);
  buttonEl.addEventListener("click", () => {
    this.removeOption(index);
  });
  buttonEl.innerHTML = selected + " ";

  listItem.appendChild(buttonEl);
  this.selectedEl.appendChild(listItem);
};

MultiselectButtons.prototype.updateOption = function (index) {
  const option = this.options[index];
  const optionEls = this.el.querySelectorAll("[role=option]");
  const optionEl = optionEls[index];
  const isSelected = optionEl.getAttribute("aria-selected") === "true";

  if (isSelected) {
    this.removeOption(index);
  } else {
    this.selectOption(index);
  }

  this.inputEl.value = "";
  this.filterOptions("");
};

MultiselectButtons.prototype.updateMenuState = function (
  open,
  callFocus = true
) {
  this.open = open;

  this.comboEl.setAttribute("aria-expanded", `${open}`);
  open ? this.el.classList.add("open") : this.el.classList.remove("open");
  callFocus && this.inputEl.focus();
};

MultiselectButtons.prototype.getAllSelected = function () {
  const selected_options = this.el.querySelector(".selected-options");
  const selected_values = Array.from(
    selected_options.querySelectorAll(".remove-option"),
    ({ textContent }) => textContent.trim()
  );
  return selected_values;
};

MultiselectButtons.prototype.deselectAll = function () {
  const optionEls = this.el.querySelectorAll("[role=option]");
  for (let i = 0; i < this.options.length; i++) {
    const optionEl = optionEls[i];
    const isSelected = optionEl.getAttribute("aria-selected") === "true";
    if (isSelected) this.removeOption(i);
  }
};

// init multiselect w/ inline buttons
const inlineButtonEl = document.querySelector(".js-inline-buttons");
const inlineButtonComponent = new MultiselectButtons(
  inlineButtonEl,
  Object.keys(tags)
);
inlineButtonComponent.init();
