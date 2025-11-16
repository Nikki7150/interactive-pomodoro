// ----------------------------------------------------------------------------------------------------------------------------------------
// making windows draggable
// ----------------------------------------------------------------------------------------------------------------------------------------

// Attach draggable behavior to the affirmation window if present
dragElement(document.getElementById("affirmationWindow"));
dragElement(document.getElementById("drawingWindow"));

// Make an element draggable by its internal header (or the element itself)
function dragElement(element) {
  if (!element) return; // nothing to do

  let initialX = 0, initialY = 0;

  // Prefer a header inside the element, fallback to any element with id ending in 'header', else use the element itself
  const header = element.querySelector('.windowheader') || element.querySelector('[id$="header"]') || element;
  if (!header) return;

  header.style.cursor = header.style.cursor || 'grab';
  header.addEventListener('mousedown', startDragging);

  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    header.classList.add('grabbing');
    initialX = e.clientX;
    initialY = e.clientY;
    document.addEventListener('mousemove', elementDrag);
    document.addEventListener('mouseup', stopDragging, { once: true });
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    const dx = initialX - e.clientX;
    const dy = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    element.style.top = (element.offsetTop - dy) + 'px';
    element.style.left = (element.offsetLeft - dx) + 'px';
  }

  function stopDragging() {
    header.classList.remove('grabbing');
    document.removeEventListener('mousemove', elementDrag);
  }
}

// ----------------------------------------------------------------------------------------------------------------------------------------
// Affirmation window quote generator
// ----------------------------------------------------------------------------------------------------------------------------------------

var quoteList = [
    "Blooming in the rain", 
    "I'll always stay", 
    "Right here, All day", 
    "You're doing great! Ok?"
]

var quotetext = document.getElementById("affirmationText");
var count = 0;
var reset = document.getElementById("resetButton");

if(reset) {
    reset.addEventListener('click', nextQuote);
}

function nextQuote() {
    quotetext.innerHTML = quoteList[count];
    count++;
    if (count >= quoteList.length) {
        count = 0;
    }
}

// ----------------------------------------------------------------------------------------------------------------------------------------
// Drawing app
// ----------------------------------------------------------------------------------------------------------------------------------------

const canvas = document.getElementById("canvas");
const increaseButton = document.getElementById("increase");
const decreaseButton = document.getElementById("decrease");
const sizeElement = document.getElementById("size");
const colorElement = document.getElementById("color");
const clearElement = document.getElementById("clear");
const ctx = canvas.getContext("2d");

let size = 10;
let color = "black";
let x;
let y;
let isPressed = false;

// Draws circle at (x, y) as the brush
const drawCircle = (x, y) => {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
};

// Draws line from (x1, y1) to (x2, y2) as the brush stroke
const drawLine = (x1, y1, x2, y2) => {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 2;
  ctx.stroke();
};

// Updates the size display
const updateSizeOnScreen = () => (sizeElement.innerText = size);

// Event listeners for mouse actions and buttons
canvas.addEventListener("mousedown", (e) => {
  isPressed = true;
  x = e.offsetX;
  y = e.offsetY;
});

canvas.addEventListener("mouseup", (e) => {
  isPressed = false;
  x = undefined;
  y = undefined;
});

// Mouse move event to draw using circle and line functions
canvas.addEventListener("mousemove", (e) => {
  if (isPressed) {
    x2 = e.offsetX;
    y2 = e.offsetY;
    drawCircle(x2, y2);
    drawLine(x, y, x2, y2);
    x = x2;
    y = y2;
  }
});

// Increase and decrease size buttons
increaseButton.addEventListener("click", () => {
  size += 5;
  if (size > 50) size = 50;
  updateSizeOnScreen();
});

decreaseButton.addEventListener("click", () => {
  size -= 5;
  if (size < 5) size = 5;
  updateSizeOnScreen();
});

// Color picker working
colorElement.addEventListener("change", (e) => (color = e.target.value));

// clear button code
clearElement.addEventListener("click", () =>
  ctx.clearRect(0, 0, canvas.width, canvas.height)
);

//-------------------------------------------------------------------------------------------------------------------------------------------------
// App icon functionality
// ----------------------------------------------------------------------------------------------------------------------------------------

const affirmationIcon = document.getElementById("affirmationApp");
const drawingIcon = document.getElementById("drawingApp");

if (affirmationIcon) {
  affirmationIcon.addEventListener("click", () => {
    const affirmationWindow = document.getElementById("affirmationWindow");
    if(affirmationWindow.style.display !== "block") {
      affirmationWindow.style.display = "block";
      affirmationWindow.style.top = "50%";
      affirmationWindow.style.left = "50%";
      affirmationWindow.style.transform = "translate(-50%, -50%)";
    }
    else {
        affirmationWindow.style.display = "none";
    }
  });
}

if (drawingIcon) {
  drawingIcon.addEventListener("click", () => {
    const drawingWindow = document.getElementById("drawingWindow");
    if(drawingWindow.style.display !== "block") {
      drawingWindow.style.display = "block";
      drawingWindow.style.top = "50%";
      drawingWindow.style.left = "50%";
      drawingWindow.style.transform = "translate(-50%, -50%)";
    }
    else {
        drawingWindow.style.display = "none";
    }
  });
}