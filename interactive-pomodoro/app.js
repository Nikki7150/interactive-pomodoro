const laptopImg = document.getElementById('laptop');
const windowImg = document.getElementById('window');
const laptopContainer = document.querySelector('.laptop-container');
const windowContainer = document.querySelector('.window-container');
const backgroundContainer = document.querySelector('.background-container');


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
        
  // Reveal the navbar after the intro animation completes
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.classList.add('visible');
    };

    laptopContainer.addEventListener('transitionend', onTransitionEnd);
    backgroundContainer.addEventListener('transitionend', onTransitionEnd);
});



/*windowImg.addEventListener('click', () => {
    windowImg.style.display = 'none';
});*/

function updateTIME() {
    var currentTime = new Date().toLocaleString();
    var timeText = document.querySelector("#timeElement");
    timeText.innerHTML = currentTime;
}

setInterval(updateTIME, 1000);

// Make element draggable
dragElement(document.getElementById("pomodoro"));
dragElement(document.getElementById("todolist"));

// Step 1: Define a function called `dragElement` that makes an HTML element draggable.
function dragElement(element) {
  // Step 2: Set up variables to keep track of the element's position.
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  // Step 3: Check if there is a special header element associated with the draggable element.
  if (document.getElementById(element.id + "header")) {
    // Step 4: If present, assign the `dragMouseDown` function to the header's `onmousedown` event.
    // This allows you to drag the window around by its header.
    document.getElementById(element.id + "header").onmousedown = startDragging;
  } else {
    // Step 5: If not present, assign the function directly to the draggable element's `onmousedown` event.
    // This allows you to drag the window by holding down anywhere on the window.
    element.onmousedown = startDragging;
  }

  // Step 6: Define the `startDragging` function to capture the initial mouse position and set up event listeners.
  function startDragging(e) {
    document.getElementById("pomoheader").classList.add("grabbing");
    e = e || window.event;
    e.preventDefault();
    // Step 7: Get the mouse cursor position at startup.
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 8: Set up event listeners for mouse movement (`elementDrag`) and mouse button release (`closeDragElement`).
    document.onmouseup = stopDragging;
    document.onmousemove = dragElement;
  }

  // Step 9: Define the `elementDrag` function to calculate the new position of the element based on mouse movement.
  function dragElement(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 10: Calculate the new cursor position.
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 11: Update the element's new position by modifying its `top` and `left` CSS properties.
    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }

  // Step 12: Define the `stopDragging` function to stop tracking mouse movement by removing the event listeners.
  function stopDragging() {
    document.getElementById("pomoheader").classList.remove("grabbing");
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

  // Z-index management: bring clicked or opened window to front
  let topZ = 100;
  function bringToFront(el) {
    if (!el) return;
    topZ += 1;
    el.style.zIndex = topZ;
  }

  // Wire up app icons and windows so the most recently opened/clicked window sits on top
  const pomoWindow = document.getElementById('pomodoro');
  const todoWindow = document.getElementById('todolist');
  const pomoAppIcon = document.getElementById('pomoapp');
  const todoAppIcon = document.getElementById('todoapp');

  if (pomoAppIcon) {
    pomoAppIcon.addEventListener('click', () => {
      // show and focus the pomodoro window
      if (pomoWindow) {
        pomoWindow.style.display = 'block';
        bringToFront(pomoWindow);
      }
    });
  }

  if (todoAppIcon) {
    todoAppIcon.addEventListener('click', () => {
      if (todoWindow) {
        todoWindow.style.display = 'block';
        bringToFront(todoWindow);
      }
    });
  }

  // Bring windows to front when clicked/dragged
  [pomoWindow, todoWindow].forEach(win => {
    if (!win) return;
    // pointerdown ensures focus on touch and mouse
    win.addEventListener('pointerdown', () => bringToFront(win));
  });