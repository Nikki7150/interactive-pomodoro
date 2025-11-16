const laptopImg = document.getElementById('laptop');
const windowImg = document.getElementById('window');
const laptopContainer = document.querySelector('.laptop-container');
const windowContainer = document.querySelector('.window-container');
const backgroundContainer = document.querySelector('.background-container');
const backButton = document.getElementById('back');

// ----------------------------------------------------------------------------------------------------------------------------------------
// Animation of zooming in
// ----------------------------------------------------------------------------------------------------------------------------------------

let isAnimating = false;

function zoomInAnimation() {
  if (isAnimating) return;
  if (!laptopContainer || !backgroundContainer || !laptopImg) {
    console.error('zoomInAnimation: required elements missing', { laptopContainer, backgroundContainer, laptopImg });
    return;
  }
  isAnimating = true;

    // Start zoom-in animation on the positioned container
    laptopContainer.classList.add('zoom-in');
    windowContainer.style.display = 'none';
    backgroundContainer.classList.add('zoom-in');

    // After the zoom completes, change background and hide elements
    const onTransitionEnd = (e) => {
        if (e.propertyName !== 'transform') return; // only act on transform end
        laptopContainer.removeEventListener('transitionend', onTransitionEnd);
        backgroundContainer.removeEventListener('transitionend', onTransitionEnd);

        // Change the HTML element's background image and show back button
        document.documentElement.style.backgroundImage = "url('/assets/pomodoro.jpeg')";
        backButton.style.display = 'inline';

        // Hide both the laptop and window images
        laptopContainer.style.display = 'none';
        backgroundContainer.style.display = 'none';
        container.style.display = 'block';
        // allow future transitions (the UI is now showing the computer screen)
        isAnimating = false;
    };

    laptopContainer.addEventListener('transitionend', onTransitionEnd);
    backgroundContainer.addEventListener('transitionend', onTransitionEnd);
}

// Click event for laptop image
if (laptopImg) {
  laptopImg.addEventListener('click', () => {
    zoomInAnimation();
  });
} else {
  console.error('laptopImg element not found; click handler not attached');
}

// ----------------------------------------------------------------------------------------------------------------------------------------
// Computer turn on
// ----------------------------------------------------------------------------------------------------------------------------------------

const container = document.getElementById('computer-screen');
container.addEventListener('click', () => {
    container.classList.add('open');
});

// ----------------------------------------------------------------------------------------------------------------------------------------
// laptop time update
// ----------------------------------------------------------------------------------------------------------------------------------------

function updateTIME() {
    var currentTime = new Date().toLocaleString();
    var timeText = document.querySelector("#timeElement");
    timeText.innerHTML = currentTime;
}

setInterval(updateTIME, 1000);

// ----------------------------------------------------------------------------------------------------------------------------------------
// making windows draggable
// ----------------------------------------------------------------------------------------------------------------------------------------

// Make element draggable
dragElement(document.getElementById("pomodoro"));
dragElement(document.getElementById("todolist"));

// Robust dragElement: clamps using getBoundingClientRect against #computer-screen
function dragElement(element) {
  if (!element) return;

  const container = document.getElementById('computer-screen') || element.offsetParent;
  if (!container) return;

  const header = element.querySelector('.windowheader') || document.getElementById(element.id + 'header');
  if (!header) return; // only allow drag via header

  let startX = 0;
  let startY = 0;
  let origElemRect = null;
  let containerRect = null;

  function onPointerDown(e) {
    e.preventDefault();
    header.classList.add('grabbing');

    // get initial pointer coords
    startX = e.clientX;
    startY = e.clientY;

    // measure rects in viewport coords
    origElemRect = element.getBoundingClientRect();
    containerRect = container.getBoundingClientRect();

    // convert element to pixel-left/top relative to container and remove centering transform
    const leftRelative = origElemRect.left - containerRect.left;
    const topRelative = origElemRect.top - containerRect.top;
    element.style.left = leftRelative + 'px';
    element.style.top = topRelative + 'px';
    element.style.transform = 'none';

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp, { once: true });
  }

  function onPointerMove(e) {
    e.preventDefault();
    const clientX = e.clientX;
    const clientY = e.clientY;

    const dx = clientX - startX;
    const dy = clientY - startY;

    // new element top-left in client coordinates
    let newLeftClient = origElemRect.left + dx;
    let newTopClient = origElemRect.top + dy;

    // clamp to container's client rect so element stays fully inside
    const minLeftClient = containerRect.left;
    const maxLeftClient = containerRect.right - origElemRect.width;
    const minTopClient = containerRect.top;
    const maxTopClient = containerRect.bottom - origElemRect.height;

    newLeftClient = Math.max(minLeftClient, Math.min(maxLeftClient, newLeftClient));
    newTopClient = Math.max(minTopClient, Math.min(maxTopClient, newTopClient));

    // convert back to container-relative pixels
    const leftRelative = newLeftClient - containerRect.left;
    const topRelative = newTopClient - containerRect.top;

    element.style.left = leftRelative + 'px';
    element.style.top = topRelative + 'px';
  }

  function onPointerUp() {
    header.classList.remove('grabbing');
    document.removeEventListener('pointermove', onPointerMove);
  }

  header.addEventListener('pointerdown', onPointerDown);
}

// ----------------------------------------------------------------------------------------------------------------------------------------
// Windows functionality
// ----------------------------------------------------------------------------------------------------------------------------------------

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
    minuteDiv.textContent = '1';
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

// ----------------------------------------------------------------------------------------------------------------------------------------
// Pomodoro functionality
// ----------------------------------------------------------------------------------------------------------------------------------------

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
    const popup5 =  document.getElementById('popup5');
    popup5.classList.add('active'); 

    document.getElementById('yes1-btn').addEventListener('click', () => {
      popup5.classList.remove('active');
      container.classList.remove('open');
      container.classList.add('close');
    });
    document.getElementById('no1-btn').addEventListener('click', () => {
      popup5.classList.remove('active');
      minuteDiv.textContent = '1';
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
  // show popup to take a break
  const popup4 =  document.getElementById('popup4');
  popup4.classList.add('active'); 
  // ensure popup overlays sit above any open windows
  popup4.style.zIndex = (biggestZIndex || 1) + 2;

    document.getElementById('ok3-btn').addEventListener('click', () => {
      clearInterval(myInterval);
      isRunning = false;
      totalSeconds = undefined;
      minuteDiv.textContent = '1';
      secondDiv.textContent = '00';
      popup4.classList.remove('active');
    });
    document.getElementById('cancel3-btn').addEventListener('click', () => {
      popup4.classList.remove('active');
    });
}); 

// ----------------------------------------------------------------------------------------------------------------------------------------
// ToDo List functionality
// ----------------------------------------------------------------------------------------------------------------------------------------

const inputBox = document.getElementById("input-box");
const addBtn = document.getElementById("addBtn");
const deleteBtn = document.getElementById("deletebtn");
const listCont = document.getElementById("list-cont");

function addTask() {
  const task = inputBox.value.trim();
  if (!task) {
    // show popup to take a break
  const popup3 =  document.getElementById('popup3');
  popup3.classList.add('active'); 
  popup3.style.zIndex = (biggestZIndex || 1) + 2;

    document.getElementById('ok2-btn').addEventListener('click', () => {
      popup3.classList.remove('active');
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
  const popup1 =  document.getElementById('popup1');
  popup1.classList.add('active'); 
  popup1.style.zIndex = (biggestZIndex || 1) + 2;

    // populate edit input with current task text
    const editInput = document.getElementById('edit-input-box');
    if (editInput) editInput.value = taskSpan.textContent;

    // OK handler: read the edit input value (not the main inputBox)
    const okBtn = document.getElementById('ok-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    if (okBtn) {
      okBtn.addEventListener('click', function onOk() {
        const update = editInput ? editInput.value.trim() : null;
        if (update !== null && update !== "") {
          taskSpan.textContent = update;
          li.classList.remove("completed");
          checkbox.checked = false;
        }
        popup1.classList.remove('active');
      }, { once: true });
    }
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function onCancel() {
        popup1.classList.remove('active');
      }, { once: true });
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
  popup.style.zIndex = (biggestZIndex || 1) + 2;

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

inputBox.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    addTask();
  }
});

if (deleteBtn) {
  deleteBtn.addEventListener('click', deleteAllTasks);
}

// ----------------------------------------------------------------------------------------------------------------------------------------
// Back button code - has to work anywhere with specific popups for each occasion
// ----------------------------------------------------------------------------------------------------------------------------------------

isAnimating = false;
backButton.addEventListener('click', () => {
  // check if pomodoro is running
  if(isRunning) {
    alert("Please pause or reset the Pomodoro timer before going back.");
    return;
  }
  // check if todo list has items
  if(listCont.children.length > 0) {
    alert("Please delete all tasks from the To-Do List before going back.");
    return;
  }
  // maybe try to check if any of the other popups are open?
  container.style.display = 'none';
  //document.documentElement.style.backgroundImage = "url('/assets/desk.jpeg')";
  laptopContainer.style.display = 'block';
  windowContainer.style.display = 'block';
  backgroundContainer.style.display = 'block';
  backButton.style.display = 'none';

  // Start zoom-in animation on the positioned container
  laptopContainer.classList.remove('zoom-in');
  backgroundContainer.classList.remove('zoom-in');
  windowContainer.classList.remove('zoom-in');
  windowContainer.style.display = 'block';
  // ensure we can zoom in again after zooming out
  isAnimating = false;
});

// Click event for laptop image
laptopImg.addEventListener('click', () => {
    zoomInAnimation();
});

// ----------------------------------------------------------------------------------------------------------------------------------------
// window click handler to zoom in to break page
// ----------------------------------------------------------------------------------------------------------------------------------------

let isWindowAnimating = false;

function zoomWindowInAnimation() {
  /*if (isWindowAnimating) {
    console.debug('zoomWindowInAnimation: already animating');
    return;
  }

  if (!laptopContainer || !windowContainer || !backgroundContainer) {
    console.error('zoomWindowInAnimation: missing required containers', { laptopContainer, windowContainer, backgroundContainer });
    return;
  }

  console.debug('zoomWindowInAnimation: start');*/
  isWindowAnimating = true;

  // Start zoom-in animation on the positioned container
  laptopContainer.classList.add('zoom-down');
  windowContainer.classList.add('zoom-in');
  backgroundContainer.classList.add('zoom-in');

    // After the zoom completes, change background and hide elements
  const onTransitionEnd = (e) => {
    // Only act on the transform transition to avoid duplicate calls
    if (e.propertyName !== 'transform') return;
    

    // remove listeners from all three targets
    laptopContainer.removeEventListener('transitionend', onTransitionEnd);
    backgroundContainer.removeEventListener('transitionend', onTransitionEnd);
    windowContainer.removeEventListener('transitionend', onTransitionEnd);

    // Show back button
    if (backButton) backButton.style.display = 'inline';

    // Hide both the laptop and background images and show the computer screen
    laptopContainer.style.display = 'none';
    backgroundContainer.style.display = 'none';
    window.location.href = "/break.html";
    //container.style.display = 'block';

    // allow future transitions
    isWindowAnimating = false;
  };

  laptopContainer.addEventListener('transitionend', onTransitionEnd);
  backgroundContainer.addEventListener('transitionend', onTransitionEnd);
  windowContainer.addEventListener('transitionend', onTransitionEnd);
}


windowContainer.addEventListener('click', () => {
  zoomWindowInAnimation();
});
