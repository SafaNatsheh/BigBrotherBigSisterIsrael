import React, { Component } from "react";
//import "./Meetings.css";
import firebase from "../config/Firebase"
//import MeetingList from "../navBarComponents/meetingComponents/MeetingList"

class addMeetings extends Component {

    constructor(props) {
        super(props);
        this.state = {

            userId:"",
            date: "",
            startTime:"",
            endTime:"",
            travelTime:"",
            description: "",
            totalTime:0,
            MeetingsListRef:"",
            userRef:""
        };

    }


componentDidMount() {
        this.state.MeetingsListRef =firebase.firestore().collection('MeetingsList');
}





    handleSubmit = async (event) => {
        event.preventDefault();
        var isSure;

        isSure = window.confirm(
            "האם ברצונך לקבוע פגישה:\nבתאריך: " +
            this.state.date +
            "\nבשעה: " +
            this.state.time +
            "\nבמיקום: " +
            this.state.place
        );

        if (isSure) {
            if(this.MeetingsListRef.doc(firebase.auth().currentUser.uid) ===undefined){
                this.MeetingsListRef.add({title: firebase.auth().currentUser.uid})
            }
            this.MeetingsListRef.doc(firebase.auth().currentUser.uid).get()
                .then((doc) => {
                    doc.ref.update({date: this.state.date, startTime:this.state.startTime, endTime:this.state.endTime,travelTime:this.state.travelTime, description:this.state.description})

                })
                .catch((e) => console.log(e.name))
        }
    }

//---------------------------**********************************************************************

    render() {

        return (
            <div className="main-background" >
                <form className="meeting-form" onSubmit={this.handleSubmit}>
                    <br />
                    <div className="form-group">
                        <h1 className="meeting-title"><u>הוספת פגישה</u></h1>

                        <label
                            className="fLabels"
                            style={{ float: "right" }}
                            htmlFor="date"
                        >
                            תאריך
                        </label>
                        <input
                            onChange={(e) => this.setState({ date: e.target.value })}
                            type="date"
                            className="form-control"
                            id="date"
                            placeholder="תאריך הפגישה"
                            value={this.state.date}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label
                            className="fLabels"
                            style={{ float: "right" }}
                            htmlFor="start hour"
                        >
                            שעת התחלה
                        </label>
                        <input
                            onChange={(e) => this.setState({ startTime: e.target.value })}
                            type="time"
                            className="form-control"
                            id="hour"
                            placeholder="שעת התחלה "

                            required
                        />
                    </div>

                    <div className="form-group">
                        <label
                            className="fLabels"
                            style={{ float: "right" }}
                            htmlFor="end hour"
                        >
                            שעת סיום
                        </label>
                        <input
                            onChange={(e) => this.setState({ endTime: e.target.value })}
                            type="time"
                            className="form-control"
                            id="hour"
                            placeholder="שעת סיום  "

                            required
                        />
                    </div>
                    <div className="form-group ">
                        <label htmlFor="inputState"> בחר אורך נסיעה בדקות</label>
                        <select
                            required id="inputState"
                            className="form-control">

                        <option id="ff" disabled value={this.state.travelTime}> בחר אורך נסיעה בדקות </option>
                        <option >30 </option>
                        <option >60 </option>

                        <option >90 </option>
                        <option >120</option>
                    </select>
            </div>
        <div className="form-group">
            <label
                className="fLabels"
                style={{ float: "right" }}
                htmlFor="description"
            >
                {/* <!-description--> */}
                תיאור
            </label>
            <input
                onChange={(e) => this.setState({ description: e.target.value })}
                type="text"
                className="form-control"
                id="description"
                value={this.state.description}
                placeholder="תיאור"
            />
        </div>

        <button
            className="btn btn-success setup-meeting-btn"
            style={{ float: "right", marginRight: "700px" }}
        >
            הוסף  פגישה!{" "}
        </button>
    </form>

    </div >
    );
    }
}

export default addMeetings;
