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

    // Classes



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
                console.log("Game Over");
                isGameOver = true;
                clearInterval(fallTimerID);
                clearInterval(jumpTimerID);
                grid.removeEventListener("click", delayBeforeJumpUp);
            }
        },15);      

    };

    function createPlatform() {
        platform.classList.add("platform");
        grid.appendChild(platform);
    }

    function delayBeforeTowers() {
        setTimeout(generateTower, 5000);
    }

    function generateTower() {
        
    }

    
    // Game

    createPlatform();
    start();


});