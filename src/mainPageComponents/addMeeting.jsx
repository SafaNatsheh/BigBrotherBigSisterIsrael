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
            travelTime:0,
            description: "",
            MeetingsListRef:"",
            userRef:""
        };

    }


componentDidMount() {
    this.usersRef = firebase.firestore().collection('Users');
    this.uid = firebase.auth().currentUser.uid;//*******//user unique id
    this.usersRef.doc(this.uid).get()
         .then((doc) => {
             this.setState({ userId: doc.data().id });

         })
         .catch((e) => console.log(e.name));

     this.state.MeetingsListRef =firebase.firestore().collection('MeetingsList');
}


 handleSubmit = async (event) => {
     event.preventDefault();

     let isSure;

     isSure = window.confirm(
         "האם ברצונך להוסיף פגישה:\nבתאריך: " +
         this.state.date +
         "\nשהתחילה ב  : " +
         this.state.startTime +
         "\nוהסתימה ב : " +
         this.state.endTime
     );

     if (this.state.endTime< this.state.startTime) {
         alert("שעת סיום לא תקינה ");
         return;
     }
     let today = new Date();
     if (this.state.date > today) {
         alert("לא ניתנן להכניס תאריך בעתיד ");
         return;
     }
     if (this.state.date === today) {
         if (this.state.startTime > today.getTime()) {
             alert("לא ניתנן להכניס שעה בעתיד ");
             return;
         }
         return;
     }


     if (isSure) {

         firebase.firestore().collection("MeetingsList").add({
             userId:this.state.userId,
             date: this.state.date,
             startTime:this.state.startTime,
             endTime:this.state.endTime,
             travelTime:this.state.travelTime,
             description: this.state.description,

         }).then(() => {
             console.log("Document successfully written!");
         });

         // this.setState({ userId:"" });
         // this.setState({  date: "" });
         // this.setState({  startTime:"" });
         // this.setState({ endTime:"" });
         // this.setState({  travelTime:0 });
         // this.setState({  description: "" });

     }


 }

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
                         onChange={(e) => this.setState({ date: new Date(e.target.value) })}
                         type="date"
                         className="form-control"
                         id="date"
                         placeholder="תאריך הפגישה"
                         //value={this.state.date}
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
                         className="form-control"
                         type="number"
                         value={this.state.travelTime}
                         defaultValue={60}
                         onChange={(e) => this.setState({ travelTime: e.target.value })}
                     >

                     <option id="ff" disabled value=""> בחר אורך נסיעה בדקות </option>
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
