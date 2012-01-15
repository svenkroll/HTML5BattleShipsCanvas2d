function checkSupported() {
    canvas_player = document.getElementById('canvas_player');
    canvas_bot = document.getElementById('canvas_bot');
    canvas_menue = document.getElementById('canvas_menue');
    
    if (canvas_player.getContext){
        init();
    } else {
      // Canvas is not supported
      alert("We're sorry, but your browser does not support the canvas tag. Please use any web browser other than Internet Explorer.");
    }
 }

function gameLoop(){
    checkWon();
    draw();
}

function checkWon(){
    if (shipsleft_bot == 0){
        playerWon = true;
        isEnd = true;
    }
    else{
        if (shipsleft_player == 0){
            botWon = true;
            isEnd = true;

        }
    }
    
}



function draw(){
    //draw the menue
    ctx_m.fillStyle = "rgb(0,0,0)";
    ctx_m.fillRect (0,0,canvas_menue.width, canvas_menue.height);
    ctx_m.font = "12pt Arial"; 
    ctx_m.fillStyle = "rgb(255,255,255)";
    ctx_m.fillText("Ships bot: " + shipsleft_bot, 10, 20);
    ctx_m.fillText("Ships player: " + shipsleft_player, 10, 40);
    
    ctx_m.fillStyle = "rgb(150,29,28)";
    ctx_m.fillRect (buttonRestart.x, buttonRestart.y, buttonRestart.width, buttonRestart.height);
    ctx_m.fillStyle = "rgb(255,255,255)";
    ctx_m.fillText("Restart" , buttonRestart.x + 5, buttonRestart.y + 20);

    //draw the playerGrid 
    for (var i = 0; i < rows; i ++) {
                for (var j = 0; j < cols; j ++ ) {
                    playerGrid[i][j].draw(ctx_p);       
                }
        }
    //draw the KiGrid 
    for (i = 0; i < rows; i ++) {
                for (j = 0; j < cols; j ++ ) {
                    botGrid[i][j].draw(ctx_b);       
                }
        }
    

    if (isEnd && !animationRunning){
        var message = "";
        if ( playerWon){
            message = "You win!";
        }
        else{
            message = "Loooser!";
        }

        ctx_m.fillStyle = "rgb(185,211,238)";
        ctx_m.fillRect (10, 100, 120, 120);
        ctx_m.font = "18pt Arial"; 
        ctx_m.fillStyle = "rgb(0,0,0)";
        ctx_m.fillText(message , 15, 160);     
    }else {
        //draw isTurn Image
        if (!playerTurn){
            ctx_m.fillStyle = "rgb(185,211,238)";
            ctx_m.fillRect (10, 120, 120, 60);
            ctx_m.font = "18pt Arial"; 
            ctx_m.fillStyle = "rgb(0,0,0)";
            ctx_m.fillText("Bot's turn" , 15, 160);
        }else{
            ctx_m.fillStyle = "rgb(185,211,238)";
            ctx_m.fillRect (10, 120, 120, 60);
            ctx_m.font = "18pt Arial"; 
            ctx_m.fillStyle = "rgb(0,0,0)";
            ctx_m.fillText("Your turn" , 15, 160);
        }
    }
  
}

function getRandom(min, max) {
 if(min > max) {
  return -1;
 }
 
 if(min == max) {
  return min;
 }
 
 var r;
 
 do {
  r = Math.random();
 }
 while(r == 1.0);
 
 return min + parseInt(r * (max-min+1));
}

function initButtons(){
    buttonRestart = new Object();
    buttonRestart.x = 20;
    buttonRestart.y = 450;
    buttonRestart.width = 100;
    buttonRestart.height = 25;
}

function initImages(){
    imgShip = new Image();
    imgShip.src = 'img/ship_1.gif';
    
    imgExplode = new Array();
    for (var i = 0; i < 17; i++ ) {
        imgExplode[i] = new Image();
        imgExplode[i].src = 'img/explode_' + i + '.gif';
    }
}

function initGrids(){
    playerGrid = Array();       
        for (var i = 0; i < rows; i ++) {
                var row = new Array;
               
                for (var j = 0; j < cols; j ++ ) {
                        row[j] = new Block( i, j);
                }
                playerGrid[i] = row;
        }
        
     // Initialize KiGrid
        botGrid = Array();
        for (i = 0; i < rows; i ++) {
                row = new Array;
              
                for (j = 0; j < cols; j ++ ) {
                        row[j] = new Block( i, j );
                }       
                botGrid[i] = row;
        }
        
     //Place the ships
     //small
     var tx;
     var ty;
     for (i = 0; i < ships_small; i++){
         do {
             tx = getRandom(0,rows - 1);
             ty = getRandom(0,cols - 1);
         }while(playerGrid[tx][ty].isSet)
         playerGrid[tx][ty].isSet = true;
         //playerGrid[tx][ty].colour = "rgb(30,144,255)";
         ships_player[i]= new smallShip(playerGrid[tx][ty]);
         shipsleft_player++;
     }
     for (i = 0; i < ships_small; i++){
         do {
             tx = getRandom(0,rows - 1);
             ty = getRandom(0,cols - 1);
         }while(botGrid[tx][ty].isSet)
         botGrid[tx][ty].isSet = true;
         //botGrid[tx][ty].colour = "rgb(30,144,255)";
         ships_bot[i]= new smallShip(botGrid[tx][ty]);
         shipsleft_bot++;
     }
}

function init() {
    //CanvasContext
        ctx_p = canvas_player.getContext('2d');
        ctx_b = canvas_bot.getContext('2d');
        ctx_m = canvas_menue.getContext('2d');
    
    //Load Buttons
        initButtons();

    //Load Images
        initImages();
    
    //Ship Specs
        ships_small=3;
        
        ships_player = Array();
        ships_bot = Array();
        shipsleft_player = 0;
        shipsleft_bot = 0;
        
    //Grid specs
	rows = 16;
	cols = 16;
	blockSpacing = 1;
        blockWidth = 30;
        
    //Some gameflow variables
        playerTurn = true;
        isPaused = false;
        animationRunning = false;
        playerWon = false;
        botWon = false;
        isEnd = false;

    // Do some maths to speed up the calculations later
	totalBlockWidth = blockWidth + blockSpacing;
	halfBlockWidth = Math.floor( totalBlockWidth / 2 );
        
    // Initialize playerGrid
        initGrids();
     
     //Set mouse listener
     canvas_menue.onmousedown = function(e) {
            mouse_x = e.clientX - canvas_menue.offsetLeft;
            mouse_y = e.clientY - canvas_menue.offsetTop; 
            checkCanvasMenueClicked();
        }
     canvas_player.onmousedown = function(e) {
            mouse_x = e.clientX - canvas_player.offsetLeft;
            mouse_y = e.clientY - canvas_player.offsetTop; 
            checkCanvasPlayerClicked();
        }
     canvas_bot.onmousedown = function(e) {
            mouse_x = e.clientX - canvas_bot.offsetLeft;
            mouse_y = e.clientY - canvas_bot.offsetTop; 
            checkCanvasBotClicked();
        }
     // Start the game loop
     interval = setInterval(gameLoop,100);

}

function restart(){
    shipsleft_player = 0;
    shipsleft_bot = 0;    
    initGrids();
    playerTurn = true;
    isPaused = false;
    animationRunning = false;
    playerWon = false;
    botWon = false;
    isEnd = false;
}

function checkCanvasMenueClicked()
{
    //Button Restart clicked?
    if ((mouse_x > buttonRestart.x) && (mouse_x < (buttonRestart.x + buttonRestart.width))){
        //within horizon, test vertical
        if ((mouse_y > buttonRestart.y) && (mouse_y < (buttonRestart.y + buttonRestart.height))){
            restart();
        }
    }
}
function checkCanvasPlayerClicked()
{
    
}
function checkCanvasBotClicked()
{
    if (!animationRunning && !isEnd){       
        for (var i = 0; i < rows; i ++) {       
            for (var j = 0; j < cols; j ++ ) {
                    if ( mouse_x > botGrid[i][j].xPixel && mouse_x < (botGrid[i][j].xPixel + blockWidth)){
                        if ( mouse_y > botGrid[i][j].yPixel && mouse_y < (botGrid[i][j].yPixel + blockWidth)){
                            if (botGrid[i][j].isSet){
                                if ( !botGrid[i][j].isFound){
                                     //botGrid[i][j].colour = "rgb(200,10,120)";
                                botGrid[i][j].isFound = true;
                                shipsleft_bot--;
                                //draw explosion animation
                                animationRunning = true;
                                animationPos = 0;
                                animationBlock = botGrid[i][j];
                                aniVal = setInterval(explode, 30);
                                
                                }                           
                            }else{
                                botGrid[i][j].colour = "rgb(120,120,120)";
                            }
                            return;
                        }
                    }           
            }

        }
    }
}

function explode(){
    if (animationPos == 17){
        animationRunning = false;
        animationBlock.isSet = false;
        clearInterval(aniVal);
    }else{
        animationBlock.image = imgExplode[animationPos];
        animationPos++;
    }
    
}

function Block(x, y){
    this.x = x;
    this.y = y;
    this.xPixel = x * totalBlockWidth;
    this.yPixel = y * totalBlockWidth;
    this.colour = "rgb(30,144,255)";
    
    this.isSet = false;
    this.isFound = false;
    this.image = imgShip;
    
    this.draw = function(ctx) {
        ctx.fillStyle = this.colour;
        ctx.fillRect(this.xPixel, this.yPixel, blockWidth, blockWidth);
        if (this.isSet){
            ctx.drawImage(this.image, this.xPixel, this.yPixel, blockWidth,blockWidth);
        }    
    }
}

function smallShip(block){
    this.block = block;
}