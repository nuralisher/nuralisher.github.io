let page = document.getElementsByTagName('body')[0];
let canvas = document.getElementById('canvas');
let lastScores = document.getElementById('last-scores');
let bestScoreBox = document.getElementById('best-scores');
let bestScores = document.getElementById('best-scores').children;
let ctx = canvas.getContext('2d');
let width = canvas.width;
let height = canvas.height;

let blocksize = 10;
let widthInBlock = width/blocksize;
let heightInBlock = height/blocksize;
let score = 0;
let checkPoint = 5;
let q = 1;
let speedGame = 80;
let running = true;
let scores = [];
let topScores = [];

let drawBorder = function(){
    ctx.fillStyle = 'gray';
    ctx.fillRect(0,0,width,blocksize);
    ctx.fillRect(0,height-blocksize,width,blocksize);
    ctx.fillRect(0,0,blocksize,height);
    ctx.fillRect(width-blocksize,0,blocksize,height);
};

let drawScore = function(){
    ctx.font = '20px Comic Sans MS';
    ctx.fillStyle = 'red';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillText('Score: '+score, blocksize*2,blocksize*2);
};

let gameOver = function(){
    running = false;
    ctx.font = '60px Comic Sans MS';
    ctx.fillStyle = 'black';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', width/2, height/2-50);
    ctx.font = '30px Comic Sans MS';
    ctx.fillStyle = 'red';
    ctx.fillText('Score: '+score,width/2, height/2);
    ctx.font = '20px Comic Sans MS';
    ctx.fillStyle = 'gray';
    ctx.fillText('Press ENTER to continue ',width/2, height/2+40);
    scores.push(score);
    setScores();
    score = 0;
    checkPoint = 5;
    q = 1;
    speedGame = 80;
    page.onkeydown = function(event){
        if(event.keyCode===13){
            start();
        }
    };
};


let setScores = function(){
    if(scores.length>5){
        let first = lastScores.getElementsByClassName('score')[4];
        lastScores.removeChild(first);
    }

    let score = document.createElement('li');
    score.className = 'score';
    let scoreValue = document.createElement('span');
    scoreValue.className = 'score-value';
    scoreValue.innerHTML = scores[scores.length-1];
    score.appendChild(scoreValue);
    lastScores.prepend(score);
    setBestScores(scores[scores.length-1]);
}

let setBestScores = function(scoreValueNumber){
    topScores.push(scoreValueNumber);
    topScores.sort((a,b)=>b-a);
    topScores = [...new Set(topScores)];

    while(topScores.length>5){
        topScores.pop();
    }

    let i = 0;
    for(let bestScore of bestScores){
        bestScore.getElementsByClassName('score-value')[0].innerHTML = topScores[i]
        i++;
    }

    for(let j = i; j<topScores.length;j++){
        let li = document.createElement('li');
        li.className = 'score';
        let scoreValue = document.createElement('span');
        scoreValue.className = 'score-value';
        if(j==0){
            scoreValue.id = 'best';
        }
        scoreValue.innerHTML = topScores[j];
        li.appendChild(scoreValue);
        bestScoreBox.appendChild(li);
    }
}


let Block = function(col, row){
    this.col = col;
    this.row = row;
};

var circle = function(x,y,r,fillCircle){
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,false);
    if(fillCircle){
        ctx.fill();
    }else{
        ctx.stroke();
    }
};

Block.prototype.drawSquare = function(color){
    let x = this.col*blocksize;
    let y = this.row*blocksize;
    ctx.fillStyle = color;
    ctx.fillRect(x,y,blocksize,blocksize);
};

Block.prototype.drawCircle = function(color){
    let x = this.col*blocksize + blocksize/2;
    let y = this.row*blocksize + blocksize/2;
    ctx.fillStyle = color;
    circle(x,y,blocksize/2 , true);
};

Block.prototype.isEqual = function(other){
    return this.col===other.col && this.row===other.row;
};

let Snake = function(){
    this.segments = [
        new Block(7,5),
        new Block(6,5),
        new Block(5,5),
        new Block(4,5),
        new Block(3,5),
    ]
    this.direction = 'right';
    this.nextDirection = 'right';
};

Snake.prototype.draw = function(){
    this.segments[0].drawSquare('green');
    for(let i =1 ; i<this.segments.length; i++){
        this.segments[i].drawSquare('lime');
    }
};

Snake.prototype.move = function(){
    let head = this.segments[0];
    let newHead;
    this.direction = this.nextDirection;

    if(this.direction==='right'){
        newHead = new Block(head.col+1, head.row);
    }else if(this.direction==='left'){
        newHead = new Block(head.col-1, head.row);
    }else if(this.direction==='up'){
        newHead = new Block(head.col, head.row-1);
    }else if(this.direction==='down'){
        newHead = new Block(head.col, head.row+1);
    }

    if(this.checkCollision(newHead)){
        gameOver();
        return;
    }

    this.segments.unshift(newHead);

    if(apple.position.isEqual(newHead)){
        score++;
        while(this.isInSegment(apple.position)){
            apple.generate();
        }
        if(score===checkPoint){
            if(speedGame>40){
                checkPoint+=q*5;
                speedGame-=10;
                q++;
                console.log('SpeedGame: ' + speedGame);
            }
        }
    }else{
        this.segments.pop();
    }
};
//chekpoint => 5, 10,20,35,55 
//let checkpoint = 5; ch+i*5; i++ ; ch+i*5
Snake.prototype.isInSegment = function(block){
    let result = false;
    for(let i = 0 ; i<this.segments.length; i++){
        if(this.segments[i].isEqual(block)){
            result = true;
        }
    }
    return result;
};

Snake.prototype.checkCollision = function(head){
    let leftCollision = (head.col===0);
    let topCollision = (head.row===0);
    let rightCollision = (head.col===widthInBlock-1);
    let bottomCollision = (head.row===heightInBlock-1);

    let wallCollision = leftCollision||topCollision||rightCollision||bottomCollision;

    let selfCollision = false;
    for(let i =0; i<this.segments.length; i++){
        if(head.isEqual(this.segments[i])){
            selfCollision = true;
        }
    }
    return wallCollision||selfCollision;
};

Snake.prototype.setDirection = function(newDirection){
    if(this.direction==='up' && newDirection==='down'){
        return;
    }else if(this.direction==='left' && newDirection==='right'){
        return;
    }else if(this.direction==='down' && newDirection==='up'){
        return;
    }else if(this.direction==='right' && newDirection==='left'){
        return;
    }

    this.nextDirection = newDirection;
};

let Food = function(){
    this.position = new Block(10,10);
};

Food.prototype.draw = function(){
    this.position.drawCircle('red');
};

Food.prototype.generate = function(){
    let c = Math.floor(Math.random()*(widthInBlock-2))+1;
    let r = Math.floor(Math.random()*(heightInBlock-2))+1;
    this.position = new Block(c,r);
}

let directions = {
    37:'left',
    38:'up',
    39:'right',
    40:'down'
};

let run = function(){
    ctx.clearRect(0,0,width,height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
    if(running){
        setTimeout(run , speedGame);
    }
}

let snake = new Snake();
let apple = new Food();

let start = function(){
    ctx.clearRect(0,0,width,height);
    drawBorder();
    ctx.textAlign = 'center';
    ctx.font = '26px Comic Sans MS';
    ctx.fillStyle = 'green';
    ctx.fillText('Press ENTER to Start ',width/2, height/2);


    page.onkeydown = function(event){
        if(event.keyCode===13){
            running = true;
            snake = new Snake();
            apple = new Food();
            run();

            page.onkeydown = function(event){
                var newDirection = directions[event.keyCode];
                if(newDirection!==undefined){
                    snake.setDirection(newDirection);
                }
            };
        }
    };
};

start();
