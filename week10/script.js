window.addEventListener("DOMContentLoaded", init, false);

const semester = {
  sp: "Spring",
  su: "Summer",
  fa: "Fall",
  ja: "January",
};

const select_term = document.querySelector("#terms");
const select_school = document.querySelector("#schools");
const select_subject = document.querySelector("#subjects");

async function init() {
  const terms_response = await fetch("https://nyu.a1liu.com/api/terms");
  const terms = await terms_response.json();

  terms.reverse().forEach((term) => {
    let semester_code = term.substring(0, 2);
    let year = term.substring(2);

    let option_element = document.createElement("option");
    option_element.value = term;
    option_element.textContent = `${semester[semester_code]} ${year}`;

    select_term.appendChild(option_element);
  });
}

select_term.addEventListener("change", selectTerm);
function selectTerm() {
  if (this.value === "") {
    select_school.disabled = true;
    clearSelect(select_school, "Select School");

    select_subject.disabled = true;
    clearSelect(select_subject, "Select Subject");
  } else {
    select_school.disabled = false;
    select_subject.disabled = true;
    clearSelect(select_subject, "Select Subject");
    setSchools(this.value);
  }
}

async function setSchools(term) {
  clearSelect(select_school, "Select School");

  await fetch(`https://nyu.a1liu.com/api/schools/${term}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      data.schools.forEach((school) => {
        let option_element = document.createElement("option");
        option_element.value = school.code;
        option_element.textContent = school.name;

        select_school.appendChild(option_element);
      });
    });
}

select_school.addEventListener("change", selectSchool);
function selectSchool() {
  if (this.value === "") {
    select_subject.disabled = true;
    clearSelect(select_subject, "Select Subject");
  } else {
    select_subject.disabled = false;
    setSubjects(select_term.value, this.value);
  }
}

async function setSubjects(term, school) {
  clearSelect(select_subject, "Select Subject");

  await fetch(`https://nyu.a1liu.com/api/schools/${term}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let subjects;
      data.schools.forEach((s) => {
        if (s.code === school) {
          subjects = s.subjects;
        }
      });

      subjects.forEach((subject) => {
        let option_element = document.createElement("option");
        option_element.value = subject.code;
        option_element.textContent = subject.name;

        select_subject.appendChild(option_element);
      });
    });
}

select_subject.addEventListener("change", selectSubject);
function selectSubject() {
  if (this.value !== "") {
    setCourses(select_term.value, select_subject.value);
  }
}

function clearSelect(select_element, default_text) {
  while (select_element.firstChild) {
    select_element.removeChild(select_element.lastChild);
  }

  let default_option = document.createElement("option");
  default_option.disabled = true;
  default_option.hidden = true;
  default_option.textContent = default_text;
  default_option.value = "";
  select_element.appendChild(default_option);
  select_element.value = "";
}

const courses_container = document.querySelector(".courses-container");
async function setCourses(term, subject) {
  while (courses_container.firstChild) {
    courses_container.removeChild(courses_container.lastChild);
  }

  await fetch(`https://nyu.a1liu.com/api/courses/${term}/${subject}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.length > 0) {
        data.forEach((c) => {
          let course_container = document.createElement("div");
          course_container.className = "course-container";
          let course_info = document.createElement("div");
          course_info.className = "course-info";
          let course_code = document.createElement("h5");
          course_code.textContent = `${c.subjectCode} ${c.deptCourseId}`;
          let course_name = document.createElement("h4");
          course_name.textContent = c.name;

          course_info.appendChild(course_code);
          course_info.appendChild(course_name);

          let course_right_container = document.createElement("div");
          course_right_container.className = "course-right-container";
          let view_detail_btn = document.createElement("button");
          view_detail_btn.textContent = "View Details";

          course_right_container.appendChild(view_detail_btn);

          course_container.appendChild(course_info);
          course_container.appendChild(course_right_container);
          courses_container.appendChild(course_container);

          view_detail_btn.addEventListener("click", () =>
            setCourseDetails(
              `${c.subjectCode} ${c.deptCourseId}`,
              c.name,
              c.description,
              c.sections
            )
          );
        });
      } else {
        let course_container = document.createElement("div");
        course_container.className = "course-container";
        let course_info = document.createElement("div");
        course_info.className = "course-info";

        let course_name = document.createElement("h4");
        course_name.textContent = "No Available Courses On File";

        course_info.appendChild(course_name);
        course_container.appendChild(course_info);
        courses_container.appendChild(course_container);
      }
    });
}

const course_details = document.querySelector(".course-details");
const sections_table = document.querySelector(".sections-table");

function setCourseDetails(course_code, course_name, course_description, course_sections) {
  course_details.querySelector("h3").textContent = `${course_code} ${course_name}`;
  course_details.querySelector("p").textContent = course_description;

  while (sections_table.firstChild) {
    sections_table.removeChild(sections_table.lastChild);
  }

  let th_name = document.createElement("th");
  th_name.textContent = "Name";
  let th_id = document.createElement("th");
  th_id.textContent = "ID";
  let th_professors = document.createElement("th");
  th_professors.textContent = "Professors";
  let th_mode = document.createElement("th");
  th_mode.textContent = "Mode";
  let th_status = document.createElement("th");
  th_status.textContent = "Status";
  let tr_heading = document.createElement("tr");
  tr_heading.appendChild(th_name);
  tr_heading.appendChild(th_id);
  tr_heading.appendChild(th_professors);
  tr_heading.appendChild(th_mode);
  tr_heading.appendChild(th_status);
  sections_table.appendChild(tr_heading);

  course_sections.forEach((s) => {
    let td_name = document.createElement("td");
    td_name.textContent = s.name ? s.name : course_name;

    let td_id = document.createElement("td");
    td_id.textContent = s.code;

    let td_professors = document.createElement("td");
    td_professors.textContent = s.instructors.join("; ");

    let td_mode = document.createElement("td");
    td_mode.textContent = s.instructionMode;

    let td_status = document.createElement("td");
    td_status.textContent = s.status;
    switch (s.status.toLowerCase()){
      case "open":
        td_status.style.color = "green";
        break;
      case "waitlist":
        td_status.style.color = "orange";
        break;
      case "cancelled":
      case "closed":
        td_status.style.color = "red";
        break;
      default:
        break;
    }

    let tr_element = document.createElement("tr");
    tr_element.appendChild(td_name);
    tr_element.appendChild(td_id);
    tr_element.appendChild(td_professors);
    tr_element.appendChild(td_mode);
    tr_element.appendChild(td_status);

    sections_table.appendChild(tr_element);
  });
}
