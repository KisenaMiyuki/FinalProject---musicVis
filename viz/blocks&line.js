class BlocksAndLine {
  constructor() {
    this.name = "Blocks And Line";
  }

  noiseScale = 0.01;
  noisePan = 0;

  rotationThreshold = 200;
  rot = 0;

  draw() {
    push();

    background(0);
    fill(255);
    noStroke();

    fourier.analyze();

    let b = fourier.getEnergy("bass");
    let t = fourier.getEnergy("treble");

    // ========== All musviz goes here ==========
    // ellipse(width / 2 - 255, height / 2, b);
    // ellipse(width / 2 + 255, height / 2, t);

    this.rotatingBlocks(b);
    this.drawNoiseLine(b);

    pop();
  }

  rotatingBlocks(energy) {
    // Control rotation of all blocks based on energy threshold
    if (energy < this.rotationThreshold) {
      this.rot += 0.01;
    }

    // Make block size react to energy
    let blockSize = map(energy, 0, 255, 20, 100);

    // Draw the blocks
    push();
    rectMode(CENTER);
    translate(width / 2, height / 2);
    rotate(this.rot);
    fill(255, 0, 0);

    let incr = width / (10 - 1);
    for (let widthCounter = 0; widthCounter < 11; widthCounter++) {
      for(let heightCounter = 0; heightCounter < 11; heightCounter++) {
        rect(widthCounter * incr - width / 2, heightCounter * incr - height, blockSize, blockSize);
      }
    }
    pop();
  }

  drawNoiseLine(energy) {
    push();

    // Bring the origin point to the center of canvas
    translate(width / 2, height / 2);

    // Setting styles
    noFill();
    stroke(125, 255, 0);
    strokeWeight(2);

    // Draw a line with 100 points
    beginShape();
    for (let i = 0; i < 100; i += 2) {
      // # Offset the points on the line according a noise function
      // extreme 50px up/down
      // - noiseScale : We are taking advantage of noise function generates the same output with same input
      //                think of the noise seed as the "coordinate" on that noise graph
      // - noisePan : added value to the "coordinate", increments over time to create moving effect
      //
      // let offset = map(noise(i * noiseScale + noisePan), 0, 1, -50, 50);
      // vertex(i, height / 2 + offset);

      // # Specify some random coordinate
      // noise() acts like a random number generator that generates a ratio 0~1
      // We scale it to +-100px range around the origin (which is set to center of canvas)
      // since x & y are the same, graph will be like curve from y = x
      //                (refresh page to see different point scattering pattern)
      //
      // let x = map(noise(i * noiseScale + noisePan), 0, 1, -100, 100);
      // let y = map(noise(i * noiseScale + noisePan), 0, 1, -100, 100);

      // # Make the graph not a straight line
      // By arbitrarily offset one of the noise "coordinate"
      // In this case offseting y's noise "coordinate"
      //                (try small values like 0.01 then large values to see difference)
      //                (always able to enable noisePan grow to see it animated)
      let x = map(noise(i * this.noiseScale + this.noisePan), 0, 1, -300, 300);
      let y = map(
        noise(i * this.noiseScale + this.noisePan + 0.5),
        0,
        1,
        -300,
        300
      );

      vertex(x, y);
    }
    endShape();

    if (energy > 180) {
      this.noisePan += 0.02;
    }

    pop();
  }
}
