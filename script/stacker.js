//init
var Xpos = -1;
var Ypos = 14;
var ExtraBlue = 2;//extra Blue cube
var GoingRight = 1;
var InGame = 1;//unused
var LvlLength = 15;//lvl length (no limit) (min 15) automatically adapt
var Speed = 130; //initial speed
var AntiSpam = 0;
var CanLose = 0;
var Score_enable = false;
var Score = 0;
var PlayTime = 20;
var Interval_Wtm
var Interval_Ud
var Interval_Tc 
tableCreate();
Board = ArrayCreate(); //init our board




function tableCreate(){
    var body = document.body,
        tbl  = document.createElement('table');
    tbl.id = "Board";
    tbl.style.width  = '35vw';
    tbl.style.height  = '45vw';
    tbl.style.marginLeft = '30vw';
    tbl.style.marginTop = '3vw';

    for(var i = 0; i < 15; i++){ //create row
        var tr = tbl.insertRow();
        for(var j = 0; j < 7; j++){//create column
            var td = tr.insertCell();
            td.style.border = '1px solid black';
            td.style.backgroundColor = "white";
            td.id = "c"+(j+1)+"r"+(i+1);
            }
        }
    
    body.appendChild(tbl);
}


function ArrayCreate(){//create array for logic of the game
    var row = [];
    var column = [];
    
    for (var i = 0; i < 15; i++) {
        column = [];
        for (var j = 0; j < 7; j++) {
        column.push(0);
        }
        row.push(column);
    }
    return row;
}


function UpdateDisplay(){
    
    for (var i = 0; i < 7; i++) {
        if(Board[Ypos][i] ==1){
            var Case = document.getElementById("c"+(i+1)+"r"+(Ypos+1));
            Case.style.backgroundColor="blue";
        }
        else{
            var Case = document.getElementById("c"+(i+1)+"r"+(Ypos+1));
            Case.style.backgroundColor="white";

        }
    }


}


function MoveBlue(x){
    if(x==1){//if we go to right
        Board[Ypos][Xpos-ExtraBlue]=0;
        Xpos+=1;
        Board[Ypos][Xpos]=1;
        if(Xpos-ExtraBlue>=6){
            GoingRight=0;
        }

    }
    else{
        Board[Ypos][Xpos+ExtraBlue]=0;
        Xpos-=1;
        Board[Ypos][Xpos]=1;
        if(Xpos+ExtraBlue<=0){GoingRight=1;}
    }

}


function WhereToMove(){
    if(GoingRight==1){
        MoveBlue(1);
    }
    else{
        MoveBlue(0);
    }
}


function CheckPlacement(){
    var SaveCase = []
    for (var i = 0; i < 7; i++) {
        if(Board[Ypos][i] == 1 && Board[Ypos+1][i] != 1){
            var Case = document.getElementById("c"+(i+1)+"r"+(Ypos+1));
            Case.style.backgroundColor="white";
            Board[Ypos][i] = 0; // change case value in board (needed form lose/win anim)
            SaveCase.push(Case) 
            ExtraBlue -= 1 
            if(ExtraBlue<0){
                Loose();
                setInterval(function(){LastRedBlinking(SaveCase);},500);
            }
        }
    }
    if(InGame && Score_enable){
        Score+=1;
    
    var ScoreDisplay = document.getElementById("score");
    ScoreDisplay.innerHTML="<h1>"+Score+"</h1>";
    }
}


function Loose(){
    InGame = 0;
    AntiSpam=0;
    MakeAllCube("red")
    //clear interval
    clearInterval(Interval_Wtm);
    clearInterval(Interval_Ud);
    clearInterval(Interval_Tc);
}


function LastRedBlinking(SaveCase){
    for (var i = 0; i < (SaveCase.length); i++) {
        if(SaveCase[i].style.backgroundColor == "red" ){
            SaveCase[i].style.backgroundColor="white";
        }
        else{
            SaveCase[i].style.backgroundColor="red";
        }
    }
}


function Win(){
    MakeAllCube("lime",Blinking = true)
    InGame = 0;
    AntiSpam=0;
}


function VictoryAnim(SaveCase){
    for (var i = 0; i < (SaveCase.length); i++) {
        if(SaveCase[i].style.backgroundColor == "lime" ){
            SaveCase[i].style.backgroundColor="white";
        }
        else{
            SaveCase[i].style.backgroundColor="lime";
        }
    }
}


function MakeAllCube(color,Blinking = false){
    var SaveCase = [];
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 7; j++) {
            //Update display
            if(Board[i][j] == 1){
                var Case = document.getElementById("c"+(j+1)+"r"+(i+1));
                if(Blinking){
                    SaveCase.push(Case)
                }
                else{
                    Case.style.backgroundColor=color;
                }
            }
            else{
                var Case = document.getElementById("c"+(j+1)+"r"+(i+1));
                Case.style.backgroundColor="white";

            }
        }
    }
    if (Blinking){
    setInterval(function(){VictoryAnim(SaveCase);},200);
    }
}


function TimeoutCountdown(){
    console.log(PlayTime+"pt");
    PlayTime -= 1;
    var plt = document.getElementById("Playtime");
    plt.innerHTML = "<p id="+"timer"+">"+"Time left &nbsp&nbsp&nbsp"+PlayTime+"s"+"</p>";
    if(PlayTime < 10){
        $("#timer").css("color","red");
    }
    if(PlayTime == 0){
        Loose();
    }

}


function Restart(){
    document.location.reload() // i know ...
}


function LaunchBlue(){
    Interval_Wtm = setInterval(function(){WhereToMove();}, Speed);
    Interval_Ud = setInterval(function(){UpdateDisplay();}, 1);//display updated every 1msec
    Interval_Tc = setInterval(function(){TimeoutCountdown();}, 1000); // -1 to PlayTime every 1 sec
    document.onkeydown = function(){
        if(!InGame){
            Restart();
        }
        if(AntiSpam == 0){
            //clear interval
            clearInterval(Interval_Wtm);
            clearInterval(Interval_Ud);
            clearInterval(Interval_Tc);

            
            if(CanLose && InGame){CheckPlacement();} //you can't loose at first stage
            CanLose = 1;//player can loose after first step
             
            Ypos-=1;//up every movement


            PlayTime = (21); //reset playtime

            TimeoutCountdown(); // display playtime updated

            if(Ypos<0 && InGame){//Stop the game when we are at the top of the board
                Win();
            }
            if(InGame){//to stop the game when you lost
                

                if(Ypos == 11 && ExtraBlue == 2 ||Ypos == 7 && ExtraBlue == 1 ){
                    ExtraBlue -= 1; //when progress in the game even without failure you will lost ExtraBlue
                }
                
                Speed*=0.95; // 5% speed +
                AntiSpam=1;//turn AntiSpam on after a keydown while still in game
                LaunchBlue();
            } 
            
        }
    }
    document.onkeyup = function(){//turn off AntiSpam when the key is up
        if(InGame){AntiSpam=0;} //only when in game
    }
}


//main
LaunchBlue();

alert("test");

