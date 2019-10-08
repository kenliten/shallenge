(function() {
    // Make shure requestAnimationFrame function is available throw browsers
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;

    var canvas = document.querySelector("#screen");
    var ctx = canvas.getContext("2d");
    var playButton = document.getElementById("playButton");

    var upPressed = false,
        downPressed = false,
        leftPressed = false,
        rightPressed = false,
        touchEnemy = false,
        touchGoal = false,
        loopCaller,
        xPos = 734,
        yPos = 559,
        goal = { x: 34, y: 559 },
        enemies = new Array();

    function addImage(src, x, y) {
        let img = new Image();
        img.src = src;
        ctx.beginPath();
        ctx.drawImage(img, x, y);
        ctx.closePath();
    }

    for (let i = 0; i < 11; i++) {
        enemies[i] = {
            x: 34,
            y: ((i * 50) + 9),
            start: 34,
            end: 734,
            vel: ((i > 5) ? (i + 1) : ((i + 1) * 2)),
            goRight: true,
            move: () => {
                if (enemies[i].goRight) {
                    enemies[i].x += enemies[i].vel;
                    if (enemies[i].x >= enemies[i].end) {
                        enemies[i].goRight = false;
                    }
                } else {
                    enemies[i].x -= enemies[i].vel;
                    if (enemies[i].x <= enemies[i].start) {
                        enemies[i].goRight = true;
                    }
                }
            }
        };
    }

    function drawEnemies() {
        for (let i = 0; i < enemies.length; i++) {
            enemies[i].move();
            addImage("../assets/enemy.png", enemies[i].x, enemies[i].y);
        }
    }

    var bars = new Array();

    for (let i = 0; i < 7; i++) {
        bars[i] = {
            x: ((i + 1) * 100) - 2,
            y: (!(i == 1) && i % 2 == 0) ? 50 : 0
        };
    }

    // later will accept one parameter, the level and will get it 
    // from a previously created object variable with the levels
    function drawLevel() {
        let x = 0;
        let y = 0;
        for (i = 0; i < 11; i++) {
            y = ((i + 1) * 50) - 2;
            ctx.beginPath();
            ctx.fillStyle = "#CDDC39";
            ctx.fillRect(x, y, 800, 4);
            ctx.closePath();
        }
        y = 0;
        for (i = 0; i < 7; i++) {
            x = ((i + 1) * 100) - 2;
            ctx.beginPath();
            ctx.fillStyle = "yellow";
            if (!(i == 1) && i % 2 == 0) {
                ctx.fillRect(x, y + 50, 4, 550);
            } else {
                ctx.fillRect(x, y, 4, 550);
            }
            ctx.closePath();
        }
    }

    function drawPlayer(xPos, yPos) {
        addImage("../assets/player.png", xPos, yPos);
    }

    function drawGoal() {
        addImage("../assets/goal.png", goal.x, goal.y);
    }

    function cleanScreen() {
        ctx.beginPath();
        ctx.clearRect(0, 0, 800, 600);
        ctx.closePath();
    }

    function keyPressed(e) {
        if (e.key == "ArrowUp") {
            upPressed = true;
        }
        if (e.key == "ArrowDown") {
            downPressed = true;
        }
        if (e.key == "ArrowLeft") {
            leftPressed = true;
        }
        if (e.key == "ArrowRight") {
            rightPressed = true;
        }
    }

    function keyUnpressed(e) {
        if (e.key == "ArrowUp") {
            upPressed = false;
        }
        if (e.key == "ArrowDown") {
            downPressed = false;
        }
        if (e.key == "ArrowLeft") {
            leftPressed = false;
        }
        if (e.key == "ArrowRight") {
            rightPressed = false;
        }
    }

    function gameOver(win) {
        if (win) {
            alert("Has Ganado!");
        } else {
            alert("Has Perdido!");
        }
        window.cancelAnimationFrame(loopCaller);
        cleanScreen();
        playButton.style.display = "block";
        playButton.addEventListener("click", function() {
            location.reload();
        });
    }

    window.addEventListener("keydown", keyPressed);
    window.addEventListener("keyup", keyUnpressed);

    // Create and start the main loop
    function loop() {

        cleanScreen();
        drawLevel();
        drawEnemies();
        drawGoal();

        if (upPressed && !(yPos <= 0)) {
            yPos -= 3;
        }

        if (downPressed && !(yPos >= (600 - 32))) {
            yPos += 3;
        }

        if (leftPressed && !(xPos <= 0)) {
            xPos -= 3;
            for (let i = 0; i < bars.length; i++) {
                if ((xPos >= bars[i].x && xPos <= (bars[i].x + 4)) && (yPos >= bars[i].y && yPos <= (bars[i].y + 550))) {
                    xPos += 3;
                }
            }
        }

        if (rightPressed && !(xPos >= (800 - 32))) {
            xPos += 3;
            for (let i = 0; i < bars.length; i++) {
                if (((xPos + 32) >= bars[i].x && xPos <= bars[i].x) && ((yPos + 32) >= bars[i].y && yPos <= (bars[i].y + 550))) {
                    xPos -= 3;
                }
            }
        }

        drawPlayer(xPos, yPos);

        for (let i = 0; i < enemies.length; i++) {
            if (((xPos >= enemies[i].x && xPos <= (enemies[i].x + 32)) && (yPos >= enemies[i].y && yPos <= (enemies[i].y + 32))) ||
                ((xPos + 32) >= enemies[i].x && xPos <= enemies[i].x) && ((yPos + 32) >= enemies[i].y && yPos <= (enemies[i].y + 32))) {
                touchEnemy = true;
            }
        }

        if (((xPos >= goal.x && xPos <= (goal.x + 32)) && (yPos >= goal.y && yPos <= (goal.y + 32))) ||
            ((xPos + 32) >= goal.x && xPos <= goal.x) && ((yPos + 32) >= goal.y && yPos <= (goal.y + 32))) {
            touchGoal = true;
        }

        loopCaller = window.requestAnimationFrame(loop);

        if (touchEnemy) {
            gameOver(false);
        }
        if (touchGoal) {
            gameOver(true);
        }
    }

    loop();

})();