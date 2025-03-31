function openTutorial(file, title) {
  // Open code.html with the title as a query parameter
  const tutorialWindow = window.open(
    `code.html?title=${encodeURIComponent(title)}`,
    "_blank"
  );
  if (!tutorialWindow) {
    console.error(
      "Failed to open tutorial window. Please allow popups for this site."
    );
  }
}

// Follower Count Animation
document.addEventListener("DOMContentLoaded", () => {
  const followerCount = document.getElementById("follower-count");
  let count = 0;
  const target = 8594;
  const duration = 4000; // 4 seconds
  const increment = target / (duration / 16); // Increment per frame (60fps)

  const updateCount = () => {
    count += increment;
    if (count >= target) {
      count = target;
      followerCount.innerText = count.toLocaleString(); // Format with commas (e.g., 8,000)
    } else {
      followerCount.innerText = Math.floor(count).toLocaleString();
      requestAnimationFrame(updateCount);
    }
  };

  // Start the animation after a slight delay
  setTimeout(() => {
    requestAnimationFrame(updateCount);
  }, 800);
});

// Add click event to resource cards
document.querySelectorAll(".resource-card").forEach((card) => {
  card.addEventListener("click", () => {
    const category = card.getAttribute("data-category");
    window.location.href = `resources.html?category=${category}`;
  });
});

function openInstagram() {
  window.open(
    "https://www.instagram.com/coder.s?igsh=M2F6Zzd0cDVzMjJh",
    "_blank"
  );
}
// Popup functionality
document.addEventListener("DOMContentLoaded", () => {
  const popupOverlay = document.getElementById("popupOverlay");
  const closePopupBtn = document.getElementById("closePopupBtn");

  // Check if the popup has already been shown in this session
  const hasPopupBeenShown = sessionStorage.getItem("popupShown");

  if (!hasPopupBeenShown) {
    // Show the popup after 3 seconds
    setTimeout(() => {
      popupOverlay.classList.add("active");
      // Mark the popup as shown in this session
      sessionStorage.setItem("popupShown", "true");
    }, 3000);
  }

  // Close the popup when the close button is clicked
  closePopupBtn.addEventListener("click", () => {
    popupOverlay.classList.remove("active");
  });
});
