var timetable = {
        "60": {
            "name": "Алла",
            "time": [10, 18]
        },
        "69": {
            "name": "Екатерина",
            "time": [15, 20]
        },
        "187": {
            "name": "Лиза",
            "time": [8, 14]
        },
        "214": {
            "name": "Рита",
            "time": [11, 18]
        },
        "217": {
            "name": "Роман",
            "time": [10, 16]
        },

        "230": {
            "name": "Никита",
            "time": [16, 19]
        }
    }
;
var openHour = 8;
var closeHour = 20;
var diagramLineSize = 1068;
var diagramLineHeight = 54;
var cellSize = diagramLineSize / (closeHour - openHour);

// Отображение статуса задания
var setTaskStatus = function(task){
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

setTaskStatus("task1");

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
        var timeValueItem = document.createElement("li");
        timeValueItem.classList.add("diagram__time-value");
        timeValueItem.textContent = i + ":00";
        timeValueItem.style.width = cellSize + "px";
        i == closeHour ? timeValueItem.style.width = "12px" : {};
        timeValuesList.appendChild(timeValueItem);
    }

    // Список работников
    var crewList = document.createElement("ul");
    crewList.classList.add("diagram__crew-list");
    for (var i in timetable) {

        var listItem = document.createElement("li");
        listItem.classList.add("diagram__crew");

        var crewName = document.createElement("b");
        crewName.classList.add("diagram__crew-name");
        crewName.textContent = i + " " + timetable[i]["name"];

        var timeline = document.createElement("div");
        timeline.classList.add("diagram__crew-time");
        timeline.style.width = diagramLineSize + "px";

        var timeblock = document.createElement("div");
        timeblock.classList.add("diagram__time-block");
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

generateTimetable(timetable);


/* Перестановка строк местами */
var el = document.querySelector('.diagram__crew-list');
var sortable = Sortable.create(el, {
    animation: 150,
    filter: ".diagram__time-block",
    handle: ".diagram__crew-name"
});

/*Проверка выполнения задания*/
var checkButton = document.querySelector(".task__button--check-task");
checkButton.addEventListener("click", function () {
    // Убираем сообщения о результате, если такие имеются
    var correctMessage = document.querySelector(".task__result--correct");
    var wrongMessage = document.querySelector(".task__result--wrong");
    correctMessage.style.display = "none";
    wrongMessage.style.display = "none";

    // Получаем список узлов
    var timeList = document.querySelectorAll(".diagram__crew");
    // Переменная правильности результата
    var isCorrect = true;
    // Проходимся по элементам и смотрим
    for (var i = 0; i < timeList.length; i++) {
        var crewNumber = timeList[i].querySelector(".diagram__crew-time").querySelector(".diagram__time-block").dataset.crewNumber;
        var crewBeginTime = timetable[crewNumber]["time"][0];
        if (i == 0) {
            var prevCrewBeginTime = crewBeginTime;
            continue;
        }
        if (crewBeginTime >= prevCrewBeginTime) {
            prevCrewBeginTime = crewBeginTime;
        } else {
            isCorrect = false;
            break;
        }
    }

    if (isCorrect) {
        correctMessage.style.display = "block";
        localStorage.setItem("task1", "done_correct");
    } else {
        wrongMessage.style.display = "block";
        localStorage.setItem("task1", "done_wrong");
    }
    setTaskStatus("task1");
});