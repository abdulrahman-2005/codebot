const alertEl = document.getElementById("customAlert");
const robotInfoWindow = document.querySelector(".robot-info-window");

const infoWindowTitle = document.getElementById("infoWindowTitle")

const nameInput = document.getElementById("robotNamePrompt");
const xInput = document.getElementById("posXPrompt");
const yInput = document.getElementById("posYPrompt");
const heightInput = document.getElementById("robotHeightPrompt");
const widthInput = document.getElementById("robotWidthPrompt");
const colorInput = document.getElementById("colorPrompt");
const radiusInput = document.getElementById("radiusPrompt");
const rotationInput = document.getElementById("rotationPrompt");
const velocityInput = document.getElementById("speedPrompt");


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

function openCreationWindow() {
	robotInfoWindow.setAttribute("state", "opened");
	document.getElementById("robotNamePrompt").value = `robot-${robots.length}`;
	pause();
}

function closeCreationWindow(create = false) {
	robotInfoWindow.setAttribute("state", "closed");

	if (infoOpened && infoOpenedRobot && infoOpenedEl) {
		infoOpenedRobot.name = name.value;
		infoOpenedRobot.left = parseInt(xInput.value);
		infoOpenedRobot.top = parseInt(yInput.value);
		infoOpenedRobot.height = parseInt(heightInput.value);
		infoOpenedRobot.width = parseInt(widthInput.value);
		infoOpenedRobot.radius = radiusInput.value;
		infoOpenedRobot.color = colorInput.value;
		infoOpenedRobot.velocity = parseInt(velocityInput.value);
		infoOpenedRobot.rotation = parseInt(rotationInput.value);
		infoOpenedEl.style = infoOpenedRobot.styles()
		console.log(infoOpenedRobot)
		infoOpened = false;
		infoOpenedRobot = false;
		infoOpenedEl = false;
		_alert (`<h5 style="color: var(--green);">SUCCESS --> Robot Updated!</h1>`);
		return
	}

	if (!create) {
		return;
	}

	infoWindowTitle.innerHTML = "Create A New Robot :{"

	let robot = new Robot(
		Grid.value,
		name.value,
		xInput.value,
		yInput.value,
		heightInput.value,
		widthInput.value,
		radiusInput.value,
		colorInput.value,
		velocityInput.value,
		rotationInput.value
	);
	robot.render();
	_alert(`<h5 style="color: var(--green);">SUCCESS --> Robot Created!</h1>`);
}

let infoOpened = false;
let infoOpenedRobot = false;
let infoOpenedEl = false;
function openRobotInfo(index) {
	let r =  robots[index];
	console.log(r)
	name.value = r.name;
	xInput.value = r.left;
	yInput.value = r.top;
	heightInput.value = r.height;
	widthInput.value = r.width;
	radiusInput.value = r.radius;
	colorInput.value = r.color;
	velocityInput.value = r.velocity;
	rotationInput.value = r.rotation;
	robotInfoWindow.setAttribute("state", "opened");
	infoOpened = true;
	infoOpenedRobot = r;
	infoWindowTitle.innerHTML = "Edit Robot :{"
	infoOpenedEl = document.getElementById(`robot-${index}`);
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
		robotButtonsListEl.innerHTML += `<button ondblclick="openRobotInfo(${i})" onclick="selectRobotById(this, ${i})" id="robot-button-${i}"><p style="color: ${this.color}">${robots[i].name}</p></button>`;
	}
}


