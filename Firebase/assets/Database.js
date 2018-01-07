function Database() { }

Database.prototype.Update = function (c) {

    //"2015-2016 Fall", "cs", "Introduction to Computation", "202", "001", "89", "3.635", "62.9", "20.2", "9.0", "3.4", "2.2", "1.1", "1.1", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL"
    // [0] Term
    // [1] Department
    // [2] Class Name
    // [3] Class Number
    // [4] Lecture/Discussion Number
    // [5] Number of students
    // [6] Average GPA
    // [7]-[13] A,AB,B,BC,C,D,F

    // Special Cases
    // Course Total is NULL
    if(c[4] === "NULL")
        return;
    if(c[6] === "NULL")
        return;
    // Redacted due to 5 students
    // Class is for credit
    

    var firebaseRef = firebase.database().ref(c[1] + "/" + c[3] + "/" + c[0] + "/" + c[4] + "/");
    var lectureNumber = 'lectureNumber';
    var courseName = 'courseName';
    var courseNumber = 'courseNumber';
    var numStudents = 'numStudents';
    var aveGPA = 'aveGPA';
    var grades = 'grades';
    var term = 'term';
    var department = 'department';

    var gradeInfo = convertToIntArray(c.splice(7,7));

    var updateInfo = {
        term: c[0],
        department: c[1],
        courseName: c[2],
        courseNumber: c[3],
        lectureNumber: c[4],
        numStudents: c[5],
        aveGPA: c[6],
        grades: gradeInfo
    };
    firebaseRef.update(updateInfo).catch(function (err) {
        console.log("one of these updates failed", err);
    });
}

Database.prototype.snapshotToArray = function(snapshot) {
    // TODO
};

// baseRef - the base of all the children in Firebase that you want to get
Database.prototype.query = function (baseRef, callback) {
    var ref = firebase.database().ref(baseRef);
    ref.on("value", function (snapshot) {
        callback(snapshot.val());
    }.bind(callback));
}        

Database.prototype
function convertToIntArray(a) {
    var n = [];
    for(var i = 0; i < a.length; i++)
        if(a[i] !== "NULL")
            n.push(parseFloat(a[i]));
        else
            n.push(null);

    return n;
}

