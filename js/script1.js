var timetable = {
        "214": {
            "name": "Рита",
            "time": [14, 19]
        },
        "187": {
            "name": "Лиза",
            "time": [14, 20]
        },
        "69": {
            "name": "Екатерина",
            "time": [8, 10]
        },
        "230": {
            "name": "Никита",
            "time": [8, 18]
        },
        "60": {
            "name": "Алла",
            "time": [8, 18]
        },
        "217": {
            "name": "Роман",
            "time": [8, 18]
        }
    }
;
var openHour = 8;
var closeHour = 20;
var diagramLineSize = 1068;
var diagramLineHeight = 54;
var cellSize = diagramLineSize / (closeHour - openHour);

/* Генерация диаграммы из данных выше*/
var diagram = document.querySelector(".diagram");

var generateTimetable = function (timetable) {
    // Шкала времени
    var numberOfCrew = 0;
    for(var crew in timetable){
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
        timetable[crewNumber]["time"][0] = timetable[crewNumber]["time"][0] + (event.deltaRect.left / cellSize);
        timetable[crewNumber]["time"][1] = timetable[crewNumber]["time"][0] + (parseInt(target.style.width) / cellSize);
        console.log(timetable[crewNumber]["time"])

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

    timetable[crewNumber]["time"][0] = timetable[crewNumber]["time"][0] + (event.dx / cellSize);
    timetable[crewNumber]["time"][1] = timetable[crewNumber]["time"][1] + (event.dx / cellSize);
    console.log(timetable[crewNumber]["time"])

}

/* Перестановка строк местами */
var el = document.querySelector('.diagram__crew-list');
var sortable = Sortable.create(el, {
    animation: 150,
    filter: ".diagram__time-block",
    handle: ".diagram__crew-name",
    onEnd: function (evt) {
        var itemEl = evt.item;  // dragged HTMLElement
        console.log(evt.to);    // target list
        console.log(evt.from);  // previous list
        console.log(evt.oldIndex);  // element's old index within old parent
        console.log(evt.newIndex);  // element's new index within new parent
    }
});

/*Проверка выполнения задания*/
var checkButton = document.querySelector(".task__button--check-task");
checkButton.addEventListener("click", function () {
    var timeList = document.querySelectorAll(".diagram__crew");
    for (var i = 0; i < timeList.length; i++) {
        var crewNumber = timeList[i].querySelector(".diagram__crew-time").querySelector(".diagram__time-block").dataset.crewNumber;

    }
});