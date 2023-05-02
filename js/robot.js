const robotButtonsListEl = document.getElementById("robot-buttons-list");
const Grid = document.getElementById("grid");

let robots = [];
let robotCSSTemplate = `
top: {TOP}px;
left: {LEFT}px;
height: {HEIGHT}px;
width: {WIDTH}px;
background: {COLOR};
border-radius: {RADIUS};
transform: rotate({ROTATION}deg);
`;

let audioSources = {
	BOOP: "./assets/boop.mp3",
	DING: "./assets/ding.mp3",
	LASER: "./assets/laser.mp3",
};

let MAX_LEFT = 10000;
let MAX_UP = 10000;
function check() {
	for (let robot of robots) {
		if (robot.top >= MAX_UP) {
			_alert(`WARNING, Robot is outa control at Y:${MAX_LEFT}`);
			robot.top = MAX_UP;
		} else if (robot.left >= MAX_LEFT) {
			_alert(`WARNING, Robot is outa control at X:{MAX_UP}`);
			robot.left = MAX_LEFT;
		} else if (robot.top <= 0) {
			robot.top = 0;
		} else if (robot.left <= 0) {
			robot.left = 0;
		}
	}
}

class Robot {
	constructor(
		grid = Grid,
		name = `R-${robots.length}`,
		top = 20,
		left = 20,
		height = 50,
		width = 50,
		radius = "0",
		color = "var(--green)",
		velocity = 1,
		rotation = 0
	) {
		this.top = parseInt(top);
		this.left = parseInt(left);
		this.height = parseInt(height);
		this.width = parseInt(width);
		this.color = color;
		this.velocity = parseInt(velocity);
		this.grid = grid;
		this.rotation = parseInt(rotation);
		this.radius = radius;
		this.name = name;
		this.sourceCode =
			"MOVE ARIGHT 50\nMOVE ADOWN 50\nMOVE ALEFT 50\nMOVE AUP 50\nROTATE 3\nplay boop\nMOVE RIGHT 2\nMOVE down 2\nmove left 2\nmove up 2\nrotate 3\nset height 100\nset color red\nplay laser\nset width 100\nset color purple\nrotate -6\nplay ding\nset height 50\nset width 50".toUpperCase();
		this.steps = this.getSteps();
		this.currentStep = 0;
		this.index = robots.length;
		robots.push(this);
		robotButtonsListEl.innerHTML += `<button ondblclick="openRobotInfo(${this.index})"
												onclick="selectRobotById(this, ${this.index})"
												id="robot-button-${this.index}">
													<p style="color: ${this.color}">${this.name}</p>
												</button>`;
	}

	modify(name, amount) {
		amount = parseInt(amount);
		switch (name) {
			case "SPEED":
				this.velocity += amount;
				break;
			case "RADIUS":
				this.radius += amount;
				break;
			case "HEIGHT":
				this.height += amount;
				break;
			case "WIDTH":
				this.width += amount;
				break;
		}
	}

	remove() {
		robots.splice(this.index, 1);
		updateRobotsList();
	}

	_set(name, value) {
		switch (name) {
			case "SPEED":
				this.velocity = parseInt(value);
				break;
			case "COLOR":
				this.color = value;
				break;
			case "RADIUS":
				this.radius = value;
				break;
			case "HEIGHT":
				this.height = parseInt(value);
			case "WIDTH":
				this.width = parseInt(value);
				break;
			case "X":
				this.left = parseInt(value);
				break;
			case "Y":
				this.top = parseInt(value);
				break;
		}
	}

	move(direction, distance) {
		let dx = 0;
		let dy = 0;
		switch (direction) {
			case "RIGHT":
				dy = distance;
				break;
			case "LEFT":
				dy = -distance;
				break;
			case "UP":
				dx = -distance;
				break;
			case "DOWN":
				dx = distance;
				break;
			case "ARIGHT":
				this.left += distance;
				return;
			case "ALEFT":
				this.left -= distance;
				return;
			case "AUP":
				this.top -= distance;
				return;
			case "ADOWN":
				this.top += distance;
				return;
		}
		const angle = (this.rotation * Math.PI) / 180;
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		const newX = this.left + dx * sin + dy * cos;
		const newY = this.top + dx * cos - dy * sin;
		this.left = newX;
		this.top = newY;
	}

	rotate(deg) {
		this.rotation += deg;
	}

	styles() {
		return robotCSSTemplate
			.replace("{TOP}", this.top)
			.replace("{LEFT}", this.left)
			.replace("{HEIGHT}", this.height)
			.replace("{WIDTH}", this.width)
			.replace("{COLOR}", this.color)
			.replace("{RADIUS}", this.radius)
			.replace("{ROTATION}", this.rotation);
	}

	render() {
		Grid.innerHTML += `
		<div class="robot"
		id="robot-${this.index}"
		onclick="selectRobot(this)"
		ondblclick="openRobotInfo(${this.index})"
		index="${this.index}"
		style="${this.styles()}"
		title="${this.name}" 
		class="robot">
			${this.name}
		</div>`;
	}

	getSteps() {
		return this.sourceCode
			.split("\n")
			.map((step) => step.split(" ").map((s) => s.replaceAll(" ", "")));
	}

	updateSourceCode(code) {
		this.sourceCode = code.toUpperCase();
		this.steps = this.getSteps();
		this.currentStep = 0;
	}

	collidesWith(other) {
		const xOverlap =
			this.left <= other.left + other.width &&
			this.left + this.width >= other.left;
		const yOverlap =
			this.top <= other.top + other.height &&
			this.top + this.height >= other.top;
		return xOverlap && yOverlap;
	}
	// ... constructor and other methods ...

	collisionDirection(other) {
		const dx = this.left + this.width / 2 - (other.left + other.width / 2);
		const dy = this.top + this.height / 2 - (other.top + other.height / 2);
		const distance = Math.sqrt(dx * dx + dy * dy);
		const minDistance = (this.width + other.width) / 2;

		if (distance < minDistance) {
			const angle = Math.atan2(dy, dx);
			const x = Math.cos(angle);
			const y = Math.sin(angle);

			if (Math.abs(x) > Math.abs(y)) {
				return x > 0 ? ["LEFT", "ALEFT"] : ["RIGHT", "ARIGHT"];
			} else {
				return y > 0 ? ["UP", "AUP"] : ["DOWN", "ADOWN"];
			}
		}
		return false;
	}
	apply() {
		let step = this.steps[this.currentStep];
		this.currentStep++;
		if (step[0] === "MOVE") {
			let collisionDirections = [];
			let inCollision = false;

			for (let robot of robots) {
				if (robot !== this && robot.collidesWith(this)) {
					inCollision = true;
					for (let i of robot.collisionDirection(this)) {
						collisionDirections.push(i);
					}
				}
			}
			if (inCollision && collisionDirections.includes(step[1])) {
				playSound(audioSources["BOOP"]);
			} else {
				this.move(step[1], parseInt(step[2]));
			}
		} else if (step[0] === "ROTATE") {
			this.rotate(parseInt(step[1]));
		} else if (step[0] === "MOD") {
			this.modify(step[1], step[2]);
		} else if (step[0] === "SET") {
			this._set(step[1], step[2]);
		} else if (step[0] === "PLAY") {
			playSound(audioSources[step[1]]);
		}

		if (this.currentStep >= this.steps.length) {
			this.currentStep = 0;
		}
	}
}
