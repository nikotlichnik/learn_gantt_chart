var timetable = [
    {
        "number": 214,
        "name": "Рита",
        "time": [14, 19]
    },
    {
        "number": 187,
        "name": "Лиза",
        "time": [14, 20]
    },
    {
        "number": 69,
        "name": "Екатерина",
        "time": [8, 10]
    },
    {
        "number": 230,
        "name": "Никита",
        "time": [8, 18]
    }
];
var openHour = 8;
var closeHour = 20;

var diagram = document.querySelector(".diagram");

var generateTimetable = function (timetable) {
    var timeValuesList = document.createElement("ul");
    timeValuesList.classList.add("diagram__time-lines");
    for (var i = openHour; i <= closeHour; i++) {
        var timeValueItem = document.createElement("li");
        timeValueItem.classList.add("diagram__time-value");
        timeValueItem.textContent = i + ":00";
        timeValueItem.style.width = "89px";
        i == closeHour ? timeValueItem.style.width = "12px" : {};
        timeValuesList.appendChild(timeValueItem);
    }

    var crewList = document.createElement("ul");
    crewList.classList.add("diagram__crew-list");
    for (var i = 0; i < timetable.length; i++) {

        var listItem = document.createElement("li");
        listItem.classList.add("diagram__crew");

        var crewName = document.createElement("b");
        crewName.classList.add("diagram__crew-name");
        crewName.textContent = timetable[i]["number"] + " " + timetable[i]["name"];

        var timeline = document.createElement("div");
        timeline.classList.add("diagram__crew-time");
        timeline.style.width = "1068px";

        var timeblockClass = "diagram__time-block--" + timetable[i]["number"];
        var timeblock = document.createElement("div");
        timeblock.classList.add("diagram__time-block", timeblockClass);
        var blockOffset = 89 * (timetable[i]["time"][0] - openHour);
        timeblock.style.left = blockOffset + "px";
        var blockWidth = 89 * (timetable[i]["time"][1] - timetable[i]["time"][0]);
        timeblock.style.width = blockWidth + "px";
        console.log(blockWidth);

        timeline.appendChild(timeblock);
        listItem.appendChild(crewName);
        listItem.appendChild(timeline);
        crewList.appendChild(listItem);
    }

    diagram.appendChild(timeValuesList);
    diagram.appendChild(crewList);
};

generateTimetable(timetable);

var timeBlockContainer = document.querySelector('.diagram__crew-time');

var gridTarget = interact.createSnapGrid({
    x: 89,
    y: 44 ,
    offset: {x: 0, y: 0}
});


interact('.diagram__time-block')
    // .origin({
    //     x: timeBlockContainer.offsetLeft,
    //     y: timeBlockContainer.offsetTop
    // })
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
            min: {width: 89, height: 44},
            max: {width: 1068, height: 44}
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
        target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
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

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    target.textContent = event.dx + " " + event.dy;
}


var el = document.querySelector('.diagram__crew-list');
var sortable = Sortable.create(el, {
    animation: 150,
    filter: ".diagram__time-block",
    handle: ".diagram__crew-name"
});