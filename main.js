const aboutMe = document.querySelector(".about-me");
const logo = document.querySelector(".logo h1");
const cube = document.querySelector(".cube-box");
const note = document.querySelector(".note");
const menu = document.querySelector(".menu");
const nav = document.querySelector(".nav");

const pagelinks = document.querySelectorAll(".nav .links");

logo.onclick = function () {
  note.style.display = "flex";
  popoutNote();
  if (nav.classList.contains("active")) {
    menuState();
  }
};

pagelinks.forEach((e) => {
  e.addEventListener("click", () => {
    if (nav.classList.contains("active")) {
      menuState();
    }
  });
});

function popoutNote() {
  let i = 120;
  const intervalId = setInterval(function () {
    note.style.display = "flex";
    note.style.transform = `translateX(${(i -= 2)}%)`;
    if (i === 0) {
      clearInterval(intervalId);
      setTimeout(() => {
        note.style.display = "none";
      }, 3000);
    }
  }, 0);
}
window.onload = function () {
  setTimeout(() => {
    popoutNote();
  }, 2300);
};

// Menu

function updateMenu() {
  if (nav.classList.contains("active") || window.innerWidth < 767) {
    menu.style.display = "flex";
  } else {
    menu.style.display = "none";
  }
}
function menuState() {
  nav.classList.toggle("active");
}

menu.addEventListener("click", function (e) {
  e.stopPropagation();
  menuState();
  updateMenu();
});

// Type writer Function
const txt = `Hi,<nl>I\`m <nl>M<nl>ohammad,<nl>web developer`;
const splitted = txt.split("<nl>");
splitted.forEach(() => {
  const span = document.createElement("span");
  aboutMe.appendChild(span);
});

const inTxt = aboutMe.querySelectorAll("span");
let currentSpan = 0;
typeWriter();
function typeWriter() {
  let i = 0;
  setTimeout(function () {
    const intervalId = setInterval(function () {
      inTxt[currentSpan].innerHTML += splitted[currentSpan][i];
      i++;
      if (currentSpan === 2) {
        inTxt[currentSpan].classList.add("active");
      }
      document.getElementById("typewriter").play();
      if (i === splitted[currentSpan].length) {
        currentSpan++;
        i = 0;
        if (currentSpan === splitted.length) {
          clearInterval(intervalId);
          document.getElementById("typewriter").pause();
        }
      }
    }, 60);
  }, 1500);
}

let isDragging = false;
let startX, startY;
let cubeLeft, cubeTop;

// Add event listeners for desktop and mobile
cube.addEventListener("mousedown", startDragging);
cube.addEventListener("touchstart", startDragging);
document.addEventListener("mousemove", moveCube);
document.addEventListener("touchmove", moveCube);
document.addEventListener("mouseup", stopDragging);
document.addEventListener("touchend", stopDragging);

function startDragging(e) {
  isDragging = true;
  if (e.type === "mousedown") {
    startX = e.clientX;
    startY = e.clientY;
  } else {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }
  cubeLeft = parseInt(window.getComputedStyle(cube).getPropertyValue("left"));
  cubeTop = parseInt(window.getComputedStyle(cube).getPropertyValue("top"));
}

function moveCube(e) {
  if (isDragging) {
    let dx, dy;
    if (e.type === "mousemove") {
      dx = e.clientX - startX;
      dy = e.clientY - startY;
    } else {
      dx = e.touches[0].clientX - startX;
      dy = e.touches[0].clientY - startY;
    }
    if (window.innerWidth <= 767) {
      const maxX = window.innerWidth - cube.offsetWidth;
      const maxY = window.innerHeight - cube.offsetHeight;
      cube.style.left = Math.max(0, Math.min(cubeLeft + dx, maxX)) + "px";
      cube.style.top = Math.max(0, Math.min(cubeTop + dy, maxY)) + "px";
    } else {
      cube.style.left = cubeLeft + dx + "px";
      cube.style.top = cubeTop + dy + "px";
    }
  }
  window.addEventListener("resize", () => {
    if (window.innerWidth < 767) {
      cube.style.left = " 80%";
      cube.style.top = "50px";
    }
  });
}

function stopDragging() {
  isDragging = false;
}

// Project slider

const projectsPage = document.querySelector(".projects-page");
const projectsSlider = document.querySelector(".projects-slider");
const projectNum = document.querySelectorAll(".project-num");

for (let i = 0; i < projectNum.length; i++) {
  projectNum[i].onmouseenter = () => {
    projectNum[i].animate(
      [
        {
          transform: `translate(0%, 0%)`,
        },
        {
          transform: `translate(0%, -10%)`,
        },
        {
          transform: `translate(0%, 0%)`,
        },
      ],
      { duration: 1000, direction: "alternate" }
    );
  };
}

const handleOnDown = (e) => {
  projectsSlider.dataset.mouseDownAt = e.clientX;
};

const handleOnUp = () => {
  projectsSlider.dataset.mouseDownAt = "0";
  projectsSlider.dataset.prevPercentage = projectsSlider.dataset.percentage;
};

const handleOnMove = (e) => {
  if (projectsSlider.dataset.mouseDownAt === "0") return;
  const mouseDelta = parseFloat(projectsSlider.dataset.mouseDownAt) - e.clientX;
  const maxDelta = window.innerWidth / 2;
  const percentage = (mouseDelta / maxDelta) * -100;
  const nextPercentageUnconstrained =
    parseFloat(projectsSlider.dataset.prevPercentage) + percentage;

  const nextPercentage = Math.max(
    Math.min(nextPercentageUnconstrained, 0),
    -100
  );
  projectsSlider.dataset.percentage = nextPercentage;
  projectsSlider.animate(
    {
      transform: `translate(${nextPercentage}%, -50%)`,
    },
    { duration: 1200, fill: "forwards" }
  );
};

const handleOnWheel = (e) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? -1 : 1;
  const percentage = delta * 10;
  const prevPercentage = parseFloat(projectsSlider.dataset.prevPercentage);
  const currPercentage = Math.max(
    Math.min(prevPercentage + percentage, 0),
    -100
  );

  projectsSlider.dataset.prevPercentage = currPercentage;
  projectsSlider.animate(
    {
      transform: `translate(${currPercentage}%, -50%)`,
    },
    { duration: 1200, fill: "forwards" }
  );
};

projectsPage.onmousedown = (e) => handleOnDown(e);
projectsPage.ontouchstart = (e) => handleOnDown(e.touches[0]);
projectsPage.onmouseup = (e) => handleOnUp(e);
projectsPage.ontouchend = (e) => handleOnUp(e.touches[0]);
projectsPage.onmousemove = (e) => handleOnMove(e);
projectsPage.ontouchmove = (e) => handleOnMove(e.touches[0]);
projectsSlider.onwheel = (e) => handleOnWheel(e);
