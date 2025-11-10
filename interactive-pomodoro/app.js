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
  if (!element) return;

  // Find the header inside this window (prefer .windowheader). If no header, do not enable dragging.
  const header = element.querySelector('.windowheader') || document.getElementById(element.id + 'header');
  if (!header) return;

  let startX = 0;
  let startY = 0;
  let origLeft = 0;
  let origTop = 0;

  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    header.classList.add('grabbing');

    // record starting positions
    startX = e.clientX;
    startY = e.clientY;
    origLeft = element.offsetLeft;
    origTop = element.offsetTop;

    document.addEventListener('pointermove', elementDrag);
    document.addEventListener('pointerup', stopDragging);
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    element.style.left = (origLeft + dx) + 'px';
    element.style.top = (origTop + dy) + 'px';
  }

  function stopDragging() {
    header.classList.remove('grabbing');
    document.removeEventListener('pointermove', elementDrag);
    document.removeEventListener('pointerup', stopDragging);
  }

  // Only start dragging from the header
  header.addEventListener('pointerdown', startDragging);
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