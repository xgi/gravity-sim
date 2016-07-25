var xOffset = 0;
var yOffset = 0;
var initXOffset = 0;
var initYOffset = 0;
var mouseInitX = 0;
var mouseInitY = 0;
var mouseCurX = 0;
var mouseCurY = 0;

var particles = new Array();
var mass = 1024;
var gravity = 1;

var drawVelocity = false;
var panning = false;
var mouseDown = false;
var shiftPressed = false;
var following = false;

var ctx;

/* Center view on the most massive particle */
function follow(particles) {
	var x = 0;
	var y = 0;

	// determine the largest particle
	var largestParticle = null;
	var largestMass = 0;

	for (var i = 0; i < particles.length; i ++) {
		if (particles[i].mass > largestMass) {
			largestParticle = particles[i];
			largestMass = particles[i].mass;
		}
	}

	if (largestParticle) {
		// force velocity to zero to make other velocities relative to this particle
		largestParticle.velocity.x = 0;
		largestParticle.velocity.y = 0;

		// center viewport on this particle
		xOffset = $(window).width() / 2 - largestParticle.x;
		yOffset = $(window).height() / 2 - largestParticle.y;
	}
}

/* Create a particle with given mass, velocity, and position and add it to
 * particle array. Also update the counter in the HTML info panel.
 */
function createParticle(m, v, x, y) {
	var p = new Particle(m, v, x, y);
	particles[particles.length] = p;

	$('#num-particles').html('<b>Particles: </b>' + particles.length);
}

$(document).ready(function (e) {
	xOffset = $(window).width() / 2;
	yOffset = $(window).height() / 2;

	mouseInitX = e.clientX;
	mouseInitY = e.clientY;

	ctx = $("#canvas")[0].getContext("2d");
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;

	$("#canvas").mousedown(function (e) {
		mouseDown = true;

		// store the initial clicked position for dragging
		mouseInitX = e.clientX;
		mouseInitY = e.clientY;
		mouseCurX = mouseInitX;
		mouseCurY = mouseInitY;

		if (shiftPressed) {
			panning = true;
			initXOffset = xOffset;
			initYOffset = yOffset;
		}
	});

	$("#canvas").mouseup(function (e) {
		if (!panning) {
			var vx = (e.clientX - mouseInitX) / 10;
			var vy = (e.clientY - mouseInitY) / 10;
			var x = mouseInitX - xOffset;
			var y = mouseInitY - yOffset;

			createParticle(mass, new Vector(vx, vy), x, y)
		}

		panning = false;
		mouseDown = false;
	});

	$("#canvas").mousemove(function (e) {
		mouseCurX = e.clientX;
		mouseCurY = e.clientY;

		if (panning) {
			// update x offset relative to initial offset with mouse traveled dist
			xOffset = initXOffset + (mouseCurX - mouseInitX);
			yOffset = initYOffset + (mouseCurY - mouseInitY);
		}
	});

	$("body").keydown(function(e) {
		if (e.which == 16) { // shift
			shiftPressed = true;
		}
	});

	$("body").keyup(function (e) {
		if (e.which == 16) { // shift
			shiftPressed = false;
		} else if (e.which == 70) { // f
			following = !following;
			$('#following').html('<b>Following: </b>' + following);
		} else if (e.which == 86) { // v
			drawVelocity = !drawVelocity;
		} else if (e.which == 72) { // h
			$('#info').toggle();
		} else if (e.which == 38) { // up arrow
			if (mass < 65536) {
				mass *= 2;
				$('#mass').html('<b>Mass: </b>' + mass);
			}
		} else if (e.which == 40) { // down arrow
			if (mass > 1024) {
				mass /= 2;
				$('#mass').html('<b>Mass: </b>' + mass);
			}
		}
	});

	t = setInterval(function() {
		// clear display and redraw
		ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
		ctx.strokeStyle = "white";
		paintParticles(particles);

		// draw helper line for launching particle
		if (mouseDown && !panning) {
			ctx.beginPath();
			ctx.moveTo(mouseInitX, mouseInitY);
			ctx.lineTo(mouseCurX, mouseCurY);
			ctx.stroke();
		}

		updateVelocity(particles);
		applyVelocity(particles);

		if (following) {
			follow(particles);
		}
	}, 30);
});
