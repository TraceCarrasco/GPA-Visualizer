var fileName = undefined;

function txtReader() {
    bodyHtml();
    var fileInput = document.getElementById('fileInput');
    var fileDisplayArea = document.getElementById('fileDisplayArea');
    var doc = undefined;

    fileInput.addEventListener('change', function (e) {
        var file = fileInput.files[0];
        var textType = /text.*/;
        fileName = file.name.split(".txt")[0];
        if (file.type.match(textType)) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var doc = reader.result.split('\n');
                if (doc === undefined) {
                    alert("ERROR:Could not initiate the file");
                    return;
                }
                var docReader = new gpaReader(doc);                
                var output = docReader.readDoc();

                var maker = new txtFileMaker();
                maker.makeTextFile(output,fileName);

            }
            reader.readAsText(file);
        } else {
            fileDisplayArea.innerText = "File not supported!";
        }
    });
}

function bodyHtml() {
    document.body.innerHTML = document.body.innerHTML 
        + "<input type=\"file\" id=\"fileInput\">"
        + "<br> Must be in .txt form with new lines between each line<br>"
        + "(1) Save pdf and load in adobe<br>"
        + "(2) Copy/Paste into excel (each line should take up 1 cell)<br>"
        + "(3) Save as a csv<br>"
        + "(4) Manually change to .txt<br>"
        + "(5) If it doesn't work, just try again and hope<br>";
}