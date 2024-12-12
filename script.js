

const bcaButton = document.getElementById('hero-btn');
const cardLink = document.querySelectorAll('.flip-card a');
const course_title = document.getElementById('course-title');

// Restore state from localStorage
// document.addEventListener('DOMContentLoaded', () => {
//   const savedCourse = localStorage.getItem('selectedCourse');
//   if (savedCourse) {
//     bcaButton.value = savedCourse; // Set the select value
//     updateLinksAndTitle(savedCourse);
//   }
// });

document.addEventListener('DOMContentLoaded', () => {
  const savedCourse = localStorage.getItem('selectedCourse') || "bca"; // Default to "bca"
  bcaButton.value = savedCourse; // Set the select value
  updateLinksAndTitle(savedCourse);
});

// Update links and span based on selection
function updateLinksAndTitle(course) {
  
  if (course === "bcom") {
    cardLink[0].href = "bcom_sem1.html";
    cardLink[1].href = "bcom_sem2.html";
    cardLink[2].href = "bcom_sem3.html";
    cardLink[3].href = "bcom_sem4.html";
    cardLink[4].href = "bcom_sem5.html";
    cardLink[5].href = "bcom_sem6.html";
    course_title.innerHTML = "B.Com";
  } else {
    cardLink[0].href = "sem1.html";
    cardLink[1].href = "sem2.html";
    cardLink[2].href = "sem3.html";
    cardLink[3].href = "sem4.html";
    cardLink[4].href = "sem5.html";
    cardLink[5].href = "sem6.html";
    course_title.innerHTML = "BCA";
  }
}

// Save selection and update UI
bcaButton.addEventListener('change', () => {
  const selectedCourse = bcaButton.value;
  localStorage.setItem('selectedCourse', selectedCourse); // Save to localStorage
  updateLinksAndTitle(selectedCourse);
});

// dark white mode 

const mode = document.querySelector(".mode-icon"); //mode icon front of top of body
const bodys = document.querySelector(".body")

const hero_headding = document.querySelectorAll(".hero-text h2"); //select all section heading text H2
const hero_para = document.querySelectorAll(".hero-text p "); //select all section heading text P2
const hero_img = document.querySelectorAll(".hero-img img"); //select all section img 
const menu_heading = document.querySelector(".menu-heading");

const contact_form = document.querySelector(".contact-form");
const contact_form_label = document.querySelectorAll(".form-label");
const contact_form_input = document.querySelectorAll(".form-control");


const footer = document.querySelector(".footer");
const footer_icon = document.querySelectorAll(".connection i");


// mode code
let mode_code = localStorage.getItem("mode") === "dark" ? 0 : 1; // define value white to dark

// Apply the saved mode state
const applyMode = () => {
  if (mode_code === 1) {
    mode.style.color = "black";
    mode.textContent = ""; // &#xe518; for light mode icon
    bodys.style.backgroundColor = "white";//change all sectiont color white to dark
    for (let i of hero_headding) {
      i.style.color = "black";
    }
    for (let i of hero_para) { //change all sectiont color white to dark
      i.style.color = "black";
    }
    for (let i of hero_img) {
      i.style.borderRadius = "15px";
    }
    menu_heading.style.color = "black";
    for (let i of contact_form_label) { //change all sectiont color white to dark
      i.style.color = "black";
    }
    for (let i of contact_form_input) { //change all sectiont color white to dark
      i.style.backgroundColor = "white";
    }
    footer.style.color = "black";
    footer.style.border = "1px solid #ccc";
    for (let i of footer_icon) { //change all sectiont color white to dark
      i.style.color = "black";
    }
  }
  
  
  else {
    mode.style.color = "#3cff00";
    mode.textContent = ""; // &#xe51c; for dark mode icon 
    bodys.style.backgroundColor = "black";
    for (let i of hero_headding) { //change all sectiont color dark to white
      i.style.color = "white";
    }
    for (let i of hero_para) {
      i.style.color = "white";  //change all sectiont color dark to white
    }
    for (let i of hero_img) {
      i.style.borderRadius = "15px";
    }
    menu_heading.style.color = "white";
    contact_form.style.borderRadius = "15px";
    contact_form.style.border = "1px solid white";
    for (let i of contact_form_label) {  //change all sectiont color dark to white
      i.style.color = "white";
    }
    for (let i of contact_form_input) { //change all sectiont color white to dark
      i.style.backgroundColor = "#cecece";
    }
    footer.style.color = "white";
    footer.style.border = "none";
    for (let i of footer_icon) {   //change all sectiont color dark to white
      //     }
      i.style.color = "white";
    }
  }
};

// Apply the mode on page load
applyMode();

// Toggle mode on click
mode.addEventListener("click", () => {
  mode_code = mode_code === 1 ? 0 : 1;
  localStorage.setItem("mode", mode_code === 1 ? "light" : "dark");
  applyMode();
});


