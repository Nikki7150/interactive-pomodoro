const laptopImg = document.getElementById('laptop');
const windowImg = document.getElementById('window');
const laptopContainer = document.querySelector('.laptop-container');
const windowContainer = document.querySelector('.window-container');
const backgroundContainer = document.querySelector('.background-container');

// ----------------------------------
// Animation of zooming in
// ----------------------------------

let isAnimating = false;

// Click event for laptop image
laptopImg.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;

    // Start zoom-in animation on the positioned container
    laptopContainer.classList.add('zoom-in');
    windowContainer.style.display = 'none';
    //windowContainer.classList.add('zoom-in');
    backgroundContainer.classList.add('zoom-in');

    // After the zoom completes, change background and hide elements
    const onTransitionEnd = (e) => {
        if (e.propertyName !== 'transform') return; // only act on transform end
        laptopContainer.removeEventListener('transitionend', onTransitionEnd);
        backgroundContainer.removeEventListener('transitionend', onTransitionEnd);

        // Change the HTML element's background image (matches CSS target)
        document.documentElement.style.backgroundImage = "url('/assets/pomodoro.jpeg')";

        // Hide both the laptop and window images
        laptopContainer.style.display = 'none';
        backgroundContainer.style.display = 'none';
        
        // Show the pomodoro screen
        
    };

    laptopContainer.addEventListener('transitionend', onTransitionEnd);
    backgroundContainer.addEventListener('transitionend', onTransitionEnd);
});

/*windowImg.addEventListener('click', () => {
    windowImg.style.display = 'none';
});*/

// ----------------------------------
// laptop time update
// ----------------------------------


function updateTIME() {
    var currentTime = new Date().toLocaleString();
    var timeText = document.querySelector("#timeElement");
    timeText.innerHTML = currentTime;
}

setInterval(updateTIME, 1000);

// ----------------------------------
// making windows draggable
// ----------------------------------

// Make element draggable
dragElement(document.getElementById("pomodoro"));
dragElement(document.getElementById("todolist"));

// Step 1: Define a function called `dragElement` that makes an HTML element draggable.
// Make element draggable (safer version)
function dragElement(element) {
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;
  var dragging = false;

  // Prefer a header element inside the window if present
  var header = element.querySelector('.windowheader') || document.getElementById(element.id + "header");

  // Helper to detect interactive targets we should ignore
  function isInteractiveTarget(target) {
    if (!target) return false;
    return !!target.closest('input, button, textarea, select, label, a');
  }

  if (header) {
    header.style.cursor = 'grab';
    header.addEventListener('mousedown', startDragging);
    header.addEventListener('touchstart', startDragging, {passive: false});
  } else {
    // If no header, attach to the element but ignore clicks on interactive children
    element.addEventListener('mousedown', function(e) {
      if (isInteractiveTarget(e.target)) return; // don't start dragging when user clicked an input/button/etc.
      startDragging(e);
    });
    element.addEventListener('touchstart', function(e) {
      if (isInteractiveTarget(e.target)) return;
      startDragging(e);
    }, {passive: false});
  }

  function startDragging(e) {
    e = e || window.event;
    e.preventDefault && e.preventDefault();

    // protect interactive targets (just a second safety)
    if (isInteractiveTarget(e.target)) return;

    dragging = true;
    (header || element).classList && (header || element).classList.add('grabbing');

    // initial positions
    initialX = e.clientX || (e.touches && e.touches[0].clientX);
    initialY = e.clientY || (e.touches && e.touches[0].clientY);

    document.addEventListener('mousemove', elementDrag);
    document.addEventListener('mouseup', stopDragging);
    // touch equivalents
    document.addEventListener('touchmove', elementDrag, {passive: false});
    document.addEventListener('touchend', stopDragging);
  }

  //Top: 40 Left: 290 Width: 709 Height: 474

  function elementDrag(e) {
  if (!dragging) return;
  e = e || window.event;
  e.preventDefault && e.preventDefault();

  var clientX = e.clientX || (e.touches && e.touches[0].clientX);
  var clientY = e.clientY || (e.touches && e.touches[0].clientY);

  currentX = initialX - clientX;
  currentY = initialY - clientY;
  initialX = clientX;
  initialY = clientY;

  let newTop = element.offsetTop - currentY;
  let newLeft = element.offsetLeft - currentX;

  // 🖥️ Hardcoded computerscreen boundaries
  const screenTop = 116;
  const screenLeft = 160;
  const screenWidth = 709;
  const screenHeight = 454;

  const minLeft = screenLeft;
  const minTop = screenTop;
  const maxLeft = screenLeft + screenWidth - element.offsetWidth;
  const maxTop = screenTop + screenHeight - element.offsetHeight;

  // Clamp positions within the screen
  if (newLeft < minLeft) newLeft = minLeft;
  if (newTop < minTop) newTop = minTop;
  if (newLeft > maxLeft) newLeft = maxLeft;
  if (newTop > maxTop) newTop = maxTop;

  element.style.left = newLeft + "px";
  element.style.top = newTop + "px";
}

  function stopDragging() {
    dragging = false;
    (header || element).classList && (header || element).classList.remove('grabbing');

    document.removeEventListener('mousemove', elementDrag);
    document.removeEventListener('mouseup', stopDragging);
    document.removeEventListener('touchmove', elementDrag);
    document.removeEventListener('touchend', stopDragging);
  }
}

// ----------------------------------
// Windows functionality
// ----------------------------------

var pomoscreen = document.getElementById("pomodoro");
var todolistscreen = document.getElementById("todolist");

var pomoclose = document.getElementById("pomoclose");
var todoclose = document.getElementById("todoclose");

var pomoapp = document.getElementById("pomoapp");
var todoapp = document.getElementById("todoapp");

var topBar = document.getElementById("navbar");

var biggestZIndex = 1;

function closeWindow(element) {
    element.style.display = "none";
}

function openWindow(element) {
    element.style.display = "flex";
    biggestZIndex++;
    element.style.zIndex = biggestZIndex;
    if (topBar) topBar.style.zIndex = biggestZIndex + 1;
}

pomoclose.addEventListener("click", function() {
  if(isRunning) {
    if(confirm("Are you sure you want to close the app? This will reset the timer.")) {
    clearInterval(myInterval);
    isRunning = false;
    totalSeconds = undefined;
    minuteDiv.textContent = '25';
    secondDiv.textContent = '00';
    closeWindow(pomoscreen);
  }
  }else {
    closeWindow(pomoscreen);
  }
});

todoclose.addEventListener("click", function() {
    closeWindow(todolistscreen);
});

pomoapp.addEventListener("click", function() {
    openWindow(pomoscreen);
});

todoapp.addEventListener("click", function() {
    openWindow(todolistscreen);
});


pomoscreen.addEventListener("mousedown", function() {
    biggestZIndex++;
    pomoscreen.style.zIndex = biggestZIndex;
    if (topBar) topBar.style.zIndex = biggestZIndex + 1;
});

todolistscreen.addEventListener("mousedown", function() {
    biggestZIndex++;
    todolistscreen.style.zIndex = biggestZIndex;
    if (topBar) topBar.style.zIndex = biggestZIndex + 1;
});

// ----------------------------------
// Pomodoro functionality
// ----------------------------------

//const bells = new Audio('end-bell.wav');
//const beep = document.getElementById('beep-sound');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const pauseBtn = document.getElementById('pauseBtn');
const minuteDiv = document.querySelector('.minutes');
const secondDiv = document.querySelector('.seconds');

let myInterval;
let totalSeconds;
let isRunning = false;

const initTimer = () => {
  const sessionAmount = Number.parseInt(minuteDiv.textContent);
  totalSeconds = sessionAmount * 60;
};

const updateTimerDisplay = () => {
  let minutesLeft = Math.floor(totalSeconds / 60);
  let secondsLeft = totalSeconds % 60;

  minuteDiv.textContent = minutesLeft;
  secondDiv.textContent = secondsLeft < 10 ? '0' + secondsLeft : secondsLeft;
};

const appTimer = () => {
  if (isRunning) {
    alert("Timer is already running!");
    return;
  }

  if (totalSeconds === undefined) {
    initTimer();
  }

 // beep.play();
  isRunning = true;

  myInterval = setInterval(() => {
    if (totalSeconds <= 0) {
      clearInterval(myInterval);
      //bells.play();
      isRunning = false;

      // show popup to take a break
    const popup =  document.getElementById('popup');
    popup.classList.add('active'); 

    document.getElementById('yes-btn').addEventListener('click', () => {
      window.location.href = 'break.html'; // link to break page
    });
    document.getElementById('no-btn').addEventListener('click', () => {
      popup.classList.remove('active');
      minuteDiv.textContent = '25';
      secondDiv.textContent = '00';
      totalSeconds = undefined; // reset for next start
    });
      return;
    }

    totalSeconds--;
    updateTimerDisplay();
  }, 1000);
};

startBtn.addEventListener('click', appTimer);

pauseBtn.addEventListener('click', () => {
  if (!isRunning) return;

  clearInterval(myInterval);
  isRunning = false;
});

resetBtn.addEventListener('click', () => {
  if(confirm("Are you sure you want to reset the timer?")) {
    clearInterval(myInterval);
    isRunning = false;
    totalSeconds = undefined;
    minuteDiv.textContent = '25';
    secondDiv.textContent = '00';
  }
}); 

// ----------------------------------
// ToDo List functionality
// ----------------------------------

const inputBox = document.getElementById("input-box");
const addBtn = document.getElementById("addBtn");
const deleteBtn = document.getElementById("deletebtn");
const listCont = document.getElementById("list-cont");

function addTask() {
  const task = inputBox.value.trim();
  if (!task) {
    // show popup to take a break
    const popup =  document.getElementById('popup');
    popup.classList.add('active'); 
    popup.style.zIndex = 10;

    document.getElementById('yes-btn').addEventListener('click', () => {
      listCont.innerHTML = "";
      popup.classList.remove('active');
    });
    document.getElementById('no-btn').addEventListener('click', () => {
      popup.classList.remove('active');
    });
    return;
  }

  const li = document.createElement("li");
  li.innerHTML = `
  <label>
    <input type="checkbox">
    <span>${task}</span>
  </label>
  <span class="edit-btn">Edit</span>
  <span class="delete-btn">Delete</span>
  `;

  const checkbox = li.querySelector("input");
  const editBtn = li.querySelector(".edit-btn");
  const deleteBtn = li.querySelector(".delete-btn");
  const taskSpan = li.querySelector("span");

  checkbox.addEventListener("click", () => {
    if (checkbox.checked) {
      taskSpan.style.textDecoration = "line-through";
    } else {
      taskSpan.style.textDecoration = "none";
    }
   // updateCounters();
  });

  editBtn.addEventListener("click", function() {
    const update = prompt("Edit task:", taskSpan.textContent);
    if (update !== null) {
      taskSpan.textContent = update;
      li.classList.remove("completed");
      checkbox.checked = false;
      //updateCounters();
    }
  });

  listCont.appendChild(li);
  inputBox.value = "";
  //updateCounters();

  deleteBtn.addEventListener("click", () => {
    li.remove();
    //updateCounters();
  });

}

function deleteAllTasks() {
  // show popup to take a break
    const popup =  document.getElementById('popup');
    popup.classList.add('active'); 
    popup.style.zIndex = 10;

    document.getElementById('yes-btn').addEventListener('click', () => {
      listCont.innerHTML = "";
      popup.classList.remove('active');
    });
    document.getElementById('no-btn').addEventListener('click', () => {
      popup.classList.remove('active');
    });

}

// Wire up ToDo controls (guarding nulls)
if (addBtn) {
  addBtn.addEventListener('click', addTask);
}

if (deleteBtn) {
  deleteBtn.addEventListener('click', deleteAllTasks);
}