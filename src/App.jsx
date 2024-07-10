import { useState, useEffect, useRef } from 'react'; // Import necessary hooks from React
import './App.css'; // Import CSS for styling

function App() {
  // State variables
  const [breakLength, setBreakLength] = useState(5); // Break length in minutes
  const [sessionLength, setSessionLength] = useState(25); // Session length in minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Time left in seconds
  const [isRunning, setIsRunning] = useState(false); // Boolean to track if the timer is running
  const [isSession, setIsSession] = useState(true); // Boolean to track if it's a session or break period
  const [isPaused, setIsPaused] = useState(true); // Boolean to track if the timer is paused

  // References
  const intervalRef = useRef(null); // Reference for the interval timer
  const beepRef = useRef(null); // Reference for the audio element

  // useEffect to handle the timer countdown
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft === 0) {
            beepRef.current.play(); // Play beep sound when timer reaches 0
            if (isSession) {
              setIsSession(false); // Switch to break period
              return breakLength * 60; // Set time left to break length in seconds
            } else {
              setIsSession(true); // Switch to session period
              return sessionLength * 60; // Set time left to session length in seconds
            }
          }
          return prevTimeLeft - 1; // Decrement time left by 1 second
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current); // Clear interval if timer is not running
    }
    return () => clearInterval(intervalRef.current); // Cleanup interval timer on component unmount
  }, [isRunning, breakLength, sessionLength, isSession]);

  // Function to reset the timer
  const resetTimer = () => {
    clearInterval(intervalRef.current); // Clear interval timer
    setIsRunning(false); // Set isRunning to false
    setIsPaused(true); // Set isPaused to true
    setBreakLength(5); // Reset break length to 5 minutes
    setSessionLength(25); // Reset session length to 25 minutes
    setTimeLeft(25 * 60); // Reset time left to 25 minutes in seconds
    setIsSession(true); // Set to session period
    beepRef.current.pause(); // Pause the beep audio
    beepRef.current.currentTime = 0; // Rewind the beep audio
  };

  // Function to handle start/stop button click
  const handleStartStop = () => {
    setIsRunning((prevIsRunning) => !prevIsRunning); // Toggle isRunning state
    setIsPaused((prevIsPaused) => !prevIsPaused); // Toggle isPaused state
  };

  // Functions to increment/decrement break length
  const handleBreakIncrement = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1); // Increment break length by 1 minute
    }
  };

  const handleBreakDecrement = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1); // Decrement break length by 1 minute
    }
  };

  // Functions to increment/decrement session length
  const handleSessionIncrement = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1); // Increment session length by 1 minute
      if (!isRunning) {
        setTimeLeft((sessionLength + 1) * 60); // Update time left if timer is not running
      }
    }
  };

  const handleSessionDecrement = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1); // Decrement session length by 1 minute
      if (!isRunning) {
        setTimeLeft((sessionLength - 1) * 60); // Update time left if timer is not running
      }
    }
  };

  // Function to format time in mm:ss format
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60); // Calculate minutes
    const seconds = timeInSeconds % 60; // Calculate seconds
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // Format time as mm:ss
  };

  return (
    <div className="App">
      <div className="circle">
        <svg width="300" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(110,110)">
            <circle r="100" className="e-c-base" />
            <g transform="rotate(-90)">
              <circle r="100" className="e-c-progress" style={{ strokeDasharray: Math.PI * 2 * 100, strokeDashoffset: -Math.PI * 2 * 100 * (timeLeft / (isSession ? sessionLength * 60 : breakLength * 60)) }} />
              <g id="e-pointer">
                <circle cx="100" cy="0" r="8" className="e-c-pointer" style={{ transform: `rotate(${360 * (timeLeft / (isSession ? sessionLength * 60 : breakLength * 60))}deg)` }} />
              </g>
            </g>
          </g>
        </svg>
        <div className="timer-container">
          <div className="labels">
            <div id="break-label">Break</div>
            <div id="session-label">Session</div>
          </div>
          <div className="setters">
            <div className="break-set">
              <button id="break-decrement" onClick={handleBreakDecrement}>-</button>
              <span id="break-length">{breakLength}</span>
              <button id="break-increment" onClick={handleBreakIncrement}>+</button>
            </div>
            <div className="session-set">
              <button id="session-decrement" onClick={handleSessionDecrement}>-</button>
              <span id="session-length">{sessionLength}</span>
              <button id="session-increment" onClick={handleSessionIncrement}>+</button>
            </div>
          </div>
          <div className="controls">
            <div id="timer-label">{isSession ? "Session" : "Break"}</div>
            <div id="time-left">{formatTime(timeLeft)}</div>
            <button id="start_stop" onClick={handleStartStop}>{isRunning ? 'Pause' : 'Start'}</button>
            <button id="reset" onClick={resetTimer}>Reset</button>
          </div>
        </div>
      </div>
      <audio id="beep" ref={beepRef} src="https://ipfs.io/ipfs/QmWH6SPnzRd2SZy3QZPMrS1wSRFwc76fsEzfJ6TRjhemcq" />
    </div>
  );
}

export default App;




