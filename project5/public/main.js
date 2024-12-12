window.onload = () => {
  const images = document.querySelectorAll(".background-image");
  if (images.length === 0) {
    console.error("No images found!");
    return;
  }
  console.log("Images found:", images);
  let currentIndex = 0;
  let blurLevel = 20;
  const blurFadeInterval = 2 * 60 * 1000; // Total time 2 mins to remove blur
  const blurInterval = blurFadeInterval / 20; // Gradual fade step

  // Slider logic to switch active background image
  setInterval(() => {
    console.log("Switching images. Current Index:", currentIndex);
    //hide current image
    images[currentIndex].classList.remove("active");
    //show next image
    currentIndex = (currentIndex + 1) % images.length;
    images[currentIndex].classList.add("active");
    console.log("Active image updated:", images[currentIndex]);
  }, 10000); // Change every 5 seconds

  // Blur reduction logic
  const blurTimer = setInterval(() => {
    blurLevel -= 1;
    console.log("Blur Level:", blurLevel);

    if (blurLevel <= 0) {
      clearInterval(blurTimer);
    }

    images.forEach((img) => {
      img.style.filter = `blur(${blurLevel}px)`;
      console.log("Updated blur for image:", img.style.filter);
    });
  }, blurInterval);
};
