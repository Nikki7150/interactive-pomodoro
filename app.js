const laptopImg = document.getElementById('laptop');
const windowImg = document.getElementById('window');
const laptopContainer = document.querySelector('.laptop-container');
const windowContainer = document.querySelector('.window-container');
const backgroundContainer = document.querySelector('.background-container');
const pomodoroScreen = document.querySelector('.pomodoro-screen');

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
        pomodoroScreen.classList.add('active');
    };

    laptopContainer.addEventListener('transitionend', onTransitionEnd);
    backgroundContainer.addEventListener('transitionend', onTransitionEnd);
});

const pomoTab = document.getElementById('pomo-tab');
const todoTab = document.getElementById('todo-tab');

pomoTab.disabled = true;
pomoTab.style.cursor = 'default';
/*
pomoTab.addEventListener('click', () => {
    // Enable the pomodoro tab functionality here
    alert('Pomodoro tab clicked');
});*/



todoTab.addEventListener('click', () => {
    //alert('Todo tab clicked');
    // Hide the pomodoro screen
    pomodoroScreen.classList.remove('active');
    // Change the HTML element's background image (matches CSS target)
    document.documentElement.style.backgroundImage = "url('/assets/todolist.jpeg')";
});

/*windowImg.addEventListener('click', () => {
    windowImg.style.display = 'none';
});*/
