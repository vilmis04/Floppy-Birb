window.addEventListener("DOMContentLoaded", startNewGame);

function startNewGame() {
  // Definitions

  const grid = document.querySelector(".grid");
  const birb = document.createElement("div");
  const platform = document.createElement("div");
  const introText = document.createElement("div");
  const score = document.createElement("div");
  const scoreboard = document.createElement("div");
  let isGameOver = false;
  const birbPosLeft = 168;
  let birbPosBottom = 300;
  let fallTimerID;
  let jumpTimerID;
  let towerTimerID;
  let cloudTimerID;
  const GAP_SIZE = 250;
  let towerArr = [];
  let cloudArr = [];
  const TIME_BEFORE_FIRST_TOWER = 1000;
  let generatedTower = false;
  let scoreCounter = 0;
  const storage = window.localStorage;
  let highscore = storage.getItem("highscore");
  highscore = highscore == null ? 0 : highscore;
  let isCounted = false;
  let isCollision = false;
  let generatedCloud = false;

  // Classes

  class Tower {
    constructor(height, classStr, sideBool) {
      this.left = 480;
      this.height = height;
      this.hitbox = document.createElement("div");
      this.bottomSide = sideBool;

      const hitbox = this.hitbox;
      hitbox.classList.add(classStr);
      hitbox.style.height = this.height + "px";
      hitbox.style.left = this.left + "px";
      grid.appendChild(hitbox);
    }
  }

  class Cloud {
    constructor() {
      this.left = 480;
      this.bottom = Math.round(Math.random() * 450 + 100);
      this.canvas = document.createElement("canvas");
      this.size = Math.random() * 0.5 + 0.5;
      this.speed = Math.round(Math.random() * 1 + 1);
      
      let bottom = this.bottom;
      let left = this.left;
      const canvas = this.canvas;
      canvas.style.bottom = bottom+"px";
      canvas.style.left = left+"px";
      canvas.style.transform = "scale("+this.size+")";
      canvas.classList.add("cloud-canvas");
      drawCloud(canvas);

      
      grid.append(canvas);
    }
  }

  // Functions

  function drawCloud(canvas) {
    const ctx = canvas.getContext("2d");
    canvas.width = 100;
    canvas.height = 50;

    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(20,30,15,0,Math.PI * 2);
    ctx.arc(35,15,15,0,Math.PI * 2);
    ctx.arc(55,15,15,0,Math.PI * 2);
    ctx.arc(80,30,15,0,Math.PI * 2);
    ctx.fillRect(20,30,60,16);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }

  function createBirb() {
    grid.appendChild(birb);
    birb.classList.add("birb");
    birb.style.bottom = birbPosBottom + "px";
    birb.style.left = birbPosLeft + "px";

    addVisuals();
  }

  function addVisuals() {
    const visualContainer = document.createElement("div");
    visualContainer.classList.add("visual-container");

    const birbCanvas = document.createElement("canvas");
    birbCanvas.classList.add("birb-canvas");

    drawBirb(birbCanvas);
    addWing(visualContainer);

    birb.append(birbCanvas, visualContainer);
  }

  function addWing(parentElement) {
      const wing = document.createElement("div");
      wing.classList.add("wing", "wing-animation");
      parentElement.append(wing);
  }

  function drawBirb(canvas) {
    const ctx = canvas.getContext("2d");
    canvas.width = 50;
    canvas.height = 50;

    //draw body
    ctx.strokeStyle = "black";
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(30,30,30,Math.PI*1.5,Math.PI,true);
    ctx.arc(15,30,15,Math.PI,Math.PI*0.5,true);
    ctx.moveTo(15,45);
    ctx.lineTo(30,45);
    ctx.arc(30,30,15,Math.PI*0.5,Math.PI*2,true);
    ctx.moveTo(45,30);
    ctx.lineTo(45,15);
    ctx.arc(30,15,15,Math.PI*2,Math.PI*1.5,true);
    ctx.fill();
    ctx.stroke();
    ctx.fillRect(15,5,20,39);
    ctx.fillRect(24,11,20,23);
    ctx.fillRect(28,2,5,5);

    


    //draw eye
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(40,10,5,Math.PI,Math.PI*2);
    ctx.arc(40,20,5,0,Math.PI);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  
    //draw eye-dot
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(42.5,17.5,1,0,Math.PI*2);
    ctx.stroke();
    ctx.fill();

    //draw beak
    ctx.fillStyle = "orange";
    ctx.strokeStyle = "orange";
    ctx.beginPath();
    ctx.arc(47.5,35,2.5,Math.PI*1.5,Math.PI*0.5);
    ctx.arc(37.5,35,2.5,Math.PI*0.5,Math.PI*1.5);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(45,38,2.5,Math.PI*1.5,Math.PI*0.5);
    ctx.arc(37.5,38,2.5,Math.PI*0.5,Math.PI*1.5);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

  }

  function start() {
    scoreCounter = 0;
    if (!isGameOver) {
      createBirb();
      grid.addEventListener("click", removeIntroText, { once: true });
      grid.addEventListener("click", delayBeforeJumpUp);
      grid.addEventListener("click", delayBeforeTowers, { once: true });
      towerTimerID = setInterval(moveTowers, 8);
      cloudArr.push(new Cloud);
      cloudTimerID = setInterval(moveClouds, 30);
      setTimeout(cloudArr.push(new Cloud), Math.random() * 1000 + 500);
    }
  }

  function showIntroText() {
    introText.textContent = "Click on the screen to start!";
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
        birb.style.bottom = birbPosBottom + "px";
      } else {
        fallDown();
      }
    }, 15);
  }

  function delayBeforeJumpUp() {
    clearInterval(fallTimerID);
    clearInterval(jumpTimerID);
    setTimeout(jumpUp, 15);
  }

  function fallDown() {
    clearInterval(jumpTimerID);
    let fallIncrement = 5;
    fallTimerID = setInterval(() => {
      if (birbPosBottom > 65) {
        birbPosBottom -= fallIncrement;
        birb.style.bottom = birbPosBottom + "px";
        fallIncrement += 0.1;
      } else {
        gameOver();
      }
    }, 15);
  }

  function gameOver() {
    // console.log("Game Over");
    isGameOver = true;

    if (!isCollision) { flashScreen();}

    removeControls();
    clearInterval(jumpTimerID);
    clearInterval(fallTimerID);

    updateHighscore();
    displayScoreboard();
  }

  function updateHighscore() {
    if (scoreCounter > highscore) {
    highscore = scoreCounter;
    storage.setItem("highscore", highscore);
    }
    // console.log("score: "+scoreCounter);
    // console.log("highscore: "+highscore);
  }

  function displayScoreboard() {
    scoreboard.classList.add("scoreboard");

    const scoreTitle = document.createElement("div");
    const scoreValue = document.createElement("div");
    const highscoreTitle = document.createElement("div");
    const highscoreValue = document.createElement("div");
    const restartBtn = document.createElement("div");

    scoreTitle.textContent = "Score:";
    scoreValue.textContent = scoreCounter;

    highscoreTitle.textContent = "Best:"
    highscoreValue.textContent = highscore;

    restartBtn.textContent = "RESTART";
    restartBtn.classList.add("restart-button");
    restartBtn.addEventListener("click", ()=> {
        clearScreen();
        cloudArr = [];
        setTimeout(startNewGame, 100);
    });

    scoreboard.append(scoreTitle, scoreValue, highscoreTitle, highscoreValue, restartBtn);
    grid.append(scoreboard);
  }

  function clearScreen() {
      while (grid.firstChild) {
          grid.firstChild.remove();
      }
  }

  function removeControls() {
    clearInterval(towerTimerID);
    grid.removeEventListener("click", delayBeforeJumpUp);
    platform.classList.remove("platform-animation");
    document.querySelector(".wing").classList.remove("wing-animation");
  }

  function createPlatform() {
    const ground = document.createElement("div");
    ground.classList.add("ground");
    platform.classList.add("platform", "platform-animation");
    
    grid.append(platform, ground);
  }

  function delayBeforeTowers() {
    setTimeout(generateTower, TIME_BEFORE_FIRST_TOWER);
  }

  function generateTower() {
    const bottomTowerHeight = Math.round(Math.random() * (500 - GAP_SIZE) + 10);
    const topTowerHeight = 640 - 65 - GAP_SIZE - bottomTowerHeight;
    const bottomTower = new Tower(bottomTowerHeight, "towerBottom", true);
    const topTower = new Tower(topTowerHeight, "towerTop", false);
    towerArr.push(bottomTower);
    towerArr.push(topTower);
  }

  function moveClouds() {
    cloudArr.forEach(cloud => {
      const canvas = cloud.canvas;
      cloud.left -= cloud.speed;
      canvas.style.left = cloud.left +"px";

      if (cloud.left<200 && !generatedCloud) {
        cloudArr.push(new Cloud);
        generatedCloud = true;
      }

      if (cloudArr[0].left<=-100) {
        cloudArr[0].canvas.remove();
        cloudArr.shift();
        generatedCloud = false;
      }

    });
  }

  function moveTowers() {
    let positionIncrement = 1;

    towerArr.forEach((tower) => {
      let hitbox = tower.hitbox;
      tower.left -= positionIncrement;
      hitbox.style.left = tower.left + "px";

      if (tower.left < 218 && tower.left > 68 && tower.bottomSide) {
        detectCollision(tower.height);
      }

      if (towerArr[0].left < 143 && !isCounted) {
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
    const topTowerBottom = bottomTowerHeight + GAP_SIZE + 15;
    const bottomTowerTop = bottomTowerHeight + 65;

    isCollision = true;

    if (birbPosBottom < bottomTowerTop || birbPosBottom > topTowerBottom) {
      removeControls();
      flashScreen();
      // console.log("Collision!");
    }
  }

  function flashScreen() {
    score.remove();

    const screenFlash = document.createElement("div");
    screenFlash.classList.add("black-screen");
    screenFlash.style.background = "black";
    grid.append(screenFlash);
      setTimeout(() => {
          screenFlash.style.background = "white";
        }, 100);
      setTimeout(() => {
          screenFlash.remove();
        }, 100);
  }

  // Game

  createPlatform();
  showIntroText();
  start();
}
