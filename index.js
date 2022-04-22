// Global Constants
const clueHoldTime = 1000; 
const cluePauseTime = 333;
const nextClueWaitTime = 1000;
// Global Variables 
var pattern = Array.from({length: 8}, () => Math.floor((Math.random() * 4) + 1)) // Modified, so game picks different pattern each time
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;

function startGame() {
    progress = 0;
    gamePlaying = true;
    document.getElementById("startBtn").classList.add("hidden");
    document.getElementById("stopBtn").classList.remove("hidden");
    playClueSequence();
}

function stopGame() {
    gamePlaying = false;
    document.getElementById("startBtn").classList.remove("hidden");
    document.getElementById("stopBtn").classList.add("hidden");
}

function loseGame() {
    stopGame();
    alert("Game Over, You Lost.");
}

function winGame() {
    stopGame();
    alert("Game Over, You Win!");

}

function lightButton(btn) {
    document.getElementById("button" + btn).classList.add("lit");
}

function clearButton(btn) {
    document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
    if (gamePlaying) {
        lightButton(btn);
        playTone(btn, clueHoldTime);
        setTimeout(clearButton, clueHoldTime, btn);
    }
}

function playClueSequence() {
    guessCounter = 0;
    let delay = nextClueWaitTime;
    for (let i = 0; i <= progress; i++) {
        console.log("Play single clue: " + pattern[i] + " in " + delay + "ms");
        setTimeout(playSingleClue, delay, pattern[i])
        delay += clueHoldTime;
        delay += cluePauseTime;
    }
}

function guess(btn) {
    console.log("User guessed: " + btn);
    if (!gamePlaying) {
        return;
    }
    // Game Logic goes here
    if (pattern[guessCounter] == btn) {
        if (guessCounter == progress) {
            if (pattern.length - 1 == progress) {
                winGame();
                return;
            }
            else {
                progress++;
                playClueSequence();
            }
        }
        else {
            guessCounter++;
        } 
    }
    else {
        loseGame();
        return;
    } 
}

// Sound Synthesis Functions
const freqMap = {
    1: 261.6,
    2: 329.6,
    3: 392,
    4: 466.2
  }
  function playTone(btn,len){ 
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
    setTimeout(function(){
      stopTone()
    },len)
  }
  function startTone(btn){
    if(!tonePlaying){
      context.resume()
      o.frequency.value = freqMap[btn]
      g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
      context.resume()
      tonePlaying = true
    }
  }
  function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
  }
  
  // Page Initialization
  // Init Sound Synthesizer
  var AudioContext = window.AudioContext || window.webkitAudioContext 
  var context = new AudioContext()
  var o = context.createOscillator()
  var g = context.createGain()
  g.connect(context.destination)
  g.gain.setValueAtTime(0,context.currentTime)
  o.connect(g)
  o.start(0)
