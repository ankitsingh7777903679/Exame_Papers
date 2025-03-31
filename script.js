// script.js

// Function to generate cards dynamically
function generateCards(containerId, course, links) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID "${containerId}" not found!`);
    return;
  }

  for (let i = 1; i <= 6; i++) {
    const card = `
      <div class="col">
        <div class="p-lg-3 p-md-4 p-2 border rounded-3 shadow-lg card">
          <div class="card-icon">
            <i class="fa-solid fa-graduation-cap fw-bolder"></i>
          </div>
          <div>
            <p class="flip-card-head">
              <u>${course}</u>
            </p>
          </div>
          <div>
            <h4 class="flip-card-subhead">
              SEM-${i}
            </h4>
          </div>
          <div>
            <h5 class="flip-card-text">
              Last Year's Exam Papers
            </h5>
          </div>
          <div class="d-flex align-items-center gap-1 cd-link">
            <i class="fa-solid fa-circle-check flip-card-tick"></i>
            <u><a href="${links[i-1]}" target="_blank" class="flip-card-link">View Papers</a></u>
          </div>
        </div>
      </div>
    `;
    container.innerHTML += card;
  }
  console.log(`Cards generated for ${course} in container ${containerId}`);
}

// Links for BCA and B.Com semesters
const bcaLinks = [
  "https://questionbanker.in/bca_sem1",
  "https://questionbanker.in/bca_sem2",
  "https://questionbanker.in/bca_sem3",
  "https://questionbanker.in/bca-sem4-solution",
  "https://questionbanker.in/bca_sem5",
  "https://questionbanker.in/bca_sem6"
];

const bcomLinks = [
  "https://questionbanker.in/bcom_sem1",
  "https://questionbanker.in/bcom_sem2",
  "https://questionbanker.in/bcom_sem3",
  "https://questionbanker.in/bcom_sem4",
  "https://questionbanker.in/bcom_sem5",
  "https://questionbanker.in/bcom_sem6"
];

// Generate cards for BCA and B.Com
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded, generating cards...");
  generateCards('bca-papers', 'BCA', bcaLinks);
  generateCards('bcom-papers', 'B.Com', bcomLinks);
});

// Dark/Light Mode Logic (Unchanged)
const mode = document.querySelector(".mode-icon");
const bodys = document.querySelector(".bodys");
const card = document.querySelectorAll(".card");
const hero_headding = document.querySelectorAll(".hero-text h2");
const hero_para = document.querySelectorAll(".hero-text p");
const hero_sub = document.querySelector(".hero-text h3");
const hero_img = document.querySelectorAll(".hero-img img");
const menu_heading = document.querySelector(".menu-heading");
const contact_form_label = document.querySelectorAll(".form-label");
const contact_form_input = document.querySelectorAll(".form-control");
const footer = document.querySelector(".footer");
const footer_icon = document.querySelectorAll(".media-nav i");

let mode_code = localStorage.getItem("mode") === "dark" ? 0 : 1;

const applyMode = () => {
  const alertModalButton = document.querySelector('.modal-content .btn-close');
  if (mode_code === 1) {
    mode.style.color = "black";
    mode.textContent = "";
    bodys.style.backgroundColor = "white";
    for (let i of hero_headding) {
      i.style.color = "black";
    }
    for (let i of hero_para) {
      i.style.color = "#07251F";
    }
    hero_sub.style.color = "#07251F";
    for (let i of hero_img) {
      i.style.borderRadius = "15px";
    }
    menu_heading.style.color = "black";
    for (let i of contact_form_label) {
      i.style.color = "black";
    }
    for (let i of contact_form_input) {
      i.style.backgroundColor = "white";
    }
    footer.style.color = "black";
    footer.style.borderTop = "1px solid #ccc";
    for (let i of footer_icon) {
      i.style.color = "black";
    }
    alertModalButton.style.backgroundColor = "#3cff00";
  } else {
    bodys.style.backgroundColor = "#07251F";
    mode.style.color = "#3cff00";
    mode.textContent = "";
    for (let i of hero_headding) {
      i.style.color = "#3cff00";
    }
    for (let i of hero_para) {
      i.style.color = "#EAF9E1";
    }
    hero_sub.style.color = "#EAF9E1";
    for (let i of hero_img) {
      i.style.borderRadius = "15px";
    }
    menu_heading.style.color = "white";
    for (let i of contact_form_label) {
      i.style.color = "white";
    }
    for (let i of contact_form_input) {
      i.style.backgroundColor = "#cecece";
    }
    footer.style.color = "#3cff00";
    footer.style.borderTop = "1px solid #3cff00";
    for (let i of footer_icon) {
      i.style.color = "white";
    }
    alertModalButton.style.backgroundColor = "#3cff00";
  }
};

applyMode();

mode.addEventListener("click", () => {
  mode_code = mode_code === 1 ? 0 : 1;
  localStorage.setItem("mode", mode_code === 1 ? "light" : "dark");
  applyMode();
});