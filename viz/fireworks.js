class Fireworks {
  constructor() {
    this.name = "Fireworks";
  }

  sampleBuffer = [];

  draw() {
    push();

    background(0);
    let spectrum = fourier.analyze();

    // sum up the energy of the spectrum
    let spectrumEnergySum = 0;
    for (let i = 0; i < spectrum.length; i++) {
      spectrumEnergySum += spectrum[i] ** 2;  // square to strengthen the effect
    };

    // detecting beat < every second >
    // [info] assume 60 frames per second
    if (this.sampleBuffer.length == 60) {
      // detect a beat ...
      // when the energy of the spectrum at this frame is greater than ...
      // the average energy of the sample buffer

      // calculate the average energy of the sample buffer
      let averageSampleBufferEnergy = this.calculateAverageEnergy(this.sampleBuffer);

      // compare current frame energy with average
      // introduce a threshold to avoid noise
      let thresholdMultiplier = 1.1;
      if (spectrumEnergySum > averageSampleBufferEnergy * thresholdMultiplier) {
        // beat detected!
        stroke(255);
        strokeWeight(4);
        noFill();
        ellipse(width / 2, height / 2, 100);
      }

      this.sampleBuffer.splice(0, 1);
    }

    // add the energy to the sample buffer < every frame >
    this.sampleBuffer.push(spectrumEnergySum);

    pop();
  }

  // ========== Helper functions ==========
  // calculate the average energy of a buffer
  calculateAverageEnergy(buffer) {
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i];
    }
    return sum / buffer.length;
  }
}