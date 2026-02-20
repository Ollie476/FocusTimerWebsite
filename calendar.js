let calendarCells;
let monthSelector;
let focusTimeText;
let taskHistory;

const currentDate = new Date();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
let currentMonthIdx = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

document.addEventListener("DOMContentLoaded", (event) => {
    calendarCells = document.getElementById("calendar-cells");
    monthText = document.getElementById("month-text");
    focusTimeText = document.getElementById("focus-time-text");
    taskHistory = document.getElementById("task-history");
    updateMonth();
});

function shiftMonth(shiftForward) {
    if (shiftForward) {
        currentMonthIdx += 1;
        if (currentMonthIdx > 11) {
            currentMonthIdx -= 12;
            currentYear += 1;
        }
    }
    else {
        currentMonthIdx -= 1;
        if (currentMonthIdx < 0) {
            currentMonthIdx += 12;
            currentYear -= 1;
        }
    }

    updateMonth();
}

function updateMonth() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    monthText.innerText = `${months[currentMonthIdx % 12]} ${currentYear}`;
    let dayCount = new Date(currentYear, currentMonthIdx+1, 0).getDate();

    calendarCells.innerHTML = "";
    for (let i = 1; i <= dayCount; i++) {
        let isBlank = true;
        for (let j = 0; j < tasks.length; j++) {
            const task = tasks[j];
            const splitDate = task[0].split("/");
            const month = splitDate[1];
            const year = splitDate[2];

            if (Number(month)-1 !== currentMonthIdx || Number(year) !== currentYear)
                continue;

            const day = splitDate[0];
            console.log(day);

            if (day == i) {
                isBlank = false;
                break;
            }
        }
        calendarCells.innerHTML += `<div onclick='displayFocusTime(this)' class='calendar-cell${isBlank ? " blank-day" : ""}'>${i}</div>`
    }
}

function displayFocusTime(cell)
{
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const monthDay = cell.innerText;

    let focusTime = 0;
    taskHistory.innerHTML = "";

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const splitDate = task[0].split("/");
        const month = splitDate[1];
        const year = splitDate[2];

        if (Number(month)-1 !== currentMonthIdx || Number(year) !== currentYear) {
            continue
        }

        const day = splitDate[0];

        if (day === monthDay) {
            focusTime += Number(task[2].split(" ")[0]);
            taskHistory.innerHTML +=`
                <div class='complete-task'>
                <p>${task[1]}</p>
                <p>${task[2]}</p>
                </div>`;
        }
    }

    focusTimeText.innerText = `${focusTime} ${focusTime <= 1 ? "min" : "mins"} : ${months[currentMonthIdx].slice(0,3)} ${monthDay} ${currentYear}`;

}