var song, uploadedSong;
var mp3FileName;
var sliderVolumeDiv, sliderVolumeEmoji, sliderVolume;
var playPauseButton;
var amplitude, frequency, wave;
var hsb1;

var volumeHistory = [];
var bandWidth;
var peakDetect;

var emojis = [];
var em = [];

let canvas;



function setup() {

  // GENERAL SETUP
  let dimension = min(windowWidth / 1.5, windowHeight / 1.5);
  canvas = createCanvas(dimension, dimension);
  canvas.parent('canvas');
  canvas.style("box-shadow: 0 0 0.5em 0 rgb(115, 121, 133);")
  angleMode(DEGREES);
  colorMode(HSB);
  background(51);
  hsb1 = 0;

  // SET UP FOR SOUND FILE
  song = loadSound("80degrees.mp3", loaded); // little hack so it works

  // SET UP FOR AMPLITUDE
  amplitude = new p5.Amplitude(0.9); //0.9 is smoothing

  // SET UP FOR FREQUENCY
  let numberOfBands = 64;
  frequency = new p5.FFT(0.9, numberOfBands); //0.9 is smoothing
  bandWidth = width / numberOfBands;
  peakDetect = new p5.PeakDetect();

  // BUTTONS
  playPauseButton = createButton("⏯");
  playPauseButton.parent('canvas-util-div');
  playPauseButton.class('playpause');
  playPauseButton.attribute('disabled', '');
  playPauseButton.mousePressed(togglePlaying);

  // SLIDERS
  sliderVolumeDiv = createDiv();
  sliderVolumeDiv.id('volume-slider-div');
  sliderVolumeDiv.parent('canvas-util-div');
  sliderVolume = createSlider(0, 1, 0.5, 0.01);
  sliderVolume.parent('volume-slider-div');
  sliderVolume.class('volume-slider');
  sliderVolume.mouseMoved(sliderEmoji);
  sliderVolumeEmoji = createP('🔉'); //🔇🔈🔉🔊
  sliderVolumeEmoji.id('volume-emoji');
  sliderVolumeEmoji.style("font-size: 1.5rem; margin: 0 3% 0 3%; padding: 1%; cursor: default;");
  sliderVolumeEmoji.parent('volume-slider-div');
}

// PAGE & SOUND

function loadDefaultMp3() {
  song.pause();
  playPauseButton.attribute('disabled', '');
  song = loadSound("80degrees.mp3", loaded);
  console.log('clicked');
}

function loadUploadedMp3(event) {
  uploadedSong = URL.createObjectURL(event.target.files[0]);
  song.pause();
  playPauseButton.attribute('disabled', '');
  song = loadSound(uploadedSong, loaded);
  console.log('uploaded');
}

function togglePlaying() {
  if (!song.isPlaying()) {
    song.play();
    playPauseButton.html("⏸");

  } else {
    song.pause();
    playPauseButton.html("▶️");
  }
}

function loaded() {
  console.log("loaded");
  playPauseButton.removeAttribute('disabled');
  playPauseButton.html("⏯");
}

function sliderEmoji() {
  if (sliderVolume.value() == 0) {
    sliderVolumeEmoji.html('🔇');
  }
  else if (sliderVolume.value() == 1) {
    sliderVolumeEmoji.html('🔊');
  }
  else if (sliderVolume.value() <= 0.5) {
    sliderVolumeEmoji.html('🔈');
  }
  else {
    sliderVolumeEmoji.html('🔉');
  }
}

// VISUALIZER

function drawAmplitudeEllipse() {

  var volume = amplitude.getLevel(); //range of volume between 0 and 0.3
  var diameter = map(volume, 0, 0.3, 10, 200);

  fill(255, 0, 255);
  ellipse(width/2, height/2, diameter, diameter);
}

function drawFlatAmplitudeLevels() {
  push();
  var volume = amplitude.getLevel(); //range of volume between 0 and 0.3
  if (song.isPlaying()){
    volumeHistory.push(volume);
  }
  stroke(255);
  noFill();
  beginShape();
  for (var i = 0; i < volumeHistory.length; i++) {
    var y = map(volumeHistory[i], 0, 1, height / 2, 0);
    vertex(i, y);
  }
  endShape();
  pop();
  if (volumeHistory.length > width - 50) {
    volumeHistory.splice(0,1)
  }

  stroke(255, 0, 0);
  line(volumeHistory.length, 0, volumeHistory.length, height);

  fill(255, 0, 255);
}

function drawCircularAmplitudeLevels() {
  var volume = amplitude.getLevel(); //range of volume between 0 and 0.3
  if (song.isPlaying()){
    volumeHistory.push(volume);
  }
  stroke(255);
  //noFill();
  var c = sliderColor.value()
  fill(145,c,200);
  // IDEA: slider to change color

  translate(width / 2, height / 2);
  beginShape();
  for (var i = 0; i < 360; i++) {
    var r = map(volumeHistory[i], 0, 1, 10, width / 2);
    var x = r * cos(i);
    var y = r * sin(i);

    vertex(x, y);
  }
  endShape();

  if (volumeHistory.length > 360) {
    volumeHistory.splice(0,1);
  }
}

function drawFlatFrequencyLevels() {
  background(51);
  var spectrum = frequency.analyze();
  stroke(255);
  for (var i = 0; i < spectrum.length; i++) {
    var amp = spectrum[i];
    let spectrumRange = 256;
    var y = map(amp, 0, spectrumRange, height, 0);
    rect(i * bandWidth, y, bandWidth - 2, height - y);

  }
  noFill();
}

function drawCircularFrequencyLevels() {
  background(51);
  var spectrum = frequency.analyze();
  stroke(255);
  translate(width/2, height/2); // translate to the center

  beginShape();
  for (var i = 0; i < spectrum.length; i++) {
    var angle = map(i, 0, spectrum.length, 0, 360)
    var amp = sp3[i];
    let spectrumRange = 256;
    var r = map(amp, 0, spectrumRange, 20, 100);

    var x = r * cos(angle);
    var y = r * sin(angle);
    stroke(i, 255, 255);
    line(0, 0, x, y);

  }
  endShape();

}

function checkNonZeroArray(array) {
  for (let v of array) {
    if (v != 0) {
      return true;
    }
  }
  return false;
}

function draw1() {


  background(hsb1, 50, 100);

  let spectrumRange = 256;
  var spectrum = frequency.analyze();
  peakDetect.update(frequency);
  var l = spectrum.length;
  var sp1 = spectrum.slice(0,l/4);
  var sp2 = spectrum.slice(l/4, l/2);
  var sp3 = spectrum.slice(l/2, 3*l/2);

  if (checkNonZeroArray(spectrum)) { // array all zeroes
    hsb1 = (hsb1 + 1) % 360;
  }


  // frequency animation
  push();
  var centerAnimation = spectrum.slice(l/4, 3*l/4);
  translate(width/2, height/2); // translate to the center
  beginShape();
  for (var i = 0; i < centerAnimation.length; i++) {
    var angle = map(i, 0, centerAnimation.length, 0, 360)
    var amp = centerAnimation[i];
    var r = map(amp, 0, spectrumRange, width/8, width/2); // tuning

    var x = r * cos(angle);
    var y = r * sin(angle);
    
    stroke(i, 255, 255);
    //scale(1.5);
    //vertex(x, y);
    line(0, 0, x, y);

  }
  endShape();
  pop();


  // amplitude animation
  push();
  var volume = amplitude.getLevel(); //range of volume between 0 and 0.3
  if (song.isPlaying()){
    volumeHistory.push(volume);
  }
  strokeWeight(3);
  var hsb2 = (hsb1 + 180) % 360;
  stroke(hsb2, 50, 100);
  fill(hsb2, 50, 100);


  beginShape();
  vertex(0,0);
  for (var i = 0; i < volumeHistory.length; i++) {
    var y = map(volumeHistory[i], 0, 1, 0+height/100, height/4);
    vertex(i, y);
  }
  vertex(width,0);
  endShape();
  beginShape();
  vertex(width, height);
  for (var i = 0; i < volumeHistory.length; i++) {
    var y = map(volumeHistory[i], 0, 1, height-height/100, 3*height/4);
    vertex(width-i, y);
  }
  vertex(0, height);
  endShape();
  if (volumeHistory.length > width) {
    volumeHistory.splice(0,1);
  }
  pop();

  
  // emojis
  push();
  if (mouseIsPressed && mouseX > 0 && mouseX <= width && mouseY > 0 && mouseY <= height) {

    // find a way to make interval a bit bigger
    addEmoji(mouseX, mouseY);
  }

  drawEmojis();
  pop();
  
}

function drawEmojis() {
  for (var i = 0; i < em.length; i++) {
    let emoji = em[i];
    push();
    textSize(emoji.size);
    text(emoji.emoji, emoji.x, emoji.y);
    pop();
    emoji.y = emoji.y0 + emoji.vy * emoji.t + 5 * emoji.t * emoji.t;
    emoji.x = emoji.x0 + emoji.vx * emoji.t
    emoji.t += 0.1;
    if (emoji.x > width || emoji.y > height) {
      em.splice(i,1);
    }
  }
}

function addEmoji(x, y) {
  // idea: emoji palettes
  em.push(
    {
      x0: x,
      y0: y,
      x: x,
      y: y,
      vx: getRandomFloat(-10, 10),
      vy: getRandomFloat(-20,0),
      t: 0,
      emoji: random(['🔔', '🔊', '🎶', '💫', '💤', '🧿', '💣', '🌈', '🍩', '👁', '🫀', '🍄', '🪁', '💊', '🧩']),
      size: getRandomFloat(10,30) //make it relative to canvas size
    }
  )
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function draw() {
  song.setVolume(sliderVolume.value());
  draw1();
}