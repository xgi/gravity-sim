/* Call paint function of all particles */
function paintParticles(particles) {
	for (var i = 0; i < particles.length; i++) {
		particles[i].paint();
	}
}

/* Calculate force between particles p1 and p2 */
function calculateForce(p1, p2, vector) {
	// GravitationalForce = GravityConstant * (mass1 * mass2) / dist^2
	// reference: http://csep10.phys.utk.edu/astr161/lect/history/newtongrav.html
	return gravity * (p1.mass * p2.mass) / Math.pow(vector.magnitude, 2);
}

/* Update the velocity of all particles using gravity constant while checking
 * for collisions with each other.
 */
function updateVelocity(particles) {
	for (var i = 0; i < particles.length; i++) {
		forceSum = new Vector(0, 0);

		for (var j = 0; j < particles.length; j++) {
			if (j != i) {
				// create vector for calculations relating these 2 particles
				var vector = new Vector(particles[i].x - particles[j].x,
					                      particles[i].y - particles[j].y);

				// check if the particle radii are overlapping
				if (vector.magnitude < particles[i].radius + particles[j].radius) {
					// have the larger particle absorb the smaller
					if (particles[i].mass > particles[j].mass) {
						particles[i].absorb(particles[j]);
					} else {
						particles[j].absorb(particles[i]);
					}
				} else { // not colliding
					var force = calculateForce(particles[i], particles[j], vector)

  				forceSum.x -= Math.abs(force * (vector.x / vector.magnitude)) * Math.sign(vector.x);
  				forceSum.y -= Math.abs(force * (vector.y / vector.magnitude)) * Math.sign(vector.y);
				}
			}
		}

		// apply total force applied to this particle to its velocity
		particles[i].velocity.x += forceSum.x / particles[i].mass;
		particles[i].velocity.y += forceSum.y / particles[i].mass;
	}
}

/* Apply velocity of each particle to its position */
function applyVelocity(particles) {
	for (var i = 0; i < particles.length; i++) {
		particles[i].x += particles[i].velocity.x;
		particles[i].y += particles[i].velocity.y;
	}
}
