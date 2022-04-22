// Global Constants
const clueHoldTime = 1000; 
const cluePauseTime = 333;
const nextClueWaitTime = 1000;
// Global Variables 
var pattern = Array.from({length: 8}, () => Math.floor((Math.random() * 5) + 1)) // Modified, so game picks different pattern each time
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;
var wrongCount = 0;

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
    location.reload();
}

function winGame() {
    stopGame();
    alert("Game Over, You Win!");
    location.reload();
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
    if (pattern[guessCounter] == btn) { // Checks button clicked to see if it matches with pattern list at given index
        if (guessCounter == progress) { // if so, then check if our guess counter matches our progress count. If not, then increment guess count by 1
            if (pattern.length - 1 == progress) { // If we reach the entire length of the list then we win, then exit
                winGame();
                return;
            }
            else { // If length does not match progress, then we increment progress by 1 and add a new clue sequence
                progress++;
                playClueSequence();
            }
        }
        else {
            guessCounter++;
        } 
    }
    else { // If guess is wrong, we add to number of wrong attempts. A red X gets added and concatenated to the empty string on the page
        wrongCount++;
        document.getElementById("wrong").innerHTML += 'X';
        if (wrongCount > 2) { // If three wrong attempts, you lose
            loseGame();
            return;
        }
    } 
}

// Sound Synthesis Functions
const freqMap = {
    1: 130.8, // C
    2: 146.8, // D
    3: 164.8, // E
    4: 174.6, // F
    5: 261.6  // C ^
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

