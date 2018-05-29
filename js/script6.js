var developingPeriodsAnswer = {
    "1": {
        "name": "Василий",
        "time": {
            "122": {
                "duration": [4, 7]
            },
            "156": {
                "duration": [7, 9]
            },
            "107": {
                "duration": [11, 16]
            }
        }
    },
    "2": {
        "name": "Мария",
        "time": {
            "199": {
                "duration": [6, 9]
            },
            "128": {
                "duration": [9, 11]
            },
            "250": {
                "duration": [13, 16]
            },
            "150": {
                "duration": [16, 18]
            }
        }
    },
    "3": {
        "name": "Константин",
        "time": {
            "168": {
                "duration": [8, 12]
            },
            "195": {
                "duration": [4, 7]
            },
            "219": {
                "duration": [14, 18]
            }
        }
    },
    "4": {
        "name": "Пётр",
        "time": {
            "175": {
                "duration": [5, 7]
            },
            "178": {
                "duration": [11, 14]
            },
            "185": {
                "duration": [15, 18]
            },
            "202": {
                "duration": [9, 11]
            }
        }
    },
    "5": {
        "name": "Дарья",
        "time": {
            "134": {
                "duration": [4, 7]
            },
            "109": {
                "duration": [9, 13]
            }
        }
    }
};
var developingPeriods = {
    "1": {
        "name": "Василий",
        "time": {
            "122": {
                "duration": [4, 7]
            },
            "156": {
                "duration": [7, 9]
            },
            "107": {
                "duration": [11, 16]
            }
        }
    },
    "2": {
        "name": "Мария",
        "time": {
            "199": {
                "duration": [6, 9]
            },
            "128": {
                "duration": [9, 11]
            },
            "250": {
                "duration": [13, 16]
            },
            "150": {
                "duration": [16, 18]
            }
        }
    },
    "3": {
        "name": "Константин",
        "time": {
            "168": {
                "duration": [8, 12]
            },
            "219": {
                "duration": [14, 18]
            }
        }
    },
    "4": {
        "name": "Пётр",
        "time": {
            "175": {
                "duration": [5, 7]
            },
            "178": {
                "duration": [11, 14]
            },
            "185": {
                "duration": [15, 18]
            }
        }
    },
    "5": {
        "name": "Дарья",
        "time": {
            "134": {
                "duration": [4, 7]
            },
            "109": {
                "duration": [9, 13]
            },
            "101": {
                "duration": [14, 18]
            }
        }
    }
};

var openHour = 4;
var closeHour = 18;
var diagramLineSize = 1068;
var diagramLineHeight = 54;
var cellSize = diagramLineSize / (closeHour - openHour);
var currentTask = "task6";

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
            timeValueItem.classList.add("diagram__time-value");
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
        timeline.classList.add("diagram__crew-time", "diagram__crew-time--" + i);
        timeline.style.width = diagramLineSize + "px";

        var tickets = timetable[i]["time"];
        for (var j in tickets) {
            var timeblock = document.createElement("div");
            timeblock.classList.add("diagram__time-block", "diagram__time-block--task6");
            timeblock.setAttribute('data-crew-number', i);
            timeblock.setAttribute('data-ticket-number', j);

            var blockOffset = cellSize * (tickets[j]["duration"][0] - openHour);
            timeblock.style.left = blockOffset + "px";
            var blockWidth = cellSize * (tickets[j]["duration"][1] - tickets[j]["duration"][0]);
            timeblock.style.width = blockWidth + "px";
            timeblock.textContent = "# " + j;


            timeline.appendChild(timeblock);
        }

        listItem.appendChild(crewName);
        listItem.appendChild(timeline);
        crewList.appendChild(listItem);
    }

    diagram.appendChild(timeValuesList);
    diagram.appendChild(crewList);
};

/* Удаление блока тикета с диаграммы */
var setListeners = function () {
    var timeBlocks = document.querySelectorAll(".diagram__time-block");
    for(var i = 0; i < timeBlocks.length; i++){

        var block = timeBlocks[i];
        console.log(block.dataset.crewNumber);
        console.log(block);
        block.addEventListener("dblclick", function (e) {
            var crewNumber = e.target.dataset.crewNumber;
            var ticketNumber = e.target.dataset.ticketNumber;
            e.target.parentNode.removeChild(e.target);
            delete developingPeriods[crewNumber]["time"][ticketNumber];
        });
    }
};

generateTimetable(developingPeriods);
setListeners();

/* Инициализация механизма интерактивности диаграммы */
var gridTarget = interact.createSnapGrid({
    x: cellSize,
    y: 44,
    offset: {x: 0, y: 0}
});


interact('.diagram__time-block')
    .draggable({
        origin: 'parent',
        snap: {
            targets: [gridTarget],
            range: Infinity,
            relativePoints: [{x: 0, y: 0}]
        },
        restrict: {
            restriction: "parent",
            elementRect: {top: 0, left: 0, bottom: 1, right: 1}
        },
        // enable autoScroll
        autoScroll: true,

        // call this function on every dragmove event
        onmove: dragMoveListener
    })
    .resizable({
        snapSize: {
            targets: [gridTarget]
        },
        edges: {left: true, right: true},

        // keep the edges inside the parent
        restrictEdges: {
            outer: 'parent'
        },

        // minimum size
        restrictSize: {
            min: {width: cellSize, height: 44},
            max: {width: diagramLineSize, height: 44}
        }
    })
    .on('resizemove', function (event) {
        var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0),
            y = (parseFloat(target.getAttribute('data-y')) || 0);

        // update the element's style
        target.style.width = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.webkitTransform = target.style.transform =
            'translate(' + x + 'px,' + y + 'px)';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
        // target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);

        var crewNumber = target.dataset.crewNumber;
        var ticketNumber = target.dataset.ticketNumber;
        developingPeriods[crewNumber]["time"][ticketNumber]["duration"][0] = Math.round(developingPeriods[crewNumber]["time"][ticketNumber]["duration"][0] + (event.deltaRect.left / cellSize));
        developingPeriods[crewNumber]["time"][ticketNumber]["duration"][1] = Math.round(developingPeriods[crewNumber]["time"][ticketNumber]["duration"][0] + (parseInt(target.style.width) / cellSize));
        console.log(developingPeriods[crewNumber]["time"][ticketNumber]["duration"])

    })
    .on('dragmove resizestart', function (event) {
        console.log(event.type);
    });


function dragMoveListener(event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
        target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

    // update the position attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    // target.textContent = event.dx + " " + event.dy;

    var crewNumber = target.dataset.crewNumber;
    var ticketNumber = target.dataset.ticketNumber;
    developingPeriods[crewNumber]["time"][ticketNumber]["duration"][0] = Math.round(developingPeriods[crewNumber]["time"][ticketNumber]["duration"][0] + (event.dx / cellSize));
    developingPeriods[crewNumber]["time"][ticketNumber]["duration"][1] = Math.round(developingPeriods[crewNumber]["time"][ticketNumber]["duration"][1] + (event.dx / cellSize));
    console.log(developingPeriods[crewNumber]["time"])
}





/* Добавление блока тикета на диаграмму*/
var assignButton = document.querySelector(".task__button--assign-task");
assignButton.addEventListener("click", function (e) {

    var worker = document.getElementById("workersList").value;
    var ticket = document.getElementById("ticketsList").value;


    developingPeriods[worker]["time"][ticket]= {};
    developingPeriods[worker]["time"][ticket]["duration"] = [openHour, openHour + 1];

    var timeValuesList = document.querySelector(".diagram__time-lines");
    var crewList = document.querySelector(".diagram__crew-list");
    diagram.removeChild(timeValuesList);
    diagram.removeChild(crewList);

    generateTimetable(developingPeriods);
    setListeners();
    console.log(worker);
    console.log(ticket);
    console.log(developingPeriods[worker]["time"][ticket]["duration"]);
});

/*Проверка выполнения задания*/
var assert = chai.assert;
var checkTask = function () {
    /** Выводим и запоминаем результат **/
        // Убираем сообщения о результате, если такие имеются

    var correctMessage = document.querySelector(".task__result--correct");
    var wrongMessage = document.querySelector(".task__result--wrong");

    correctMessage.style.display = "none";
    wrongMessage.style.display = "none";

    var isCorrect = true;
    try {
        assert.deepEqual(developingPeriods, developingPeriodsAnswer);
    }
    catch (err){
        isCorrect = false;
    }

    if (isCorrect) {
        correctMessage.style.display = "block";
        localStorage.setItem(currentTask, "done_correct");
    } else {
        wrongMessage.style.display = "block";
        localStorage.setItem(currentTask, "done_wrong");
    }
    setTaskStatus(currentTask);
};

var checkButton = document.querySelector(".task__button--check-task");
checkButton.addEventListener("click", checkTask);