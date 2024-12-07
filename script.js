// // JavaScript to handle button click
// const bcaButton = document.getElementById('hero-btn');
// const cardLink = document.querySelectorAll('.flip-card a');
// const course_title = document.getElementById('course-title')

// bcaButton.addEventListener('change', () => {
 
//   if(bcaButton.value === "bba"){
//     cardLink.href = "bba.html";
//     course_title.innerHTML = "Bba"
//   }
//   else if (bcaButton.value === "bcom") {
//    function callBcom(){
//     cardLink[0].href = "bcom_sem1.html";
//     cardLink[1].href = "bcom_sem2.html";
//     cardLink[2].href = "bcom_sem3.html";
//     cardLink[3].href = "bcom_sem4.html";
//     cardLink[4].href = "bcom_sem5.html";
//     cardLink[5].href = "bcom_sem6.html";
//     course_title.innerHTML = "B.com"
    
//    }
//    callBcom()
//   } else {
//     cardLink[0].href = "sem1.html";
//     cardLink[1].href = "sem2.html";
//     cardLink[2].href = "sem3.html";
//     cardLink[3].href = "sem4.html";
//     cardLink[4].href = "sem5.html";
//     cardLink[5].href = "sem6.html";
//     course_title.innerHTML = "Bca"
//   }
// });


const bcaButton = document.getElementById('hero-btn');
const cardLink = document.querySelectorAll('.flip-card a');
const course_title = document.getElementById('course-title');

// Restore state from localStorage
document.addEventListener('DOMContentLoaded', () => {
  const savedCourse = localStorage.getItem('selectedCourse');
  if (savedCourse) {
    bcaButton.value = savedCourse; // Set the select value
    updateLinksAndTitle(savedCourse);
  }
});

// Update links and span based on selection
function updateLinksAndTitle(course) {
  if (course === "bba") {
    cardLink.forEach((link, index) => link.href = "bba.html");
    course_title.innerHTML = "BBA";
  } else if (course === "bcom") {
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

