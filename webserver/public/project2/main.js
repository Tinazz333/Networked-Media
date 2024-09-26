let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let months_num = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

window.onload = () => {
  MinutesGrid = () => {
    const minutesGrid = document.getElementById("minutes_list");
    minutesGrid.innerHTML = "";
    for (let i = 0; i < 60; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      minutesGrid.appendChild(dot);
    }
  };
  updateClock = () => {
    const d = new Date();
    let hours = d.getHours();
    const minutes = d.getMinutes();

    if (hours > 0 && hours <= 12) {
      hours = hours;
    } else if (hours > 12) {
      hours = hours - 12;
    } else if (hours === 0) {
      hours = 12;
    }
    const monthIndex = hours - 1;
    const currentMonth = months[monthIndex];
    const currentMonth_num = months_num[monthIndex];
    console.log(currentMonth);
    document.getElementById("hours").textContent = currentMonth;
    document.getElementById("hours2").textContent = currentMonth_num;

    const popDot = document.querySelectorAll(".dot");
    popDot.forEach((dot, index) => {
      if (index < minutes) {
        dot.classList.add("popped-out"); // Pop out dots for past minutes
      } else {
        dot.classList.remove("popped-out"); // Reset
      }
    });
  };
  MinutesGrid();
  setInterval(updateClock, 1000);
  updateClock();
};
