var fileName = undefined;

function txtReader() {
    bodyHtml();
    var fileInput = document.getElementById('fileInput');
    var fileDisplayArea = document.getElementById('fileDisplayArea');
    var doc = undefined;

    fileInput.addEventListener('change', function (e) {
        var file = fileInput.files[0];
        // var textType = /text.*/;
        // HACKY
        var textType = "";
        fileName = file.name.split(".txt")[0];
        if (file.type.match(textType)) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var doc = reader.result.split('\n');
                if (doc === undefined) {
                    alert("ERROR:Could not initiate the file");
                    return;
                }
                var fbUpdater = new FirebaseUpdater(doc);                
                var output = fbUpdater.update();

            }
            reader.readAsText(file);
        } else {
            alert("File not supported!");
        }
    });
}

function bodyHtml() {
    document.body.innerHTML = document.body.innerHTML 
        + "<input type=\"file\" id=\"fileInput\">"
        + "<br> Must be in .txt form with new lines between each line<br>"
        + "(1) Check output from the Coverter";
}