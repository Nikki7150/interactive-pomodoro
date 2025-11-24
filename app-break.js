// ----------------------------------------------------------------------------------------------------------------------------------------
// making windows draggable
// ----------------------------------------------------------------------------------------------------------------------------------------

// Attach draggable behavior to the affirmation window if present
const affirmationWindow = document.getElementById("affirmationWindow");
const drawingWindow = document.getElementById("drawingWindow");
const ticTacToeWindow = document.getElementById("ticTacToeWindow");

dragElement(affirmationWindow);
dragElement(drawingWindow);
dragElement(ticTacToeWindow);

// Make an element draggable by its internal header (or the element itself)
function dragElement(element) {
  if (!element) return; // nothing to do

  let startX = 0;
  let startY = 0;
  let elemRect = null;
  let viewportRect = null;

  // Prefer a header inside the element, fallback to any element with id ending in 'header', else use the element itself
  const header = element.querySelector('.windowheader') || element.querySelector('[id$="header"]') || element;
  if (!header) return;

  header.style.cursor = header.style.cursor || 'grab';
  header.addEventListener('mousedown', startDragging);

  function startDragging(e) {
    e.preventDefault();
    header.classList.add('grabbing');
    
    // starting pointer coords
    startX = e.clientX;
    startY = e.clientY;

    // measure rects in viewport coordinates
    elemRect = element.getBoundingClientRect();
    viewportRect = {
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      width: window.innerWidth,
      height: window.innerHeight
    };

    // convert element to pixel-left/top relative to container and remove centering transform
    const leftRelative = elemRect.left - viewportRect.left;
    const topRelative = elemRect.top - viewportRect.top;
    element.style.left = leftRelative + 'px';
    element.style.top = topRelative + 'px';
    element.style.transform = 'none';

    document.addEventListener('mousemove', elementDrag);
    document.addEventListener('mouseup', stopDragging, { once: true });
  }

  function elementDrag(e) {
    e.preventDefault();
    const clientX = e.clientX;
    const clientY = e.clientY;

    if(element.id === "myPet" && petOptionPopup) {
      petOptionPopup.style.display = "none"; // hide pet options if open
    }

    const dx =  clientX - startX;
    const dy = clientY - startY;

    // new element top-left in client coords
    let newLeftClient = elemRect.left + dx;
    let newTopClient = elemRect.top + dy;

    // clamp to viewport's client rect so element stays fully inside
    const minLeftClient = viewportRect.left;
    const maxLeftClient = viewportRect.right - elemRect.width;
    const minTopClient = viewportRect.top;
    const maxTopClient = viewportRect.bottom - elemRect.height;

    newLeftClient = Math.max(minLeftClient, Math.min(maxLeftClient, newLeftClient));
    newTopClient = Math.max(minTopClient, Math.min(maxTopClient, newTopClient));

    // convert back to viewport-relative pixels
    const leftRelative = newLeftClient - viewportRect.left;
    const topRelative = newTopClient - viewportRect.top;
    
    element.style.top = topRelative + 'px';
    element.style.left = leftRelative + 'px';
  }

  function stopDragging() {
    header.classList.remove('grabbing');
    document.removeEventListener('mousemove', elementDrag);

    // Only do fall logic if THIS element is the pet
    if (element.id === "myPet") {
        const rect = element.getBoundingClientRect();

        // Update internal pet positions
        petX = rect.left;
        petY = rect.top;

        // Reset falling speed so it drops smoothly
        fallSpeed = 0;

        // If not touching the ground, resume falling
        if (rect.bottom < window.innerHeight) {
            isFalling = true;
            animateFall();
        }
    }
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
var reset = document.getElementById("reset-Button");

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
clearElement.addEventListener("click", () => {
  if (confirm("Do you want to clear canvas?")) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
});

//-------------------------------------------------------------------------------------------------------------------------------------------------
// Tic Tac Toe game functionality
// ----------------------------------------------------------------------------------------------------------------------------------------

const cells = document.querySelectorAll("[data-cell]");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("resetButton");
let currentPlayer = "X";
let gameActive = true;
const board = ["", "", "", "", "", "", "", "", ""];

// Winning combinations
const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Player's move
function playerMove(cell, index) {
  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add("taken");

  if (checkWinner(currentPlayer)) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = "O";
  statusText.textContent = "Computer's turn";
  setTimeout(computerMove, 500);
}

// Simple AI for the computer's move
function computerMove() {
  let availableCells = board
    .map((value, index) => (value === "" ? index : null))
    .filter(index => index !== null);

  if (availableCells.length === 0) return;

  let randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
  board[randomIndex] = currentPlayer;
  cells[randomIndex].textContent = currentPlayer;
  cells[randomIndex].classList.add("taken");

  if (checkWinner(currentPlayer)) {
    statusText.textContent = `Computer (${currentPlayer}) wins!`;
    gameActive = false;
    return;
  }

  currentPlayer = "X";
  statusText.textContent = "Your turn";
}

// Check for a winner
function checkWinner(player) {
  return winningCombos.some(combo =>
    combo.every(index => board[index] === player)
  );
}

// Reset the game
function resetGame() {
  board.fill("");
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("taken");
  });
  currentPlayer = "X";
  statusText.textContent = "Your turn";
  gameActive = true;
}

// Add event listeners
cells.forEach((cell, index) => {
  cell.addEventListener("click", () => playerMove(cell, index));
});

resetButton.addEventListener("click", resetGame);

//-------------------------------------------------------------------------------------------------------------------------------------------------
// App icon functionality
// ----------------------------------------------------------------------------------------------------------------------------------------

// z-index manager so clicked windows come to front
let topZ = 1;
function bringToFront(el) {
  if (!el) return;
  topZ++;
  el.style.zIndex = topZ;
}

const affirmationIcon = document.getElementById("affirmationApp");
const drawingIcon = document.getElementById("drawingApp");
const ticTacToeIcon = document.getElementById("ticTacToeGame");

if (affirmationIcon) {
  affirmationIcon.addEventListener("click", () => {
    if(affirmationWindow.style.display !== "block") {
      affirmationWindow.style.display = "block";
      affirmationWindow.style.top = "50%";
      affirmationWindow.style.left = "50%";
      affirmationWindow.style.transform = "translate(-50%, -50%)";
      bringToFront(affirmationWindow);
    }
    else {
        affirmationWindow.style.display = "none";
    }
  });
}

if (drawingIcon) {
  drawingIcon.addEventListener("click", () => {
    if(drawingWindow.style.display !== "block") {
      drawingWindow.style.display = "block";
      drawingWindow.style.top = "50%";
      drawingWindow.style.left = "50%";
      drawingWindow.style.transform = "translate(-50%, -50%)";
      bringToFront(drawingWindow);
    }
    else {
        drawingWindow.style.display = "none";
    }
  });
}

if (ticTacToeIcon) {
  ticTacToeIcon.addEventListener("click", () => {
    if(ticTacToeWindow.style.display !== "block") {
      ticTacToeWindow.style.display = "block";
      ticTacToeWindow.style.top = "50%";
      ticTacToeWindow.style.left = "50%";
      ticTacToeWindow.style.transform = "translate(-50%, -50%)";
      bringToFront(ticTacToeWindow);
    }
    else {
        ticTacToeWindow.style.display = "none";
    }
  });
}

// bring to top when interacted with
[affirmationWindow, drawingWindow, ticTacToeWindow].forEach(w => {
  if (!w) return;
  w.addEventListener('mousedown', () => bringToFront(w));
});
/*
// ----------------------------------------------------------------------------------------------------------------------------------------
// Virtual pet functionality
// ----------------------------------------------------------------------------------------------------------------------------------------

// storing the values of the boundary of the viewport (window that is seen)
const viewportLeft = 0;
const viewportTop = 0;
const viewportRight = window.innerWidth;
const viewportBottom = window.innerHeight;

// get the pet element and other variables
const pet = document.getElementById("myPet");
let petX = viewportRight / 2;
let petY = 0;                 // start at the top
let fallSpeed = 4;           // adjust this for smoother / slower fall
let isFalling = false;

const petSpawnButton = document.getElementById("petSpawn");
petSpawnButton.addEventListener("click", () => {
  if(pet.style.display === "block") return; // prevent multiple clicks
    pet.style.display = "block";
    petY = 0;               // reset position
    isFalling = true;       // start falling
    animateFall();          // start animation loop
    // after touches ground, change into gif of it scratching head and standing up.
    // pet.addEventListener('transitionend', () => {
    //     pet.src = "/assets/wolfchan-scratching.gif";
    // });
});

dragElement(pet);

// make pet fall after being spawned
function animateFall() {
    if (!isFalling) return;

    fallSpeed += 0.7;  // accelerates downward like gravity
    petY += fallSpeed;

    // boundary
    if (petY > viewportBottom - pet.offsetHeight) {
        petY = viewportBottom - pet.offsetHeight;
        isFalling = false;       // stop falling when it hits the floor
    }

    pet.style.top = petY + "px";
    pet.style.left = petX + "px";

    if (isFalling) {
      pet.src = "assets/wolfchan-falling.png";
    }
    else {
      pet.src = "assets/wolfchan-walking.png";
    }

    requestAnimationFrame(animateFall);   // repeats smoothly at 60fps
}

const petOptionPopup = document.getElementById("petOptions");

// if pet is right clicked, it goes away
pet.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    pet.style.display = "none";
});

// if pet is clicked once, it barks and gives a small popup with different options
pet.addEventListener("click", () => {
    const barkSound = new Audio('/assets/bark.mp3');
    barkSound.play();
    
    // if pet is on the ground, then show options
    if (isFalling) return; // prevent popup while falling
    if (petOptionPopup.style.display === "block") {
        petOptionPopup.style.display = "none";
        return;
    }
    
    // position popup near pet
    const petRect = pet.getBoundingClientRect();
    petX = petRect.left;
    petY = petRect.top;
    petOptionPopup.style.top = (petY - 70) + "px"; // position above pet
    petOptionPopup.style.left = (petX + pet.offsetWidth + 10) + "px"; // position to the right of pet
    petOptionPopup.style.display = "block";
})
*/

// ----------------------------------------------------------------------------------------------------------------------------------------
// Go back home button functionality
// ----------------------------------------------------------------------------------------------------------------------------------------

const homeButton = document.getElementById("Home");
homeButton.addEventListener("click", () => {
  if (ctx.getImageData(0, 0, canvas.width, canvas.height).data.some(channel => channel !== 0)) {
    alert("Please clear the drawing before going home.");
    return;
  }
  /*
  else if(pet.style.display === "block") {
    alert("Please put away your virtual pet before going home.");
    return;
  }*/
  // check if there is drawing on the canvas
  else if(affirmationWindow.style.display === "block" || drawingWindow.style.display === "block" || ticTacToeWindow.style.display === "block") {
    alert("Please close all open apps before going home.");
    return;
  }
  else {
    window.location.href = "index.html";
  }
});