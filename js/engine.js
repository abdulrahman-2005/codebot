const runpauseButtonEl = document.getElementById("runpause-fixed-btn");
let running = false;
let fps = 60;

async function rerun() {
	count = 0;
	while (running) {
		count++;
		await sleep(1000 / fps);
		Grid.innerHTML = "";
		robots.forEach((object) => {
			object.apply();
			object.render();
		});

		if (selectedRobotObject) {
			scrollToChild(Grid, selectedRobotEl)
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
