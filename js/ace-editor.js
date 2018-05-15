// Iframe с результатом
var iframe = document.querySelector(".task__result");


// Редактор HTML
var codeEditorHTML = document.querySelector(".task__editor--html");
codeEditorHTML.style.fontSize = '18px';

var editorHTML = ace.edit("editorHTML");
editorHTML.setTheme("ace/theme/chrome");
editorHTML.session.setMode("ace/mode/html");
editorHTML.setValue("Здесь будет HTML");

var iframeDocument = iframe.contentWindow.document.body;
iframeDocument.innerHTML = "Здесь будет результат";

var onChangeHTML = function () {
    iframeDocument.innerHTML = "";

    var HtmlEditorContent = editorHTML.getValue();
    iframeDocument.innerHTML = HtmlEditorContent;
    console.log(HtmlEditorContent);
};

editorHTML.session.on('change', onChangeHTML);


// Редактор JS
var codeEditorJS = document.querySelector(".task__editor--javascript");
codeEditorJS.style.fontSize = '18px';

var editorJS = ace.edit("editorJS");
editorJS.setTheme("ace/theme/chrome");
editorJS.session.setMode("ace/mode/javascript");
editorJS.setValue("Здесь будет JS");

var userScript = document.createElement("script");
iframeDocument.appendChild(userScript);

var onChangeJS = function () {
    var JsEditorContent = editorJS.getValue();
    //
    // var iframeScript = iframeDocument.querySelector("script");
    // iframeScript.textContent = JsEditorContent;
};

editorJS.session.on('change', onChangeJS);


// Редактор CSS
var codeEditorCSS = document.querySelector(".task__editor--css");
codeEditorCSS.style.fontSize = '18px';

var editorCSS = ace.edit("editorCSS");
editorCSS.setTheme("ace/theme/chrome");
editorCSS.session.setMode("ace/mode/css");
editorCSS.setValue("Здесь будет CSS");

var userStyle = document.createElement("style");
iframeDocument.appendChild(userStyle);

var onChangeCSS = function () {
    var CssEditorContent = editorCSS.getValue();
    //
    // var iframeStyle = iframeDocument.querySelector("style");
    // iframeStyle.textContent = CssEditorContent;
};

editorCSS.session.on('change', onChangeCSS);