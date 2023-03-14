import React from 'react';
import './style.css'
let countDown;
class FocusClock extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            breakTime: 5, 
            sessionTime: 25, 
            sessionMinutes: 25, 
            sessionSeconds: "00", 
            timerIsOn:false, 
            pause: false, 
            session: "Session"
        };
    }

    //Increment Break Time
    incrementBreakTime = () => {
        if(this.state.breakTime < 60 && this.state.timerIsOn === false){
            this.setState({
                breakTime : this.state.breakTime + 1
            });
        }
    };
    //Decrement Break Time
    decrementBreakTime = () => {
        if(this.state.breakTime > 1 && this.state.timerIsOn === false){
            this.setState({
                breakTime : this.state.breakTime - 1
            });
        }
    };
    //Increment Session Time
    incrementSession = () => {
        if(this.state.sessionTime < 60 && 
            this.state.timerIsOn === false && 
            this.state.sessionTime < 9){
            this.setState({
                sessionTime: this.state.sessionTime + 1, 
                sessionMinutes: "0" + (parseInt(this.state.sessionMinutes) +  1), 
                sessionSeconds: "00"
            });
        }
        else if(this.state.sessionTime < 60 && 
            this.state.timerIsOn === false && 
            this.state.sessionTime >= 9){
            this.setState({
                sessionTime: this.state.sessionTime + 1, 
                sessionMinutes: parseInt(this.state.sessionMinutes) + 1, 
                sessionSeconds: "00"
            })
        }
    }
    //Decrement Session Time    
    decrementSession = () => {
        if (
          this.state.sessionTime > 1 &&
          this.state.sessionTime > 10 &&
          this.state.timerIsOn === false
        ) {
          this.setState({
            sessionTime: this.state.sessionTime - 1,
            sessionMinutes: this.state.sessionMinutes - 1,
            sessionSeconds: "00",
          });
        } else if (this.state.sessionTime > 1 && this.state.sessionTime <= 10) {
          this.setState({
            sessionTime: this.state.sessionTime - 1,
            sessionMinutes: "0" + (this.state.sessionMinutes - 1),
            sessionSeconds: "00",
          });
        }
      };

    //timer start/stop
    timer = () =>{
        if(this.state.timerIsOn === false){
            this.setState({
                timerIsOn: true
            })
            let seconds = this.state.sessionMinutes * 60 + parseInt(this.state.sessionSeconds);
            const now  = Date.now();
            const then = now + seconds * 1000;

            countDown = setInterval(() => {
                const secondsLeft = Math.round((then - Date.now()) / 1000);
                if(this.state.sessionMinutes === "00" && this.state.sessionSeconds === "00"){
                    document.getElementById("beep").play();
                }
                //check to stop it
                if(secondsLeft < 0){
                    clearInterval(countDown);
                    this.break();
                    return;
                }
                //display it
                this.displayTimeLeft(secondsLeft);
            }, 1000);
        }
        else{
            clearInterval(countDown);
            let minuteToPause = this.state.sessionMinutes;
            let secondsToPause = this.state.sessionSeconds;
            this.setState({
                timerIsOn: false, sessionMinutes: minuteToPause, sessionSeconds: secondsToPause
            });
        }
    };

    //display the timer
    displayTimeLeft = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainderSeconds = seconds % 60;
        if (remainderSeconds >= 10 && minutes >= 10){
            this.setState({
                sessionMinutes: minutes,
                sessionSeconds: remainderSeconds
            });
        }
        else if(remainderSeconds <= 9){
            this.setState({
                sessionMinutes: "0" + minutes,
                sessionSeconds: "0" + remainderSeconds
            });
        }
        else{
            this.setState({
                sessionMinutes: "0" + minutes,
                sessionSeconds: remainderSeconds
            });
        }
    };

    break = () => {
        if(this.state.pause === false){
            if(this.state.breakTime > 9){
                this.setState({
                    session: "Break",
                    sessionMinutes: this.state.breakTime,
                    sessionSeconds:"00",
                    timerIsOn: false,
                    pause: true
                })
                this.timer()
            }
            else{
                this.setState({
                    session: "Break",
                    sessionMinutes: "0" + this.state.breakTime,
                    sessionSeconds: "00",
                    timerIsOn: false,
                    pause: true
                });
                this.timer()
            }
        }
        else{
            if(this.state.sessionTime > 9){
                this.setState({
                    session: "Session",
                    sessionMinutes: this.state.sessionTime,
                    sessionSeconds: "00",
                    timerIsOn: false,
                    pause: false
                });
                this.timer()
            }
            else{
                this.setState({
                    session: "Session",
                    sessionMinutes: "0" + this.state.sessionTime,
                    sessionSeconds: "00",
                    timerIsOn: false,
                    pause: false
                });
                this.timer()
            }

        }
    };
    //reset time
    resetTime = () => {
        clearInterval(countDown);
        this.setState({
            session: "Session", breakTime: 5, sessionTime: 25, sessionMinutes: 25, sessionSeconds: "00", timerIsOn: false, pause: false
        })
        document.getElementById("beep").currentTime = 0;
        document.getElementById("beep").pause();
    };

    render() {
        return (
        <div id="container">
            <div id = "container-margin"><h1>⏰Focus Clock</h1></div>
            <div id = "container-outer">

                <div id = "container-inner-sessions">
                    {/* Break */}
                    <div className = "break">
                        <div id="break-label">
                            <p>Break Length</p>
                            <div id="break-control">
                                <div id = "break-decrement" className="material-icons" onClick = {() => this.decrementBreakTime()}>chevron_left</div>
                                <div id = "break-length">{this.state.breakTime}</div>
                                <div id = "break-increment" className="material-icons" onClick = {() => this.incrementBreakTime()}>chevron_right</div>
                            </div>
                        </div>
                    </div>
                    {/* Session */}
                    <div className = "session">
                        <div id="session-label">
                            <p>Session Length</p>
                            <div id="session-control">
                                <div id = "session-decrement" className="material-icons" onClick={() => this.decrementSession()}>chevron_left</div>
                                <div id = "session-length">{this.state.sessionTime}</div>
                                <div id = "session-increment" className="material-icons" onClick = {() => this.incrementSession()}>chevron_right</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id = "container-inner-timer">
                    {/* Timer */}
                    <div className="timer">
                        <div id = "timer-label">{this.state.session}</div>
                        <div id = "time-left">
                            <audio id="beep" src="https://www.pacdv.com/sounds/interface_sound_effects/sound10.mp3" type="audio/mp3"></audio>
                            {this.state.sessionMinutes}:{this.state.sessionSeconds}
                        </div>
                    </div>
                    {/* Buttons */}
                    <div className = "buttons">
                        <div id = "start_stop" className="material-icons" onClick={() => this.timer()}>play_circle {/* stop_circle */}</div>
                        <div id = "reset" className = "material-icons" onClick={() => this.resetTime()}>replay</div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default FocusClock;