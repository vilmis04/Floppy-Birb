window.addEventListener("DOMContentLoaded", ()=>{

    // Definitions

    const grid = document.querySelector(".grid");
    const birb = document.createElement("div");
    const platform = document.createElement("div");
    const introText = document.createElement("div");
    const score = document.createElement("div");
    let isGameOver = false;
    const birbPosLeft = 168;
    let birbPosBottom = 300;
    let fallTimerID;
    let jumpTimerID;
    let towerTimerID;
    const GAP_SIZE = 250;
    let towerArr = [];
    const TIME_BEFORE_FIRST_TOWER = 1000;
    let generatedTower = false;
    let scoreCounter = 0;
    const storage = window.localStorage;
    let highscore = storage.getItem("highscore");
    highscore = highscore == null ? 0 : highscore;
    let isCounted = false;
    
    // Classes

    class Tower {
        constructor(height, classStr, sideBool) {
            this.left = 480;
            this.height = height;
            this.hitbox = document.createElement("div");
            this.bottomSide = sideBool;

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
        birb.style.left = birbPosLeft + "px";
    }

    function start() {
        if (!isGameOver) {
            createBirb();
            grid.addEventListener("click", removeIntroText, {once: true})
            grid.addEventListener("click", delayBeforeJumpUp);
            grid.addEventListener("click", delayBeforeTowers, {once: true});
            towerTimerID = setInterval(moveTowers, 8);
        }
    }

    function showIntroText() {
        introText.textContent = "Click on the screen to start!"
        introText.classList.add("intro-text");
        grid.append(introText);
    }

    function removeIntroText() {
        introText.remove();
        showScore();
    }

    function showScore() {
        score.textContent = scoreCounter;
        score.classList.add("onscreen-score");
        grid.append(score);
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
        removeControls();
        clearInterval(jumpTimerID);
        clearInterval(fallTimerID);
    }

    function removeControls() {
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
        const bottomTowerHeight = Math.round(Math.random()*(500-GAP_SIZE)+10);
        const topTowerHeight = 640-65-GAP_SIZE-bottomTowerHeight;
        const bottomTower = new Tower(bottomTowerHeight, "towerBottom", true);
        const topTower = new Tower(topTowerHeight, "towerTop", false);
        towerArr.push(bottomTower);
        towerArr.push(topTower);
    }

    

    function moveTowers() {
        let positionIncrement = 1;
        
        towerArr.forEach(tower => {
            let hitbox = tower.hitbox;
            tower.left -= positionIncrement;
            hitbox.style.left = tower.left + "px";

            if(tower.left<218 && tower.left>68 && tower.bottomSide) {
                detectCollision(tower.height);
            }

            if(towerArr[0].left < 143 && !isCounted) {
                updateScore();
                isCounted = true;
            }

            if (towerArr[0].left < 215 && !generatedTower) {
                generateTower();
                generatedTower = true;
            }

            if (towerArr[0].left < -100) {
                const bottomTower = towerArr[0].hitbox;
                bottomTower.remove();

                const topTower = towerArr[1].hitbox;
                topTower.remove();

                towerArr.shift();
                towerArr.shift();

                generatedTower = false;
                isCounted = false;
            }
        });
    }

    function updateScore() {
        scoreCounter++;
        score.textContent = scoreCounter;
    }


    function detectCollision(bottomTowerHeight) {
        
        const topTowerBottom = bottomTowerHeight+GAP_SIZE+15;
        const bottomTowerTop = bottomTowerHeight+65;

        if (birbPosBottom<bottomTowerTop || birbPosBottom>topTowerBottom) {
            removeControls();
            console.log("Collision!");
        }
    }
    
    // Game

    createPlatform();
    showIntroText();
    start();


});