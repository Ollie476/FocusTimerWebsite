let timerText;
let startBtn;
let taskInput;
let taskHistory;
let timerSlider;

let currentSeconds;
let setSeconds;

let timerInstance = null;

document.addEventListener("DOMContentLoaded", (event) => {
    timerText = document.getElementById("timer-text");
    startBtn = document.getElementById("start-btn");
    taskInput = document.getElementById("task-input");
    taskHistory = document.getElementById("task-history");
    timerSlider = document.getElementById("timer-slider");

    updateTimer(timerSlider);
    updateTasks();
});

function updateTimer(slider) {
    setSeconds = slider.value * 60;
    const formattedSeconds = formatSeconds(setSeconds);

    timerText.innerText = formattedSeconds;
    document.title = formattedSeconds;
}

function formatSeconds(seconds) {
    const min = parseInt(seconds / 60);
    const sec = seconds % 60;

    const formattedMin = min.toString().padStart(2, '0');
    const formattedSec = sec.toString().padStart(2, '0');

    return `${formattedMin}:${formattedSec}`
}

function timerTick() {
    currentSeconds -= 1;
    timerText.innerText = formatSeconds(currentSeconds);
    document.title = formatSeconds(currentSeconds);

    if (currentSeconds === 0) {
        clearInterval(timerInstance);
        timerInstance = null;
        startBtn.innerText = "claim";
        document.title = "claim..."
    }
}

function toggleTimer() {
    if (currentSeconds === 0) {
        currentSeconds = setSeconds;
        timerText.innerText = formatSeconds(setSeconds);
        startBtn.innerText = "start";
        timerSlider.disabled = false;
        taskInput.disabled = false;
        document.title = timerText.innerText;
        addTaskToCompleted();
        return;
    }

    if (timerInstance !== null){
        clearInterval(timerInstance)
        timerInstance = null;
        const formattedSeconds = formatSeconds(setSeconds);
        timerText.innerText = formattedSeconds;
        document.title = formattedSeconds;
        startBtn.innerText = "start";
        timerSlider.disabled = false;
        taskInput.disabled = false;
    }
    else {
        currentSeconds = setSeconds;
        timerInstance = setInterval(timerTick, 1000);
        startBtn.innerText = "reset";
        timerSlider.disabled = true;
        taskInput.disabled = true;
    }
}

function addTaskToCompleted() {
    let taskValue = taskInput.value.trim();

    if (taskValue.length === 0) {
        taskValue = "(no note)";
    }

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let focusedTime = parseInt(setSeconds / 60);

    if (focusedTime === 1)
        focusedTime = focusedTime.toString() + " min";
    else
        focusedTime = focusedTime.toString() + " mins";

    const taskInfo = [new Date().toLocaleDateString("en-gb"), taskValue, focusedTime];
    tasks.push(taskInfo);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskInput.value = "";
    updateTasks();
}

function updateTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if (!tasks) {
        return;
    }
    taskHistory.innerHTML = "";
    for (let i = tasks.length-1; i >= 0; i--) {
        const task = tasks[i];
        taskHistory.innerHTML += `
        <div class="complete-task">
            <p>${task[0]}</p>
            <p>${task[1]}</p>
            <p>${task[2]}</p>
        </div>`;
    }
}