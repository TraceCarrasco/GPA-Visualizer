function FirebaseUpdater(d) {
    this.doc = d;
    this.db = new Database();
}

FirebaseUpdater.prototype.isLetter = function(i) {
    if((i >= 65 && i <= 90) || (i >= 97  && i <= 122))
        return true;
    return false;
}

FirebaseUpdater.prototype.update = function() {
    // Start at 1 to skip the Column names! End early because last line is empty!!
    for(var i = 1; i < this.doc.length-1; i++) {
        var line = this.doc[i].trim();
        // Empty Line
        if(line === "" || line === null) {
            console.log("***ERROR*** empty line at: " +  i);
        }
        
        line = line.split(",");
        // Checking to make sure there are enough columns in this row  
        if(line.length !== 23)
            console.log("***ERROR*** line:" + i + " not enough columns:\n " + line);
        else {
            this.db.Update(line);
        }    
    }
}