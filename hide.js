

// -------data hide code

//  Right-Click Disable 
document.addEventListener("contextmenu", function(event) {
    event.preventDefault();
  });
  
  // Inspect Element Disable
  document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && (event.key === "u" || event.key === "U")) {
        event.preventDefault();
    }
    if (event.ctrlKey && event.shiftKey && event.key === "I") {
        event.preventDefault();
    }
    if (event.ctrlKey && event.shiftKey && event.key === "J") {
        event.preventDefault();
    }
    if (event.ctrlKey && event.key === "S") {
        event.preventDefault();
    }
    if (event.key === "F12") {
        event.preventDefault();
    }
  });
  // -------data hide code
  