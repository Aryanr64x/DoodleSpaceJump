const grid = document.querySelector('.grid');
const startButton = document.querySelector('.start-button')
const startDiv = document.querySelector('.start')

const doodler = document.createElement('img')

let doodlerLeftSpace = 50;
let startPoint = 150;
let doodlerBottomSpace = startPoint;
let upTimeId;
let downTimeId;
let isJumping = true
let isGameOver = false;
let isGoingLeft = false;
let isGoingRight = false;
let leftTimeId;
let rightTimeId;
const platforms = [];
let score = 0


const playAudio= async(isGameOver)=>{
   if(isGameOver){
       const audio = new Audio('gameover.mp3');
       await audio.play();
   }else{
       const audio = new Audio('jumpsound.mp3');
       await audio.play();
   }
}

const createDoodler = () => {
    grid.appendChild(doodler);
    doodler.src = "/astr.png";
    doodler.classList.add('doodler')
    doodlerLeftSpace = platforms[0].left
    doodler.style.left = doodlerLeftSpace + 'px';
    doodler.style.bottom = doodlerBottomSpace + 'px';
}

class Platform {
    constructor(platformBottom) {
        this.bottom = platformBottom
        this.left = Math.random() * 315;
        this.visual = document.createElement('div');
        const visual = this.visual;
        visual.classList.add('platform');
        visual.style.left = this.left + 'px';
        visual.style.bottom = this.bottom + 'px';
        grid.appendChild(visual)
    }
}


const createPlatforms = () => {
    for (let i = 0; i < 5; i++) {
        let platformGap = 600 / 5;
        let platformBottom = platformGap * i + 100;
        let newPlatform = new Platform(platformBottom);
        platforms.push(newPlatform);
    }
}

const movePlatforms = () => {
    if (doodlerBottomSpace > 200) {
        platforms.forEach((platform) => {
            platform.bottom -= 4;
            let visual = platform.visual;
            visual.style.bottom = platform.bottom + 'px';
            if(platform.bottom < 10){
                let first = platforms[0].visual;
                first.classList.remove('platform')
                platforms.shift()
                score ++;
                let newPlatform = new Platform(600)
                platforms.push(newPlatform)
            }
        })
    }
}

const jump = () => {
    clearInterval(downTimeId)
    isJumping = true;
    upTimeId = setInterval(() => {
        doodlerBottomSpace += 20;
        doodler.style.bottom = doodlerBottomSpace + 'px';
        if (doodlerBottomSpace > startPoint + 200) {
            fall();
        }
    }, 30)
}

const fall = () => {
    clearInterval(upTimeId);
    isJumping = false;
    downTimeId = setInterval(() => {
        doodlerBottomSpace -= 5;
        doodler.style.bottom = doodlerBottomSpace + 'px';
        if (doodlerBottomSpace <= 0) {
            gameOver();
        }

        platforms.forEach((platform) => {
            if (doodlerBottomSpace >= platform.bottom
                && doodlerBottomSpace <= platform.bottom + 15
                && (doodlerLeftSpace + 60) >= platform.left
                && doodlerLeftSpace <= platform.left + 65 && !isJumping) {
                console.log("Landed")
                startPoint = doodlerBottomSpace;

                jump();
            }
        })
    },)
}

const moveRight = async()=>{

    clearInterval(leftTimeId)
    if(rightTimeId) clearInterval(rightTimeId)
    isGoingLeft = false;
    isGoingRight = true;

    rightTimeId = setInterval(()=>{

            if(doodlerLeftSpace <= 340){

                doodlerLeftSpace += 5

                doodler.style.left = doodlerLeftSpace + 'px'

            }else moveLeft()
    }, 30)
}

const moveLeft = ()=>{

        if(leftTimeId) clearInterval(leftTimeId)

        clearInterval(rightTimeId)

        isGoingRight = false;

    isGoingLeft = true;

    leftTimeId = setInterval(()=>{

        if(doodlerLeftSpace >= 0){

                    doodlerLeftSpace -= 5

                    doodler.style.left = doodlerLeftSpace + 'px'

                }else{

                    moveRight()

                }



    }, 30)
}

const moveStraight = ()=>{
    clearInterval(leftTimeId)
    clearInterval(rightTimeId)
    isGoingLeft  = false;
    isGoingRight = false;

}

const control = (e) => {
    if (e.key === "ArrowLeft") {
        playAudio(false);
        moveLeft();
    } else if (e.key === "ArrowRight") {
            playAudio(false)
            moveRight()
    } else if (e.key === "ArrowUp") {
        moveStraight()
    }


}



const gameOver = () => {
    console.log("GAME IS OVER");
    isGameOver = true;
    clearInterval(upTimeId)
    clearInterval(downTimeId)
    clearInterval(leftTimeId)
    clearInterval(rightTimeId)
    playAudio(true)
    while(grid.firstChild){
        grid.removeChild(grid.firstChild)
    }
    grid.innerHTML = `<span class="score"> Your Score: ${score}</span>`;

}


const start = () => {

    if (!isGameOver) {
        createPlatforms();
        createDoodler();

        setInterval(() => {
            movePlatforms();
        }, 30)

        jump()
        document.addEventListener('keyup',control)
    }
}


grid.style.display = 'none';
startButton.addEventListener('click',()=>{
    console.log("Click Event has been detected")
    startDiv.style.display="none";
    grid.style.display = "block";
    start();
})
