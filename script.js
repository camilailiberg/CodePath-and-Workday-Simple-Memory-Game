// global constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1500; //how long to wait before starting playback of the clue sequence


//Global Variables
var pattern = [2, 8, 4, 1, 7, 3, 5, 6];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;  //must be between 0.0 and 1.0
var guessCounter = 0 ; // keeps treack of user's progress 0 - 8.
var clueHoldTime = 1000; //how long to hold each clue's light/sound
var mistakes = 0 ;
//timer vars
var timerVar ;
var t ;

function startGame(){
  //initialize game variables
  progress = 0;
  gamePlaying = true
  mistakes = 0 ;
  clueHoldTime = 1000 ;
  
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  randomPattern() ;
  playClueSequence();
  resetTimer() ;
}

function stopGame() {
  clearInterval(timerVar);
  document.getElementById("timer").innerHTML = 12 ;
  gamePlaying = false ;
  document.getElementById ("startBtn").classList.remove("hidden") ;
  document.getElementById ("stopBtn").classList.add("hidden") ;
}

// Decrease the time for the use to hea and repeat the patter by one second and
// checks if the player ran out of time.
function myTimer() {
  t = t - 1
  document.getElementById("timer").innerHTML = t ;
  if ( t < 0 )
  {
    timeout() ;
  }
}
// Resets the timer back to 12.
function resetTimer(){
  clearInterval(timerVar) ;
  t = 12 ;
  timerVar = setInterval(myTimer, 1000);
}
// Alerts the use that s/he run out of time to hear and repeat the pattern.
function timeout(){
  stopGame();
  alert("Game Over. You run out of time.");
}

// Function to generate a random pattern.
function randomPattern() 
{
  
  var numbers = new Array(); // variable that make sure every button in the pattern is different
  var rand = Math.floor(Math.random() * 8) + 1 ; // generating random number
  
  for( let i = 0 ; i <= 7 ; i++ ) // for every number in pattern . . .
  {
    
    // make sure every button is part of the pattern
    for ( let j = 0 ; j < numbers.length ; j++ ) // for every element in numbers
      {
        while (numbers[j] == rand) // if button already in pattern
          {
            rand = Math.floor(Math.random() * 8) + 1 ; // update random number
            j = 0 ; // resets j to 0 to check new random number does not equal a previous random number in the pattern
          }
      }
    pattern[ i ] = rand ; // set number at index i to rand in pattern
    numbers[i] = rand ; // set number at index i to rand in numbers
    rand = Math.floor(Math.random() * 8) + 1 ; // update random number
    
  }
  
}

function playTone(btn,len){ 
  
  startTone(btn) ;
  tonePlaying = true
  setTimeout(function(){
    stopTone(btn)
  },len)
}
function startTone(btn)
{
  if(!tonePlaying)
  {
    document.getElementById(btn).play();
    tonePlaying = true
  }
}
function stopTone(btn){
  document.getElementById(btn).pause();
  document.getElementById(btn).currentTime = 0;
  tonePlaying = false ;
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
  clueHoldTime = clueHoldTime - 100;
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
  if(!gamePlaying)
  {
    return;
  }
     
  if (btn == pattern[guessCounter] ) // if the guess is correct . . .
  {
    console.log("Got the button " + btn + " rigth")
    if( guessCounter == progress )// if turn is over . . .
    {

      console.log("guesscounter = " + guessCounter + " and progress = " + progress)
      if ( progress == pattern.length - 1 ) // if game ended and player won . . .
      {

        console.log("Game Over. You Wonnnn!!!")
        winGame() ;

      }
      else //if player got the patter right but it is not the last turn . . .
      {

        console.log("Incrementing progress to " + progress + "+ 1")
        progress++ ; // increment progress
        playClueSequence() ; // play next clue sequence
        resetTimer() ;

      }

    }
    else // if turn is not over but patter is correct so far
    {

      console.log("Guess counter = " + guessCounter + " and progress = " + progress)
      guessCounter++ ; // increase guesscounter

    }

  }
  else // if got patter wrong
  {

    console.log("Got the button " + btn + " wrong")
    mistakes++ ; // keep count of how many mistakes the user has made

    if ( mistakes == 3 ) // if the user has made 3 mistakes . . .
    {
      loseGame() ; // lose game

    }
    else // if less than 3 mistakes . . .
    {
      alert("You can try again") ; // letting the player know that they can try again
      clueHoldTime = clueHoldTime + 100 ; // so that the velocity that the images are shown does not increase when repeating the pattern
      playClueSequence(); // repeat the correct sequence to the player
      resetTimer() ;

    }    

  }
  
}