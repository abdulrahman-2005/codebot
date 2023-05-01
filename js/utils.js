const alertEl = document.getElementById("customAlert");
const robotInfoWindow = document.querySelector(".robot-info-window");
const robotShortcutActionsEl = document.getElementById(
	"robot-shortcut-actions"
);

function _alert(content = "") {
	alertEl.innerHTML = content;
	if (alertEl.getAttribute("state") === "opened" && content === "") {
		alertEl.setAttribute("state", "closed");
		return;
	}
	alertEl.setAttribute("state", "opened");
}

async function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

function openCreationPrompt() {
	robotInfoWindow.setAttribute("state", "opened");
	document.getElementById("robotNamePrompt").value = `robot-${robots.length}`;
	pause();
}

function closeCreationPrompt(create = false) {
	robotInfoWindow.setAttribute("state", "closed");

	if (!create) {
		return;
	}

	let name = document.getElementById("robotNamePrompt").value;
	let x = document.getElementById("posXPrompt").value;
	let y = document.getElementById("posYPrompt").value;
	let height = document.getElementById("robotHeightPrompt").value;
	let width = document.getElementById("robotWidthPrompt").value;
	let color = document.getElementById("colorPrompt").value;
	let radius = document.getElementById("radiusPrompt").value;
	let rotation = document.getElementById("rotationPrompt").value;
	let velocity = document.getElementById("speedPrompt").value;

	let robot = new Robot(
		Grid,
		name,
		x,
		y,
		height,
		width,
		radius,
		color,
		velocity,
		rotation
	);
	robot.render();
	_alert(`<h5 style="color: var(--green);">SUCCESS --> Robot Created!</h1>`);
}

let selectedRobotEl = false;
let selectedRobotObject = false;
let selectedButtonEl = false;

function selectRobotById(buttonEl, index) {
	if (buttonEl.getAttribute("state") === "selected") {
		buttonEl.setAttribute("state", "closed");
		selectRobot(document.getElementById(`robot-${index}`));
		return;
	}
	buttonEl.setAttribute("state", "selected");
	selectRobot(document.getElementById(`robot-${index}`));
}

function selectRobot(robotElement) {
	if (selectedRobotEl === robotElement) {
		robotElement.setAttribute("state", "closed");
		selectedButtonEl.setAttribute("state", "closed");
		selectedRobotEl = false;
		selectedRobotObject = false;
		robotShortcutActionsEl.innerHTML = "";
		return;
	}
	if (selectedRobotEl) {
		selectedRobotEl.setAttribute("state", "closed");
		selectedButtonEl.setAttribute("state", "closed");
		selectedRobotObject = false;
		selectedRobotEl = false;
	}

	robotElement.setAttribute("state", "selected");
	selectedButtonEl = document.getElementById(
		`robot-button-${robotElement.getAttribute("index")}`
	);
	selectedButtonEl.setAttribute("state", "selected");
	selectedRobotObject = robots[parseInt(robotElement.getAttribute("index"))];
	selectedRobotEl = robotElement;
	robotShortcutActionsEl.innerHTML = `<button class="editor-button" id="open-editor-button" onclick="openEditor()">Open Editor</button>
	<button class="editor-button" id="open-editor-button" onclick="removeRobot()">Remove Robot</button>
	<div id="shourtcut-buttons-container">
		<button onclick="rotateLeft()">↪</button>
		<button onclick="moveUp()">⬆</button>
		<button onclick="rotateRight()" >↩</button>
		<button onclick="moveLeft()"><</button>
		<button onclick="moveDown()">⬇</button>
		<button onclick="moveRight()">></button>
	</div>`;
}
//<input type="number" min=1 max=100 value=10 id="amount" placeholder="Amount of increment"/>

function moveUp() {
	if (!selectedRobotEl) {
		return;
	}
	selectedRobotObject.move("UP");
	selectedRobotEl.style = selectedRobotObject.styles();
}

function moveDown() {
	if (!selectedRobotEl) {
		return;
	}
	selectedRobotObject.move("DOWN");
	selectedRobotEl.style = selectedRobotObject.styles();
}

function moveLeft() {
	if (!selectedRobotEl) {
		return;
	}
	selectedRobotObject.move("LEFT");
	selectedRobotEl.style = selectedRobotObject.styles();
}

function moveRight() {
	if (!selectedRobotEl) {
		return;
	}
	selectedRobotObject.move("RIGHT");
	selectedRobotEl.style = selectedRobotObject.styles();
}

function rotateLeft() {
	if (!selectedRobotEl) {
		return;
	}
	selectedRobotObject.rotate(-5);
	selectedRobotEl.style = selectedRobotObject.styles();
}

function rotateRight() {
	if (!selectedRobotEl) {
		return;
	}
	selectedRobotObject.rotate(5);
	selectedRobotEl.style = selectedRobotObject.styles();
}

function removeRobot() {
	if (!selectedRobotEl) {
		return;
	}
	selectedRobotEl.remove();
	selectedRobotObject.remove();
	robotShortcutActionsEl.innerHTML = "";
}

editor = document.getElementById("editor");
sourceCode = document.getElementById("source-code-textarea");

function closeEditor() {
	editor.setAttribute("state", "closed");
}

function openEditor() {
	if (!selectedRobotObject) {
		_alert("Select a robot to edit!");
		return;
	}
	sourceCode.value = selectedRobotObject.sourceCode;
	editor.setAttribute("state", "opened");
}

function saveEditor() {
	if (!selectedRobotObject) {
		_alert("Select a robot to edit!");
		closeEditor();
		return;
	}
	selectedRobotObject.updateSourceCode(sourceCode.value.toUpperCase());
	closeEditor();
}

function aboutme() {
	_alert(
		`
		<h2 style="padding: 20px; background: white;">Made with ♥ by <a href="https://www.codeman.gq" target=_blank>Abdulrahman Azmy😁</a></h2>`
	);
}

const audioEl = document.getElementById("audio");
let isPlaying = false;
function playSound(sourceUrl) {
	if (isPlaying) return; // Return if audio is still playing

	isPlaying = true;
	audioEl.src = sourceUrl;
	audioEl.play();

	audioEl.addEventListener("ended", function () {
		isPlaying = false;
	});
}
function updateRobotsList() {
	robotButtonsListEl.innerHTML = "";
	for (let i = 0; i < robots.length; i++) {
		robots[i].index = i;
		robotButtonsListEl.innerHTML += `<button onclick="selectRobotById(this, ${i})" id="robot-button-${i}"><p style="color: ${this.color}">${robots[i].name}</p></button>`;
	}
}
