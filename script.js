let currentCell; 
let availableFall= 0;
let score = 0;
let moveCounter = 0;

function createMatrix() 
{
    let section = document.getElementsByClassName('grid-container');
    for(i =1 ; i<21; i++){
        let status = {available: 0, value:0}
        //Creating matrix 4x4
        let newCell = document.createElement("div");              
        newCell.className = "grid-container div";
        newCell.id = i;
        newCell.value = status;
        newCell.tabIndex = 0; 

        newCell.addEventListener('keydown', function(e) {
            if (e.key === 'a' || e.key === 'A'){
                keyBoardmove(-1); // Move left
            } else if (e.key === 'd' || e.key === 'D'){
                keyBoardmove(1); // Move right
            }
        });

        section[0].appendChild(newCell);
        console.log(i);
    }
}

function keyBoardmove(dir)
{
    let p = document.getElementById(currentCell);
    let destinity = currentCell + dir;
    let neighborCell = document.getElementById(destinity);
    
    if (neighborCell.value.available === 0) {
        
        neighborCell.value.available = 1;
        neighborCell.value.value = p.value.value;
        neighborCell.textContent = p.textContent;
        neighborCell.focus();
        currentCell = destinity;
        // clear current cell
        p.value.available = 0;
        p.value.value = 0;
        p.textContent = "";

        moveCounter++;
        let counterSpan = document.querySelector('li[name="MovementCount"] span');
        if (counterSpan) {
            counterSpan.textContent = moveCounter;
        }
    }
    return;
}

function getRandomNum()
{
    const list = [2, 4, 8];
    let index = Math.floor(Math.random() * list.length);
    return list[index];    
}


function generateRandomBlock()
{
    let container = document.getElementsByClassName('grid-container');
    let num = getRandomNum();
    let randCell = Math.floor(Math.random() * 4) + 1;

    while (container[randCell].value["available"] === 1){
        //Verify the cell is Empty
        randCell = Math.floor(Math.random() * 4) + 1;              
    }        
    // asign random num generated
    let status = {available: 1, value:num};
        container[randCell].value = status;
        container[randCell].textContent = num;
        currentCell = randCell;  
        document.getElementById(currentCell).focus;  
        pieceCounter();      
}

function fallDown()
{
    let p = document.getElementById(currentCell);
    let currentRow = Math.ceil(parseInt(currentCell) / 4);    
    // last row check
    if (currentRow >= 5 ) {        
        generateRandomBlock();
        return;
    }
    let nextCellId = parseInt(currentCell) + 4;
    let nextCell = document.getElementById(nextCellId);
    
    // check cell below
    if (nextCell.value.available === 0) {
        // Move down
        nextCell.value.available = 1;
        nextCell.value.value = p.value.value;
        nextCell.textContent = p.value.value;
        nextCell.focus;

        // clear current cell
        currentCell = nextCellId;    
        p.value.available = 0;
        p.value.value = 0;
        p.textContent = "";        
                        
    }else if(collision(nextCell,p,nextCell)){
        // detects if two blocks with the same number collide 
    } else {        
        generateRandomBlock();
    }
    checkVerticalMerges();
}

function checkVerticalMerges() {
    // Check for any adyacent collision outside the focus block
    let merged = false;        
    for (let col = 1; col <= 4; col++) {
        for (let row = 1; row <= 4; row++) {
            const currentId = (row - 1) * 4 + col;
            const currentCell = document.getElementById(currentId);
            
            if (currentCell.value.available === 1) {                
                const bottomId = currentId + 4;
                if (bottomId <= 20) {
                    const bottomCell = document.getElementById(bottomId);                                        
                    if (bottomCell.value.available === 1 && bottomCell.value.value === currentCell.value.value) {                        
                        collision(bottomCell, currentCell, bottomId);
                        merged = true;
                    }
                }
            }
        }
    }
    
    return merged;
}

function collision(nextCell,p,nextCellId)
{
    if(nextCell.value.value === p.value.value)
        {            
            nextCell.value.available = 1;            
            let newValue = p.value.value+nextCell.value.value;
            
            nextCell.textContent = newValue;
            nextCell.value.value = newValue;
            score += newValue;
            document.getElementById("score").textContent = score;
            
            nextCell.focus;
            popAnimation(nextCell);

            // clear current cell
            currentCell = nextCellId;    
            p.value.available = 0;
            p.value.value = 0;
            p.textContent = "";      
            pieceCounter();   
        }
}


function popAnimation(cell) {
    cell.classList.remove("pop");

    //Reset animation
    void cell.offsetWidth;

    cell.classList.add("pop");
}


let startTime; 
let timer;     

function startTimer() {
    startTime = Date.now();
    timer = setInterval(updateTimer, 1000); 
}

function updateTimer() {
    let now = Date.now();
    let passed = Math.floor((now - startTime) / 1000); 
    document.getElementById("timer").textContent = timeFormat(passed);
}

function timeFormat(totalSeconds) {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`; 
}

function stopTimer() {
    clearInterval(timer);
    let totalTime = Math.floor((Date.now() - startTime) / 1000);
    let finalTime = timeFormat(totalTime);
}

function pieceCounter() {
    let container = document.getElementsByClassName('grid-container')[0];
    let cells = container.children;
    let total = 0;

    for (let i = 0; i < cells.length; i++) {
        if (cells[i].value.available === 1) {
            total++;
        }
    }

    let pieceSpan = document.querySelector('li[name="TotalPieces"] span');
    if (pieceSpan) {
        pieceSpan.textContent = total;
    }
}

function checkWin() {
    let container = document.getElementsByClassName('grid-container')[0];
    let cells = container.children;

    for (let i = 0; i < cells.length; i++) {
        if (cells[i].value.value === 2048) {
            stopGame("YOU WIN!");
            return true;
        }
    }
    return false;
}

function checkGameOver() {
    let container = document.getElementsByClassName('grid-container')[0];
    let cells = container.children;

    for (let i = 0; i < cells.length; i++) {
        if (!cells[i].value || cells[i].value.value === 0) {
            return false; 
        }
    }
    stopGame("YOU LOSE");
    return true;
}

let gameInterval; // FallDown Interval

function stopGame(message) {
    flag = false;
    clearInterval(gameInterval); //Stops the FallDown
    stopTimer();                 
    if (message) {
        document.getElementById("gameMessage").textContent = message;
    }
}

function resetGame() {
    stopGame("");
    //Reset variables
    score = 0;
    moveCounter = 0;
    let container = document.getElementsByClassName('grid-container')[0];
    let cells = container.children;
    for (let i = 0; i < cells.length; i++) {
        cells[i].value.available = 0;
        cells[i].value.value = 0;
        cells[i].textContent = "";
    }

    document.getElementById("score").textContent = 0;
    document.querySelector('li[name="MovementCount"] span').textContent = 0;
    document.querySelector('li[name="TotalPieces"] span').textContent = 0;
    document.getElementById("gameMessage").textContent = "";
    document.getElementById("timer").textContent = "0:00"
    
    gameLoop();
}

//Reset botton
document.getElementById("btn_reset").addEventListener("click", resetGame);

function gameLoop()
{
    let flag = true;
    startTimer();
    generateRandomBlock();
    
    while(flag){
        gameInterval = setInterval(function() {
        fallDown();  
        checkWin(); 
        checkGameOver();}, 1000);  

        keyBoardmove();
        break;
        }
    }
createMatrix();
document.getElementById(1).focus();
gameLoop()