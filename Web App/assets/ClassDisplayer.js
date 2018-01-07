function ClassDisplayer() {
    this.classSet = null;
    this.init = false;
    this.grapher = new Grapher();
    this.classes = [
        "202","240","252","270","301","302","304","310",
        "352","354","367","371","402","407","412","425",
        "435","475","506","513","514","520","524","525",
        "532","533","534","536","537","538","540","552",
        "558","559","564","567","570","576","577","579",
        "638","640","642","699"];
    this.displayClassList();
}

ClassDisplayer.prototype.DisplayClassSet = function(classSet) {
    this.classSet = this.snapshotToArray(classSet);
    this.displayOptions();
    this.displayClassTitle();
}

ClassDisplayer.prototype.displayClassList = function() {
    var termDropdown = "Class: <select class='classSelector'>\n";    
    
    for(var i = 0; i < this.classes.length; i++) {
        termDropdown += '<option value="' + this.classes[i] + '">' + this.classes[i] + '</option>\n';
    }

    termDropdown += '\n<select>'
    $(".classOptions").html(termDropdown);

    $(".classOptions").change(function() {
        var ref = firebase.database().ref("cs/" + $('.classSelector').find(":selected").val());
        ref.on("value", function (snapshot) {
            this.DisplayClassSet(snapshot.val());
            this.DisplayGraph();
        }.bind(this));
    }.bind(this));
}

ClassDisplayer.prototype.displayClassTitle = function() {
    $(".classTitle").html("<h2>" + this.classSet[0].classes[0].courseName + "</h2>");

}
ClassDisplayer.prototype.displayOptions = function() {
    // Displaying the HTML
    var termDropdown = "Term: <select class='termSelector'>\n";
    for(var i = 0; i < this.classSet.length; i++) {
        termDropdown += '<option value="' + i + '">' + this.classSet[i].term + '</option>\n';
    }
    termDropdown += '\n<select>'
    $( ".termOptions" ).html(termDropdown);

    if(!this.init) {
        this.DisplayClassesForSelectedTerm();
        this.init = true;
        // TODO: Display graph
        this.DisplayGraph();
    }
    // Onclick event
    $(".termOptions").change(function() {
        this.DisplayClassesForSelectedTerm();
        this.DisplayGraph();
    }.bind(this));

}

ClassDisplayer.prototype.DisplayGraph = function () {
    var term = $('.termSelector').find(":selected").val();
    var lecture =  $('.lectureSelector').find(":selected").val();
    this.grapher.Graph(this.classSet[term].classes[lecture]);
}

ClassDisplayer.prototype.DisplayClassesForSelectedTerm = function() {
    var termIndex = $('.termSelector').find(":selected").val();
    var lectureDropdown = "Lecture: <select class='lectureSelector'>\n";
    for(var i = 0; i < this.classSet[termIndex].classes.length; i++) {
        lectureDropdown += '<option value="' + i + '">' + this.classSet[termIndex].classes[i].lectureNumber + '</option>\n';
    }
    lectureDropdown += '\n<select>'
    $( ".lectureOptions" ).html(lectureDropdown);

    $(".lectureSelector").change(function() {
        this.DisplayGraph();
    }.bind(this));
}


ClassDisplayer.prototype.snapshotToArray = function(snapshot) {
    var tempArr = [];
    var returnArr = [];

    for (var k in snapshot) {
        tempArr.push(snapshot[k]);
        returnArr.push({
            term: k
        });
    }

    for (var i = 0; i < tempArr.length; i++) {
        var semester = tempArr[i];
        var classesInThisSemester = [];
        for (var k in semester) {
             classesInThisSemester.push(semester[k]);
        }
        returnArr[i].classes = classesInThisSemester;
    }
    return returnArr;
};
