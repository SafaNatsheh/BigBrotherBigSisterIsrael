import React, { Component } from "react";
import "./Meetings.css";
import firebase, {auth} from "../config/Firebase"
import MeetingList from "../navBarComponents/meetingComponents/MeetingList"

class Meetings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            meetings: [],
            date: "",
            time: "",
            checkList :[],
            place: "",
            search: "",
            description: "",
            linkZoom: "",
            people:[],
            filterFn : { fn: items => { return items; } },
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
                this.type = doc.data().type;
                // this.linkUser = doc.data().link_user;
                // this.mateMeetingsRef = firebase.firestore().collection('Users').doc(this.linkUser).collection('Meetings');
            })
            .catch((e) => console.log(e.name))
        firebase.firestore().collection('Users').get().then((querySnapshot) => {
            querySnapshot.docs.map((doc) => {

                this.state.people.push({
                    uid:doc.id,
                    id: doc.data().id,
                    email: doc.data().email,
                    name: doc.data().fName + " " + doc.data().lName,
                    type:  doc.data().type
                });
                return null;
            });
        });
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
        auth.onAuthStateChanged(user=> {
            console.log(user)
            if (!user) {
                window.location.href = "/"
                return
            }

            this.getMeetings();
        })
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

    handleSubmit = async (event) => {
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
                    send_list: this.state.checkList,
                    timeStamp: time_stamp,
                    time: this.state.time,
                    place: this.state.place,
                    linkZoom: this.state.linkZoom,
                    description: this.state.description
                })
                newMeetingObj.push({});
                let docRef=  this.myMeetingsRef.add(newMeetings[i])
                this.newDocId = docRef.id;
                // await this.myMeetingsRef.docs(docRef.id).set(newMeetings[i]);


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
                this.state.checkList.forEach(async user=>{
                    await firebase.firestore().collection('Users').doc(user.uid).collection('Meetings').doc(this.newDocId).set(newMeetings[i]);

                })
                newMeetingObj[i].doc_id = this.newDocId;
                const d = [].concat(this.state.meetings).concat(newMeetingObj[i]).sort((a, b) => this.sortFunc(a, b));
                this.setState({
                    meetings: [...d],
                    date: "", time: "", place: "", description: "", scheduled: false
                });

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

    maketable(){

        if (this.type === "רכז")
        {
            return (this.state.people
                .filter(person => person.name.indexOf(this.state.search)>-1)
                .filter(person => person.type !== "אדמין")
                .map((person) => (
                    <tr><td>{person.name}</td><td>{person.id}</td><td>{person.type}</td>
                        <td person_id={person.id}><input type='checkbox' className='people_check'  onChange={()=>{
                            this.state.checkList.push(person)}}/></td></tr>
                )))
        }
        else if (this.type === "מדריך")
        {
            return (this.state.people
                .filter(person => person.name.indexOf(this.state.search)>-1)
                .filter(person => person.type !== "אדמין")
                .filter(person => person.type !== "רכז")
                .map((person) => (
                    <tr><td>{person.name}</td><td>{person.id}</td><td>{person.type}</td>
                        <td person_id={person.id}><input type='checkbox' className='people_check' onChange={()=>this.state.checkList.push(person)}/></td></tr>
                )))
        }
        else if (this.type === "חונך")
        {
            return (this.state.people
                .filter(person => person.name.indexOf(this.state.search)>-1)
                .filter(person => person.type !== "אדמין")
                .filter(person => person.type !== "רכז")
                .filter(person => person.type !== "מדריך")
                .filter(person => person.type !== "חונך")
                .map((person) => (
                    <tr><td>{person.name}</td><td>{person.id}</td><td>{person.type}</td>
                        <td person_id={person.id}><input type='checkbox' className='people_check'  onChange={()=>this.state.checkList.push(person)}/></td></tr>
                )))
        }
        else

            return (this.state.people
                .filter(person => person.name.indexOf(this.state.search)>-1)
                .map((person,key) => (
                    <tr key={key}>
                        <td>{person.name}</td><td>{person.id}</td><td>{person.type}</td>
                        <td person_id={person.id}><input type='checkbox' className='people_check'  onChange={()=>
                        {
                            this.state.checkList.push(person)

                        }

                        }/></td></tr>
                )))
    }


    render() {




        return (
            <div className="main-background" >
                <form className="meeting-form" onSubmit={this.handleSubmit}>
                    <br />
                    <div className="form-1">
                        

                        <label
                            className="fLabels"
                            style={{ float: "right" }}
                            htmlFor="date"
                        ><h6>תאריך הפגישה</h6>
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
                    <div className = 'time'>
                        <label
                            className="fLabels"
                            style={{ float: "right" }}
                            htmlFor="hour"
                        ><h6>שעת הפגישה</h6>
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
                    <div className="place">
                        <label
                            className="fLabels"
                            style={{ float: "right" }}
                            htmlFor="place"
                        ><h6>מיקום הפגישה</h6>
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
                    <div className="descrip">
                        <label
                            className="fLabels "
                            style={{ float: "right" }}
                            htmlFor="description"
                        ><h6>תיאור</h6>
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
                    <div className="link-Zoom">
                        <label
                            className="fLabels ="
                            style={{ float: "right" }}
                            htmlFor="linkZoom"
                        ><h6>קישור זום</h6>
                        </label>
                        <input
                            onChange={(e) => this.setState({ linkZoom: e.target.value })}
                            type="text"
                            className="form-control"
                            style={{width: "505px"}}
                            id="linkZoom"
                            value={this.state.linkZoom}
                            placeholder="קישור זום"
                        />
                    </div>



                    <div className="form-group">
                        <div className= "table-w">
                        <label
                            className="fLabels"
                            style={{ float: "right" }}
                            htmlFor="description"
                        >
                        </label>
                        <h6>משתתפים</h6>
                        <input
                            className="radius_to"
                            type="text"
                            placeholder="חיפוש"
                            onChange={(e) => this.setState({ search: e.target.value })}
                        />
                        </div>
                        <table className="table table-bordered"  >

                            <div className ='container__table'>
                                <thead>

                                <tr>
                                    <th>שם</th>
                                    <th>ת.ז</th>
                                    <th>סוג משתמש</th>
                                    <th>בחר</th>

                                </tr>
                                </thead>
                                <tbody >

                                {this.maketable()}


                                </tbody>
                            </div>
                        </table>
                    </div>



                    <div className="form-group">
                        <input
                            type="checkbox"
                            className="form-check-input w-25"
                            id="scheduledMeeting"
                            style={{ float: "right" , marginTop:"258px" , marginRight:"40px" }}

                            checked={this.state.scheduled}
                            onChange={(e) => this.setState({ scheduled: !this.state.scheduled })}
                        />
                        <div className = "meeting-thi">
                        <label
                            className="form-check-label check-meeting-lbl w-75"
                            style={{ float: "right" ,  marginRight:"17px" , position:"absloute" }}
                            htmlFor="description"
                        >
                            פגישות קבועות - לשלושת החודשים הקרובים
                        </label>
                        </div>
                    </div>
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

export default Meetings;
