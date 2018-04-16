var codeEditor = document.querySelector(".task__editor");
codeEditor.style.fontSize = '18px';

var iframe = document.querySelector(".task__result");

var editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome");
editor.session.setMode("ace/mode/javascript");

var userScript = document.createElement("script");
var iframeDocument = iframe.contentWindow.document;
iframeDocument.querySelector("body").appendChild(userScript);

editor.session.on('change', function (delta) {
    var editorContent = editor.getValue();

    var iframeScript = iframeDocument.querySelector("script");
    iframeScript.textContent = editorContent;
});


