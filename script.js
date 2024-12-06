// JavaScript to handle button click
const bcaButton = document.getElementById('hero-btn');
const cardLink = document.getElementById('sem-card-1');
const course_title = document.getElementById('course-title')

bcaButton.addEventListener('change', () => {
 
  if(bcaButton.value === "bba"){
    cardLink.href = "bba.html";
    course_title.innerHTML = "Bba"
  }
  else if (bcaButton.value === "bcom") {
    cardLink.href = "bcom.html";
    course_title.innerHTML = "B.com"
  } else {
    cardLink.href = "sem1.html";
    course_title.innerHTML = "Bca"
  }
});
