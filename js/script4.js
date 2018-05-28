var developingPeriods = {
    "1": {
        "name": "Написание технического задания",
        "time": [1, 6]
    },
    "2": {
        "name": "Написание программы",
        "bonuses": 2000,
        "time": [6, 20]
    },
    "3": {
        "name": "Тестирование программы",
        "time": [15, 22]
    },
    "4": {
        "name": "Внедрение программы",
        "time": [22, 26]
    },
    "5": {
        "name": "Обучение персонала",
        "time": [23, 30]
    }
};

var openHour = 1;
var closeHour = 31;
var diagramLineSize = 1068;
var diagramLineHeight = 54;
var cellSize = diagramLineSize / (closeHour - openHour);
var currentTask = "task4";

// Отображение статуса задания
var setTaskStatus = function (task) {
    document.querySelector(".page-main__is-done--correct").style.display = "none";
    document.querySelector(".page-main__is-done--wrong").style.display = "none";
    document.querySelector(".page-main__is-done--no-result").style.display = "none";

    var storageResult = localStorage.getItem(task);
    var mark;
    switch (storageResult) {
        case "done_correct":
            mark = document.querySelector(".page-main__is-done--correct");
            break;
        case "done_wrong":
            mark = document.querySelector(".page-main__is-done--wrong");
            break;
        default:
            mark = document.querySelector(".page-main__is-done--no-result");
            break;
    }
    mark.style.display = "inline";
};

setTaskStatus(currentTask);

/* Генерация диаграммы из данных выше*/
var diagram = document.querySelector(".diagram");

var generateTimetable = function (timetable) {
    // Шкала времени
    var numberOfCrew = 0;
    for (var crew in timetable) {
        numberOfCrew++;
    }
    var documentHead = document.querySelector("head");
    var headStyle = document.createElement("style");
    headStyle.innerHTML = ".diagram__time-value::after { height: " + (numberOfCrew * diagramLineHeight + 14) + "px;}";
    documentHead.appendChild(headStyle);

    var timeValuesList = document.createElement("ul");
    timeValuesList.classList.add("diagram__time-lines");
    for (var i = openHour; i <= closeHour; i++) {
        if (i !== closeHour) {
            var timeValueItem = document.createElement("li");
            timeValueItem.classList.add("diagram__time-value", "diagram__time-value--task3");
            timeValueItem.textContent = i + "";
            timeValueItem.style.width = cellSize + "px";

            timeValuesList.appendChild(timeValueItem);
        }
    }

    // Список работников
    var crewList = document.createElement("ul");
    crewList.classList.add("diagram__crew-list");
    for (var i in timetable) {

        var listItem = document.createElement("li");
        listItem.classList.add("diagram__crew");

        var crewName = document.createElement("b");
        crewName.classList.add("diagram__crew-name", "diagram__crew-name--no-pointer");
        crewName.textContent = timetable[i]["name"];

        var timeline = document.createElement("div");
        timeline.classList.add("diagram__crew-time");
        timeline.style.width = diagramLineSize + "px";

        var timeblock = document.createElement("div");
        timeblock.classList.add("diagram__time-block", "diagram__time-block--task2");
        timeblock.setAttribute('data-crew-number', i);
        var blockOffset = cellSize * (timetable[i]["time"][0] - openHour);
        timeblock.style.left = blockOffset + "px";
        var blockWidth = cellSize * (timetable[i]["time"][1] - timetable[i]["time"][0]);
        timeblock.style.width = blockWidth + "px";


        timeline.appendChild(timeblock);
        listItem.appendChild(crewName);
        listItem.appendChild(timeline);
        crewList.appendChild(listItem);
    }

    diagram.appendChild(timeValuesList);
    diagram.appendChild(crewList);
};

generateTimetable(developingPeriods);


var checkTask = function () {
    var correctAnswer = 7;
    var userAnswer = document.getElementById("input").value;

    /** Выводим и запоминаем результат **/
        // Убираем сообщения о результате, если такие имеются

    var correctMessage = document.querySelector(".task__result--correct");
    var wrongMessage = document.querySelector(".task__result--wrong");

    correctMessage.style.display = "none";
    wrongMessage.style.display = "none";

    var isCorrect = userAnswer == correctAnswer;
    if (isCorrect) {
        correctMessage.style.display = "block";
        localStorage.setItem(currentTask, "done_correct");
    } else {
        wrongMessage.style.display = "block";
        localStorage.setItem(currentTask, "done_wrong");
    }
    setTaskStatus(currentTask);
};

/*Проверка выполнения задания*/
var checkButton = document.querySelector(".task__button--check-task");
checkButton.addEventListener("click", checkTask);

var inputField = document.getElementById("input");
inputField.addEventListener("keydown", function (e) {
    if (e.keyCode == 13) {
        console.log("hi!");
        checkTask();
    }
});