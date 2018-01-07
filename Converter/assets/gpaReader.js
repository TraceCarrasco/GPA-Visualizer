function gpaReader(d) {
    this.doc = d;
    this.formatted = "SEMESTER,DEPARTMENT,NAME,COURSE NUMBER,SECTION,# GRADES,AVE. GPA,A,AB,B,BC,C,D,F,S,U,CR,C,P,I,NW,NR,OTHER\n";
}

gpaReader.prototype.isLetter = function(i) {
    if((i >= 65 && i <= 90) || (i >= 97  && i <= 122))
        return true;
    return false;
}

gpaReader.prototype.readDoc = function() {
    for(var i = 0; i < this.doc.length; i++) {
        var line = this.doc[i].trim();
        // Empty Line
        if(line === "" || line === null)
            return;
        // Adding Deparment
        this.addSemester();
        this.addDepartment();
        // Title of Class
        if(this.isLetter(line.charCodeAt(0))) {
            var lineSplit = line.split(" ");
            // Total (means there are multiple lectures for this class)
            if(lineSplit.includes("Total") && lineSplit.includes("Course")) {
                var classInfo = this.getClassInfo(i,line);
                var classParentLine = this.formattedLineRelative(i,-1);
                var classParentNumber = this.getClassNumberFromLine(classParentLine);
                this.classTotalRead(line.split(" "),classInfo,classParentNumber);
            }
            // Only 1 lecture
            else {
                this.singleSectionRead(lineSplit);
            }
        } 
        // Section Number (i.e. this is one of multiple sections)
        else {
            var classInfo = this.getClassInfo(i,line);
            this.multipleSectionRead(line.split(" "), classInfo);
        }
    }
    return this.formatted;
}

gpaReader.prototype.getClassNumberFromLine = function(line) {
    var i = 0;
    while(this.isLetter(line[i].charCodeAt(0))) {
        i++;
    }
    return line[i];
}

gpaReader.prototype.formattedLineRelative = function(curr,i) {
    if (curr+i < 0 || curr+i >= this.doc.length)
        return null;
    var temp = this.formatted.split("\n");
    return temp[curr+i].split(",");
}

gpaReader.prototype.classTotalRead = function(line,parentCourseName, parentCourseNumber) {
    this.addRow(parentCourseName);
    // Getting the line number
    var lineNumber = this.formatted.split("\n").length;
    var classNumberAbove = this.formatted.split("\n")[lineNumber-2];
    this.addRow(classNumberAbove.split(",")[3]); // Course Number
    var start = parentCourseName.split(" ").length+2;
    this.addRow("NULL"); // Section
    this.addRow(line[start]); // Number of Grades
    // *** redacted info because of too few grades
    if(!this.redacted(line[start+1])) {
        // for credit/no GPA
        if(line[start+1] === ".")
            this.addRow("NULL");
        // has GPA
        else   
            this.addRow(line[start+1]);
        this.readGrades(line.splice(start+2));
    } 
}

gpaReader.prototype.getClassInfo = function(i,line) {
    for(var j = i; j < this.doc.length; j++) {
        if(this.isLetter(this.doc[j].charCodeAt(0))) {
            var name = "";
            var k = 0;
            var currLine = this.doc[j].split(" ");
            while(this.isLetter(currLine[k].charCodeAt(0))) {
                name += currLine[k];
                if(this.isLetter(currLine[k+1].charCodeAt(0)))
                    name += " ";
                k++;
            }
            // Cutting out "COURSE TOTAL"
            return name.substring(0,name.length-13);
        }
    }
    return "NULL";
}

gpaReader.prototype.addSemester = function() {
    this.formatted += fileName.split(":")[1];
}

gpaReader.prototype.addDepartment = function() {
    this.formatted += "," + fileName.split(":")[0];
}

gpaReader.prototype.getClassName = function(line) {
    while(isLetter(line[i].charCodeAt(0))) {
        this.formatted += line[i];
        if(isLetter(line[i+1].charCodeAt()))
            this.formatted += " ";
        i++;
    }
}

gpaReader.prototype.formatSection = function(section) {
    var temp = "";
    while(section.length + temp.length < 3)
        temp += "0";
    return temp + section;
}

gpaReader.prototype.multipleSectionRead = function(line, parentCourse) {
    this.addRow(parentCourse);
    this.addRow(line[0]); // Course Number
    this.addRow(this.formatSection(line[1])); // Section
    this.addRow(line[2]); // Number of Grades
    // *** redacted info because of too few grades
    if(!this.redacted(line[3])) {
        // for credit/no GPA
        if(line[3] === ".")
            this.addRow("NULL");
        // has GPA
        else   
            this.addRow(line[3]);
        this.readGrades(line.splice(4));
    } 
}

gpaReader.prototype.singleSectionRead = function(line) {
    // Getting class name
    var i = 0;
    this.formatted += ",";
    while(this.isLetter(line[i].charCodeAt(0))) {
        this.formatted += line[i];
        if(this.isLetter(line[i+1].charCodeAt()))
            this.formatted += " ";
        i++;
    }
    this.addRow(line[i]); // Course Number
    this.addRow(this.formatSection(line[i+1])); // Section
    this.addRow(line[i+2]); // Number of Grades
    // *** redacted info because of too few grades
    if(!this.redacted(line[i+3])) {
        // for credit/no GPA
        if(line[i+3] === ".")
            this.addRow("NULL");
        // has GPA
        else   
            this.addRow(line[i+3]);
        this.readGrades(line.splice(i+4));
    } 
}
gpaReader.prototype.redacted = function(GPA) {
    if (GPA === "***") {
        this.formatted += ",NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL\n"
        return true;
    }
    else 
        return false;
}

gpaReader.prototype.addRow = function(row) {
    this.formatted += "," + row;
}

gpaReader.prototype.readGrades = function(grades) {
    var count = 0;
    grades.forEach(function(grade) {
        if(grade === ".")
            this.addRow("NULL");
        else {
            this.addRow(grade);
        }
        count++;
    }.bind(this));
    while(count < 16) {
            this.addRow("NULL");
        count++;
    }
    this.formatted += "\n";
}