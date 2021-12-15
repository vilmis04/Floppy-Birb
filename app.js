window.addEventListener("DOMContentLoaded", ()=>{

    // Definitions

    const grid = document.querySelector(".grid");
    const birb = document.createElement("div");
    const platform = document.createElement("div");
    let isGameOver = false;
    const birbPosLeft = 35;
    let birbPosBottom = 300;
    let fallTimerID;
    let jumpTimerID;
    let towerTimerID;
    const GAP_SIZE = 250;
    let towerArr = [];
    const TIME_BEFORE_FIRST_TOWER = 1000;
    let generatedTower = false;

    // Classes

    class Tower {
        constructor(height, classStr) {
            this.left = 480;
            this.height = height;
            this.hitbox = document.createElement("div");

            const hitbox = this.hitbox;
            hitbox.classList.add(classStr);
            hitbox.style.height = this.height+"px";
            hitbox.style.left = this.left+"px";
            grid.appendChild(hitbox);
        }
    }

    // Functions

    function createBirb() {
        grid.appendChild(birb);
        birb.classList.add("birb");
        birb.style.bottom = birbPosBottom + "px";
        birb.style.left = birbPosLeft + "%";
        
    }

    function start() {
        if (!isGameOver) {
            createBirb();
            grid.addEventListener("click", delayBeforeJumpUp);
            grid.addEventListener("click", delayBeforeTowers, {once: true});
            towerTimerID = setInterval(moveTowers, 15);
        }
    }

    function jumpUp() {
        clearInterval(fallTimerID);
        const jumpSize = birbPosBottom + 100;
        const jumpIncrement = 10; 
        jumpTimerID = setInterval(() => {
            if (birbPosBottom < jumpSize) {
                birbPosBottom += jumpIncrement;
                birb.style.bottom = birbPosBottom+"px";
            } else {
                fallDown();
            }
        },15);      
    }

    function delayBeforeJumpUp() {
        clearInterval(fallTimerID);
        clearInterval(jumpTimerID);
        setTimeout(jumpUp, 15);
    }

    function fallDown() {
        clearInterval(jumpTimerID);
        let fallIncrement = 5;
        fallTimerID = setInterval(()=>{
            if (birbPosBottom > 65) {
                birbPosBottom -= fallIncrement;
                birb.style.bottom = birbPosBottom+"px";
                fallIncrement += 0.1;
            } else {
                gameOver();
            }
        },15);      

    };

    function gameOver() {
        console.log("Game Over");
            isGameOver = true;
            clearInterval(fallTimerID);
            clearInterval(jumpTimerID);
            clearInterval(towerTimerID);
            grid.removeEventListener("click", delayBeforeJumpUp);
    }

    function createPlatform() {
        platform.classList.add("platform");
        grid.appendChild(platform);
    }

    function delayBeforeTowers() {
        setTimeout(generateTower, TIME_BEFORE_FIRST_TOWER);
    }

    function generateTower() {
        const bottomTowerHeight = Math.round(Math.random()*(500-GAP_SIZE)+65);
        const topTowerHeight = 640-65-GAP_SIZE-bottomTowerHeight;
        const bottomTower = new Tower(bottomTowerHeight, "towerBottom");
        const topTower = new Tower(topTowerHeight, "towerTop");
        towerArr.push(bottomTower);
        towerArr.push(topTower);
    }

    

    function moveTowers() {
        let positionIncrement = 2;
        
        towerArr.forEach(tower => {
            let hitbox = tower.hitbox;
            tower.left -= positionIncrement;
            hitbox.style.left = tower.left + "px";


            if (towerArr[0].left < 215 && !generatedTower) {
                generateTower();
                generatedTower = true;
            }

            if (towerArr[0].left < -100) {
                const bottomTower = towerArr[0].hitbox;
                bottomTower.classList.remove("towerBottom");

                const topTower = towerArr[1].hitbox;
                topTower.classList.remove("towerTop");

                towerArr.shift();
                towerArr.shift();

                generatedTower = false;
            }
        })
    }
    
    // Game

    createPlatform();
    start();


});