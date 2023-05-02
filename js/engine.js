const runpauseButtonEl = document.getElementById("runpause-fixed-btn");
let running = false;
let fps = 15;
let oneTime = false;
async function rerun(for_) {
	count = 0;
	while (running) {
		count++;
		await sleep(1000 / fps);
		Grid.innerHTML = "";
		robots.forEach((object) => {
			object.apply();
			object.render();
		});
		if (for_) {
			if (count >= for_) {
				pause();
			}
		}
		check();
	}
}

function runpause() {
	if (running) {
		pause();
	} else {
		run();
	}
}

function pause() {
	running = false;
	runpauseButtonEl.innerHTML = ">";
	_alert("Engine Paused");
}

function run() {
	running = true;
	rerun();
	runpauseButtonEl.innerHTML = "▪";
	_alert("Engine Running");
}

document.addEventListener("keydown", function(event) {
    switch(event.key) {
        case "ArrowUp":
        case "w":
            moveUp();
            break;
        case "ArrowDown":
        case "s":
            moveDown();
            break;
        case "ArrowLeft":
        case "a":
            moveLeft();
            break;
        case "ArrowRight":
        case "d":
            moveRight();
            break;
        case "e" :
            rotateRight();
            break;
        case "q":
            rotateLeft();
            break;
        case "Delete":
            removeRobot();
            break;
    }
});


//to create default robots
new Robot(Grid, "robot-0", 50,  50)
new Robot(Grid, "robot-1", 200, 50)
new Robot(Grid, "robot-2", 400, 50)
new Robot(Grid, "robot-3", 400,  200)

let colors = ["red", "blue", "green", "yellow",  "orange", "purple", "pink", "brown", "grey", "white"]
function randomColor() {
	return  colors[Math.floor(Math.random() * colors.length)].toUpperCase()
}

function randomNumber() {
	return Math.floor(Math.random() * 10)
}

for (robot of robots) {
	robot.updateSourceCode(robot.sourceCode.replace("RED", randomColor()).replace("PURPLE", randomColor()).replace("-6", randomNumber()).replace("3", randomNumber()))
	robot.color = randomColor();
	robot.render();
}


rerun(for_=10)
