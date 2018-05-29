var taskLinkItems = document.querySelectorAll(".task-list__link");

var setStatus = function (linkItem, status) {
    var correctMessage = "✔ выполнено";
    var wrongMessage = "✘ выполнено неверно";
    var notDoneMessage = "✘ ещё не выполнялось";

    var statusMark = document.createElement("small");
    statusMark.classList.add("page-main__is-done", "page-main__is-done--show");

    switch (status) {
        case "0":
            console.log(0);
            statusMark.textContent = notDoneMessage;
            statusMark.classList.add("page-main__is-done--no-result");
            break;
        case "done_correct":
            console.log(1);
            statusMark.textContent = correctMessage;
            statusMark.classList.add("page-main__is-done--correct");
            break;
        case "done_wrong":
            console.log(2);
            statusMark.textContent = wrongMessage;
            statusMark.classList.add("page-main__is-done--wrong");
            break;
    }
    linkItem.appendChild(statusMark);
};

for (var i = 1; i < taskLinkItems.length; i++) {
    var currentTask = "task" + i;
    var status = localStorage.getItem(currentTask) || 0;
    setStatus(taskLinkItems[i], status);

}