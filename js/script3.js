var timetable = [
    {
        "number": 214,
        "name": "Рита",
        "timetable": {
            "30.04.2018": [
                "14:00",
                "23:00"
            ]
        }
    },
    {
        "number": 187,
        "name": "Лиза",
        "timetable": {
            "30.04.2018": [
                "14:00",
                "23:00"
            ]
        }
    },
    {
        "number": 69,
        "name": "Екатерина",
        "timetable": {
            "30.04.2018": [
                "14:00",
                "23:00"
            ]
        }
    },
    {
        "number": 230,
        "name": "Никита",
        "timetable": {
            "30.04.2018": [
                "8:00",
                "18:00"
            ]
        }
    }
];
var diagram = document.querySelector(".diagram");

var generateTimetable = function (timetable) {
    var timeValuesList = document.createElement("ul");
    timeValuesList.classList.add("diagram__time-lines");
    for (var i = 8; i < 20; i++) {
        var timeValueItem = document.createElement("li");
        timeValueItem.classList.add("diagram__time-value");
        timeValueItem.textContent = i;
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

        var timeblockClass = "diagram__time-block--" + timetable[i]["number"];
        var timeblock = document.createElement("div");
        timeblock.classList.add("diagram__time-block", timeblockClass);

        timeline.appendChild(timeblock);
        listItem.appendChild(crewName);
        listItem.appendChild(timeline);
        crewList.appendChild(listItem);
    }

    diagram.appendChild(timeValuesList);
    diagram.appendChild(crewList);
};

generateTimetable(timetable);

interact('.diagram__time-block')
    .draggable({
        snap: {
            targets: [
                interact.createSnapGrid({x: 88, y: 1, offset: {x: -4.5, y: 0}})
            ],
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
            targets: [
                interact.createSnapGrid({x: 88, y: 30, offset: {x: 0, y: 0}})
            ]
        },
        edges: {left: true, right: true},

        // keep the edges inside the parent
        restrictEdges: {
            outer: 'parent'
        },

        // minimum size
        restrictSize: {
            min: {width: 88, height: 44},
            max: {width: 1056, height: 44}
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