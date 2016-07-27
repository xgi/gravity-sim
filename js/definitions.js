function Vector(x, y) {
	this.x = x;
	this.y = y;

	this.calculate = function() {
		this.angle = Math.atan(this.y / this.x)
		this.magnitude = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	}

	this.calculate();
}

function Color() {
	this.red = Math.floor(Math.random() * 255);
	this.green = Math.floor(Math.random() * 255);
	this.blue = Math.floor(Math.random() * 255);
	this.toString = function() {
		return "rgb(" + this.red + ", " + this.green + ", " + this.blue + ")";
	};
}

function Particle(m, v, x, y) {
	this.mass = m;
	this.velocity = v;
	this.x = x;
	this.y = y;
	this.color = new Color();
	this.absorb = function(p) {
		this.velocity.x = (this.velocity.x * this.mass + p.velocity.x * p.mass) / (this.mass + p.mass);
		this.velocity.y = (this.velocity.y * this.mass + p.velocity.y * p.mass) / (this.mass + p.mass);
		this.mass += p.mass;
		this.radius = Math.cbrt(this.mass);

		particles.splice(particles.indexOf(p), 1);
	};
	this.paint = function() {
		var ctx = $("#canvas")[0].getContext("2d");

		// calculate the position of this particle on the screen as opposed to
		// its absolute position
		relativeX = this.x + xOffset;
		relativeY = this.y + yOffset;

		ctx.beginPath();
		ctx.arc(relativeX, relativeY, this.radius, 0, 2 * Math.PI, false);

		ctx.fillStyle = this.color.toString();
		ctx.fill();

		// draw velocity angle if enabled
		if (drawVelocity) {
			ctx.beginPath();
			angle = this.velocity.angle;

			// determine position at edge of circle following velocity angle
			edgeX = relativeX + Math.cos(angle) * this.radius;
			edgeY = relativeY + Math.sin(angle) * this.radius;

			// draw the line to the edge of the circle
			ctx.moveTo(relativeX, relativeY);
			ctx.lineTo(edgeX, edgeY);
			ctx.stroke();
		}
	}
	this.radius = Math.cbrt(this.mass);
}
