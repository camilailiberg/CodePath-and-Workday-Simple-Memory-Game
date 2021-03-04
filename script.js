// global constants
const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
var guessCounter = 0 ; // keeps treack of user's progress 0 - 8.

//Global Variables
var pattern = [2, 2, 4, 3, 2, 1, 2, 4];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0

function startGame(){
  //initialize game variables
  progress = 0;
  gamePlaying = true
  
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  gamePlaying = false ;
  document.getElementById ("startBtn").classList.remove("hidden") ;
  document.getElementById ("stopBtn").classList.add("hidden") ;
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
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

//functions for lighting or clearing a button
function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}

function playClueSequence(){
  guessCounter = 0 ;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}
function winGame(){
  stopGame();
  alert("Game Over. You won!");
}

function guess(btn){
  
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  
  if (btn == pattern[guessCounter] ) // if the guess is correct . . .
  {
    
    console.log("Got the button " + btn + " rigth")
    if( guessCounter == progress )// if turn is over . . .
    {
      
      console.log("guesscounter = " + guessCounter + " and progress = " + progress)
      if ( progress == 7 ) // if game ended and player won . . .
      {
        
        console.log("Game Over. You Wonnnn!!!")
        winGame() ;
        
      }
      else //if player got the patter right but it is not the last turn . . .
      {
        
        console.log("Incrementing progress to " + progress + "+ 1")
        progress++ ; // increment progress
        playClueSequence() ; // play next clue sequence
        
      }
      
    }
    else // if turn is not over but patter is correct do far
      {
        
        console.log("Guess counter = " + guessCounter + " and progress = " + progress)
        guessCounter++ ; // increase guesscounter
        
      }
    
  }
  else // if got patter wrong
  {
    
    console.log("Got the button " + btn + " wrong")
    loseGame() ; // lose game
    
  }
  
}