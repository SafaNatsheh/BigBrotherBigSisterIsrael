import React, { Component } from "react";
import "./MessageCube.css";
import {auth} from "../../../../config/Firebase";

class MessageCube extends Component {
    state = {
        lastMes: React.createRef()
    }
    componentDidMount() {
        auth.onAuthStateChanged(user => {
            console.log(user)
            if (!user) {
                window.location.href = "/"
                return
            }
            this.state.lastMes.current.scrollIntoView({behavior: "smooth"})
        })
    }

    returnTime = () => {
        var date = new Date();
        var curTime;
        if (date.getMinutes() <= 9 && date.getMinutes() >= 0)
            curTime = date.getHours() + ":0" + date.getMinutes();
        else
            curTime = date.getHours() + ":" + date.getMinutes();
        return curTime
    }
    render() {
        return (
            <div
                ref={this.state.lastMes}
                style={this.props.st}
                className="msg-box">

                <legend
                    className="msg-time-stamp" >
                    נשלח בשעה:  {this.returnTime()}
                </legend>

                <h1
                    className="actual-msg" >
                    {this.props.mes}
                </h1>
            </div>
        );
    }
}

export default MessageCube;
