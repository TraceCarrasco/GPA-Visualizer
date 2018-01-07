function Grapher() {
    // Making sure there aren't multiple graph canvas elements
    if(document.getElementById("GPAgraph") === null)
        $("graph").html("<canvas id=\"GPAgraph\" width=\"450\" height=\"400\"></canvas>");
    this.canvas = document.getElementById('GPAgraph');
    this.context = this.canvas.getContext('2d');
    this.scale = 3;
    this.barWidth = 50;
    this.maxHeight = 350;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

}

Grapher.prototype.Graph = function(info) {
    // Clearing the canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawAxis(this.barWidth,this.maxHeight);
    this.drawBars(info);
    this.drawAveGPA(info.aveGPA + "");
}

Grapher.prototype.drawAveGPA = function drawAveGPA(ave) {
    // A-4.0 - 50
    // AB-3.5 - 100
    // B-3.0 - 150
    // BC-2.5 - 200
    // C-2.0 - 250
    // D-1.0 - 300
    // F-0.0 - 350
    var t = -Math.abs(ave * 100 - Math.round(ave) * 100);
    var x;
    // D-F
    if(ave < 1.0) {
        x = 400;
        t = -t;
    }
    else if(ave < 1.5) {
        x = 300;
    }
    // C-D
    else if(ave <= 2) {
        x = 250;
    }
    // BC-C
    else if(ave < 2.5) {
        x = 200;
    }
    // B-BC
    else if(ave <= 3.0) {
        x = 150;
    }
    // AB-B
    else if(ave < 3.5) {
        x = 150;
        t=-t;
    }
    // A-AB
    else {
        x = 50;
    }

    var numOffset = 0;
    if(ave.length === 1)
        numOffset = 10;
    else if(ave.length === 2)
        numOffset = 6;
    else if(ave.length === 3)
        numOffset = 23;
    else if(ave.length === 4)
        numOffset = 23;
    else if(ave.length === 5)
        numOffset = 25;
    else 
        numOffset = 30;

    this.drawLine(x-t,350,x-t,50);
    this.drawWord(x-t-numOffset,45,ave,15);
}

Grapher.prototype.drawBars = function (info) {
    // Graph data (color/grade to display under bar)
    var d = [
        [50,350,50,"#8FB675","A"],   // A
        [100,350,50,"#C6F298","AB"],   // AB
        [150,350,50,"#FEDD47","B"],     // B
        [200,350,50,"#FCA444","BC"],  // BC
        [250,350,50,"#FA725C","C"],   // C
        [300,350,50,"#EA2F53","D"],   // D
        [350,350,50,"#AD1806","F"]  // F
    ]
    for(var i = 0; i < info.grades.length; i++)
        this.drawBar(d[i][0],d[i][1],d[i][2],info.grades[i]*3,d[i][3],d[i][4]);
}

Grapher.prototype.drawBar = function drawBar(x,y,width,height,color,letter) {
    if(height === undefined) {
        return;
    }
    // Bar
    this.context.beginPath();
    this.context.moveTo(x,y);
    this.context.lineTo(x,y-height);
    this.context.lineTo(x+width,y-height);
    this.context.lineTo(x+width,y);
    this.context.closePath();
    this.fill(color);
    this.context.stroke();
    // Percent Above bar
    var percent = Math.round(height/this.scale * 100) / 100;
    percent += "";
    this.strokeColor("black");
    var percentOffset = 2;
    // 1 number
    if(percent.length === 1)
        percentOffset = 20;
    if(percent.length === 2)
        percentOffset = 15;
    // 2 number
    if(percent.length === 3)
        percentOffset = 13;

    // 3 number
    if(percent.length === 4)
        percentOffset = 8;

    this.drawWord(x+percentOffset,y-height-5,percent,15);
    var offset = 0;
    // 1 letter
    if(letter.length === 1)
        offset = 20;
    // 2 letter
    else
        offset = 15;
    this.drawWord(x+offset,y+20,letter,15);
}

Grapher.prototype.strokeColor = function (color) {
    this.context.fillStyle = color;
}

Grapher.prototype.drawAxis = function (barWidth, maxHeight) {
    // TODO: Make dynamic so width and stuff can vary

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    //this.drawLine(50, 350, 350, 350);
    //drawWord(170,385,"GPAs",20);

    //this.drawLine(50, 350, 50, 50);
    this.drawWord(10, 215, "%", 20);
}

Grapher.prototype.strokerColor = function(c) {
    this.context.strokeStyle = c;
}

Grapher.prototype.drawLine = function(x1,y1,x2,y2) {
    this.context.moveTo(x1,y1);
    this.context.lineTo(x2,y2);
    this.context.stroke();
}

Grapher.prototype.fill = function(color) {
    this.context.fillStyle = color;
    this.context.fill();
}

Grapher.prototype.drawWord = function(x,y,word,size) {
    this.context.font = size + "px Arial";
    this.context.fillStyle = "black";
    this.context.fillText(word,x,y);
}