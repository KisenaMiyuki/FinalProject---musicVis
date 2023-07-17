class RidgePlot {
  constructor() {
    this.name = "Ridge Plot";
  }

  plotStartX = width / 5;
  plotWidth = (width / 5) * 3;
  plotEndX = this.plotStartX + this.plotWidth;
  plotEndY = height / 5;
  plotStartY = height - this.plotEndY;

  waveGraph = [];
  newLineIntervalFrame = 10;
  graphSpeedPPF = 3; // Pixel per frame

  draw() {
    push();

    background(0);
    stroke(0, 125, 200);
    strokeWeight(2);
    noFill();
    //     - add a new line to the waveGraph every <30> frames
    if (frameCount % this.newLineIntervalFrame == 0) {
      this.addWave();
    }
    //     - each frame clear the canvas, decrease y-coord of lines, and redraw
    for (let i = 0; i < this.waveGraph.length; i++) {
      // for every wave in graph
      const currentWave = this.waveGraph[i];

      // =============== Original improvement code ===============
      // determine its up-moving speed
      // using first vertex y-coordinate as reference
      // (plotStartY <- vertex y -> plotStartY-50px) === (1 <-> graphSpeedPPF)
      let calculatedSpeed = map(
        currentWave[0].y,
        this.plotStartY,
        this.plotStartY - 50,
        0.5,
        this.graphSpeedPPF
      );
      let constrainedSpeed = constrain(
        calculatedSpeed,
        0.5,
        this.graphSpeedPPF
      );
      // =============== End of original improvement code ===============

      // Make a line drawing
      beginShape();
      for (let j = 0; j < currentWave.length; j++) {
        // for every vertex in that wave
        const currentVertex = currentWave[j];
        // move it up
        currentVertex.y -= constrainedSpeed;
        // draw a vertex for the polygon
        vertex(currentVertex.x, currentVertex.y);
      }
      endShape();

      //     - if line's y-coord less than <y>, remove line fron array
      if (currentWave[0].y <= this.plotEndY) {
        this.waveGraph.splice(i, 1);
      }
    }

    pop();
  }

  // 2. add in music FFT spectrum input
  // Function addWave:
  // specify a number of points to make a wave and push it to the plot
  addWave() {
    let fftWaveform = fourier.waveform();
    let outputWave = [];
    let lowScale = 20; // scaling factor for wave vertex near ends
    let highScale = 100; // scaling factor for wave vertex around middle

    // For each element in output of fft.waveform():
    for (let i = 0; i < fftWaveform.length; i++) {
      if (i % 20 == 0) {
        this.generateLine(i, fftWaveform, outputWave, lowScale, highScale);
      }
    }

    // Push the finished wave to the plot
    this.waveGraph.push(outputWave);
  }

  generateLine(i, fftWaveform, outputWave, lowScale, highScale) {
    // map x coordinate of vertices to entire length of plot
    let waveVertexX = map(
      i,
      0,
      fftWaveform.length,
      this.plotStartX,
      this.plotEndX
    );
    // map y coordinate so that vertices close to ends have low scaling
    if (i < fftWaveform.length * 0.25 || i > fftWaveform.length * 0.75) {
      outputWave.push({
        x: waveVertexX,
        y: this.plotStartY + map(fftWaveform[i], -1, 1, -lowScale, lowScale),
      });
      //    and near middle have high scaling
    } else {
      outputWave.push({
        x: waveVertexX,
        y: this.plotStartY + map(fftWaveform[i], -1, 1, -highScale, highScale),
      });
    }
  }
}
