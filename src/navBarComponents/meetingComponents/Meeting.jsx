import React, { Component } from "react";
import "./Meetings.css";
import firebase from "../../config/Firebase"
import MeetingList from "./MeetingList"

class Meeting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meetings: [],
      date: "",
      time: "",
      place: "",
      description: "",
      loadingFromFirebase: true,
      lastMeetingVisible: null,
      loadedAll: false,
      futureLength: 0,
      loadingPastMeetings: false,
      scheduled: false
    };
    this.newDocId = "";
    this.myMeetingsRef = firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid).collection('Meetings');
    firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid).get()
      .then((doc) => {
        this.linkUser = doc.data().link_user;
        this.mateMeetingsRef = firebase.firestore().collection('Users').doc(this.linkUser).collection('Meetings');
      })
      .catch((e) => console.log(e.name))
  }

  getMeetings = () => {
    var newMeetingObj;
    var futureMeetings = this.myMeetingsRef
      .where('timeStamp', ">=", ((Date.now() / 1000) - 7200))
      .orderBy("timeStamp", "desc")

    futureMeetings
      .get()
      .then((querySnap) => {
        this.setState({ lastMeetingVisible: querySnap.docs[querySnap.docs.length - 1], futureLength: querySnap.docs.length }, () => {
          if (querySnap.empty)
            this.setState({ lastMeetingVisible: { timeStamp: ((Date.now() / 1000) - 7200) } })
          else if (typeof (this.state.lastMeetingVisible) === 'undefined')
            this.setState({ loadedAll: true })
        })
        querySnap.forEach((doc) => {
          newMeetingObj = {};
          Object.assign(newMeetingObj, doc.data());
          newMeetingObj.doc_id = doc.id;
          this.setState({ meetings: [...this.state.meetings, newMeetingObj] })
        })
      })
      .then(() => this.setState({ loadingFromFirebase: false }))
      .catch((e) => console.log(e.name))
  }

  componentDidMount() {
    this.getMeetings();
  }

  updateTableAfterDelete = (meetingsArr) => {
    this.setState({ meetings: [...meetingsArr] });
  }

  loadPrev = () => {
    if (typeof (this.state.lastMeetingVisible) === 'undefined')
      return;
    var startFrom;
    if (typeof (this.state.lastMeetingVisible.timeStamp) === 'undefined')
      startFrom = this.state.lastMeetingVisible.data().timeStamp;
    else
      startFrom = this.state.lastMeetingVisible.timeStamp;
    this.setState({ loadingPastMeetings: true });
    var newMeetingObj;
    this.myMeetingsRef
      .orderBy("timeStamp", "desc")
      .startAfter(startFrom)
      .limit(5)
      .get()
      .then((querySnap) => {
        if (querySnap.docs.length < 5)
          this.setState({ loadedAll: true })
        if (querySnap.docs.length === 0)
          return;
        this.setState({ lastMeetingVisible: querySnap.docs[querySnap.docs.length - 1] })
        querySnap.forEach((doc) => {
          newMeetingObj = {};
          Object.assign(newMeetingObj, doc.data());
          newMeetingObj.doc_id = doc.id;
          this.setState({ meetings: [...this.state.meetings, newMeetingObj] });
        })
      })
      .then(() => this.setState({ loadingPastMeetings: false }))
      .catch((e) => console.log(e.name))
  }

  getTable = () => {
    return <MeetingList
      className="meeting-list"
      meetingsArr={this.state.meetings}
      loading={this.state.loadingFromFirebase}
      myUser={this.myMeetingsRef}
      linkUser={this.mateMeetingsRef}
      updateRef={this.updateTableAfterDelete}
      loadPrev={this.loadPrev}
      loadedAll={this.state.loadedAll}
      futureLength={this.state.futureLength}
      loadingPastMeetings={this.state.loadingPastMeetings}
    />
  }

  handleSubmit = (event) => {
    event.preventDefault();
    var isSure;
    if (!this.state.scheduled) {
      isSure = window.confirm(
        "האם ברצונך לקבוע פגישה:\nבתאריך: " +
        this.state.date +
        "\nבשעה: " +
        this.state.time +
        "\nבמיקום: " +
        this.state.place
      );
    }
    else
      isSure = window.confirm(
        "האם ברצונך לקבוע 13 פגישות קבועות לשלושת החודשים הקרובים:\nהחל מתאריך: " +
        this.state.date +
        "\nבשעה: " +
        this.state.time +
        "\nבמיקום: " +
        this.state.place
      );
    if (isSure) {
      var amount_of_meetings = this.state.scheduled ? 13 : 1;
      var dates = [], newMeetings = [], newMeetingObj = [];
      for (let i = 0; i < amount_of_meetings; i++) {
        var nextDate = (new Date(Date.parse(this.state.date) + (7 * 24 * 60 * 60 * 1000) * i));
        dates.push(nextDate.getFullYear() + "-" + (nextDate.getMonth() + 1) + "-" + nextDate.getDate());
        var time_stamp = (((Date.parse(dates[i] + " " + this.state.time)) / 1000));
        newMeetings.push({
          date: dates[i],
          timeStamp: time_stamp,
          time: this.state.time,
          place: this.state.place,
          description: this.state.description
        })
        newMeetingObj.push({});
        this.myMeetingsRef.add(newMeetings[i])
          .then((docRef) => {
            this.newDocId = docRef.id;
            this.mateMeetingsRef.doc(docRef.id).set(newMeetings[i]);
          })
          .then(() => {
            if (!this.state.scheduled && this.state.date !== "") {
              alert(
                "נקבעה פגישה בתאריך: " +
                this.state.date +
                "\nבשעה: " +
                this.state.time +
                "\nבמיקום: " +
                this.state.place
              );
            }
            else if (i === 0)
              alert(
                "נקבעו 13 פגישות קבועות לשלושת החודשים הקרובים."
              );
            Object.assign(newMeetingObj[i], newMeetings[i]);
            newMeetingObj[i].doc_id = this.newDocId;
            const d = [].concat(this.state.meetings).concat(newMeetingObj[i]).sort((a, b) => this.sortFunc(a, b));
            this.setState({
              meetings: [...d],
              date: "", time: "", place: "", description: "", scheduled: false
            });
          })
          .catch((e) => console.log(e.name));
      }
    }
  }

  sortFunc = (a, b) => {
    if (a.timeStamp > b.timeStamp)
      return -1;
    if (a.timeStamp < b.timeStamp)
      return 1;
    return 0;
  }

  render() {
    return (
      <div className="main-background" >
        <form className="meeting-form" onSubmit={this.handleSubmit}>
          <br />
          <div className="form-group">
            <h1 className="meeting-title"><u>קביעת פגישה</u></h1>

            <label
              className="fLabels"
              style={{ float: "right" }}
              htmlFor="date"
            >
              תאריך הפגישה
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
              htmlFor="hour"
            >
              שעת הפגישה
            </label>
            <input
              onChange={(e) => this.setState({ time: e.target.value })}
              type="time"
              className="form-control"
              id="hour"
              placeholder="שעת הפגישה"
              value={this.state.time}
              required
            />
          </div>
          <div className="form-group">
            <label
              className="fLabels"
              style={{ float: "right" }}
              htmlFor="place"
            >
              מיקום הפגישה
            </label>
            <input
              onChange={(e) => this.setState({ place: e.target.value })}
              type="text"
              className="form-control"
              id="place"
              placeholder="מיקום הפגישה"
              value={this.state.place}
              required
            />
          </div>
          <div className="form-group">
            <label
              className="fLabels"
              style={{ float: "right" }}
              htmlFor="description"
            >
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
          <div className="form-group">
            <input
              type="checkbox"
              className="form-check-input w-25"
              id="scheduledMeeting"
              checked={this.state.scheduled}
              onChange={(e) => this.setState({ scheduled: !this.state.scheduled })}
            />
            
          </div>
          
            <label
              className="form-check-label check-meeting-lbl w-75"
              style={{ float: "right"  }}
              htmlFor="description"
            >
              <div className = "meeting-thi">
              פגישות קבועות - לשלושת החודשים הקרובים
              </div>
            </label>
            
          <br />
          <button
            className="btn btn-success setup-meeting-btn"
            style={{ float: "right", marginRight: "700px" }}
          >
            קבע פגישה!{" "}
          </button>
        </form>
        {this.getTable()}
      </div >
      
    );
  }
}

export default Meeting;
