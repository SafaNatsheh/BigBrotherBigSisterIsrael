import React, { Component } from "react";
import firebase,{auth} from "../../config/Firebase"
import "./LinkUsers.css";

class LinkUsers extends Component {
    constructor() {
        super();
        this.state = {
            studentId: "",
            mentorId: "",
            studentName: "",
            mentorName: "",
            studentRef: "",
            mentorRef: "",
            teachsrch: "",
            people:[],
            chekstat: "",
            lnkstat: "0",
            lnkstudid: "",
            discon: false
        }
        this.usersRef = firebase.firestore().collection('Users');
    }
      componentDidMount() {
       auth.onAuthStateChanged(user=>{
            if(!user)
            {
                window.location.href="/"
                return
            }

        var people = [];
        this.usersRef
            .get()
            .then(queryShot => {
                queryShot.forEach(
                    (doc) => {
                        people.push(doc.data())

                    }
                )
            }).then(()=>{
            this.setState({ people: people })
        })
            .catch((e) => console.log(e.name));

       })
    }
    fillpepl() {
        setTimeout(function(){
        window.location.reload(1);
        }, 1200);

    }
    isValid = (querySnapshot, type) => {
        if (type === "חניך" && querySnapshot.empty && this.state.discon === true && this.state.lnkstudid !== "") {
            var con = window.confirm("האם אתה בטוח לבצונך לנתק את החניך ?")
            if (con) {
                this.usersRef.where('id', '==', this.state.mentorId)
                    .limit(1)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                                    doc.ref.update({ link_user: "" })
                            }
                        );
                    }).catch((e) => console.log(e.name));

                this.usersRef.where('id', '==', this.state.lnkstudid)
                    .limit(1)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                                    doc.ref.update({ link_user: "" })
                            }
                        );
                    }).catch((e) => console.log(e.name));

                firebase.firestore().collection('Chats').get().then((querySnapshot) => {
                    querySnapshot.docs.forEach(doc => {
                        if (doc.data().type === "private") {
                            console.log(doc.data().members[0].id)
                            console.log(this.state.lnkstudid)
                            if (doc.data().members[0].id === this.state.lnkstudid) {
                                doc.ref.delete();
                            }
                        }
                    });
                })

                console.log("המשתמשים עודכנו בהצלחה!");
                alert("עודכן בהצלחה!\n");
                this.setState({ studentId: "" , mentorId: "" , discon: false , mentorRef: "" , studentRef: ""});
                this.fillpepl();

                return;
            }
            else {
                throw Error(500);
            }
        }
        else if (querySnapshot.empty && this.state.discon === false) {
            alert("ה" + type + " לא קיים במערכת")
            throw Error(500);
        }
        querySnapshot.forEach(doc => {
            if (doc.data().type !== type) {
                alert("המשתמש אינו " + type);
                throw Error(500);
            }
            if (doc.data().link_user != null && doc.data().link_user !== "") {
                alert("המשתמש כבר מחובר");
                throw Error(500);
            }
            if (type === "חניך")
                this.setState({ studentRef: doc.ref.id, studentName: doc.data().fName + " " + doc.data().lName })
            else if (type === "חונך")
                this.setState({ mentorRef: doc.ref.id, mentorName: doc.data().fName + " " + doc.data().lName })
        });
    }

    verifyUsers = () => {
        var studentId = this.state.studentId;
        var mentorId = this.state.mentorId;
        this.usersRef.where('id', '==', studentId)
            .limit(1)
            .get()
            .then((querySnapshot) => this.isValid(querySnapshot, "חניך"))
            .then(() => this.usersRef.where('id', '==', mentorId)
                .limit(1)
                .get()
                .then((querySnapshot) => this.isValid(querySnapshot, "חונך")))
            .then(() => {
                var con = window.confirm("האם אתה בטוח לבצונך לקשר את החונך " + this.state.mentorName + " לחניך " + this.state.studentName + "?")
                if (con) {
                    this.linkUser(studentId);
                    this.linkUser(mentorId);

                    var map1 ={id: studentId,name: this.state.studentName}
                    var map2 ={id: mentorId,name: this.state.mentorName}
                    const arr=[map1,map2]
                    firebase.firestore().collection('Chats').add(
                        {

                            name: "שיחה חניך חניך",
                            type: "private",
                            members: arr,
                        })

                    console.log("המשתמשים עודכנו בהצלחה!");
                    alert("עודכן בהצלחה!\n" + this.state.mentorName + " הוא החונך של " + this.state.studentName + ".");
                    this.setState({ studentId: "" , mentorId: "" , discon: false , mentorRef: "" , studentRef: ""});
                    this.fillpepl();
                }
            })
            .catch(() => console.log("Error in adding new user"));
    }

    linkUser = (curr) => {
        var studentId = this.state.studentId;
        var mentorId = this.state.mentorId;
        var studentRef = this.state.studentRef;
        var mentorRef = this.state.mentorRef;
        this.usersRef.where('id', '==', curr)
            .limit(1)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                        if (curr === studentId)
                            doc.ref.update({ link_user: mentorRef })
                        else if (curr === mentorId)
                            doc.ref.update({ link_user: studentRef })
                    }
                );
            }).catch((e) => console.log(e.name));
    }

    addLink = (event) => {
        event.preventDefault();
        this.verifyUsers();
    }

    render() {
        return (
            <form className="ad-user-form" onSubmit={this.addLink}>
                <header className="title">
                    <h1 className="add-user-h">
                        <u> קישור חניך לחונך</u>
                    </h1>
                </header>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label className="first-link-input-btn" htmlFor="inputLinkFirstName">תעודת זהות חניך</label>

                        <input
                            type="text"
                            className="form-control"
                            id="inputLinkFirstName"
                            value={this.state.teachsrch}
                            placeholder="שם חניך"
                            title="שם פרטי"
                            onChange={(e) => this.setState({ teachsrch: e.target.value })}
                        />
                        <h5>
                            ללא קישור
                            <input type='checkbox' className='people_check' onChange={(e)=> {
                                if (this.state.lnkstat === "0"){
                                    this.setState({ lnkstat: "1" });
                                }
                                else {
                                    this.setState({ lnkstat: "0" });
                                }
                                if (this.state.mentorId !== "") {
                                    document.getElementById(this.state.mentorId).checked = false;
                                    this.state.mentorId = "";
                                    this.state.studentId = "";
                                }
                                this.state.lnkstudid = "";
                            }
                        } />
                        </h5>

                        { this.state.mentorRef !== "" && this.state.discon === false && document.getElementById(this.state.lnkstudid) !== null && (document.getElementById(this.state.lnkstudid).checked = true)

                            }

                        <br/>
                        <div className ='container__table'>
                        <table className="table table-bordered">
                            <thead>
                            <tr>
                                <th>ת.ז</th>
                                <th>שם</th>
                                <th>דוא"ל</th>
                                <th>בחר</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.renderFirstTable()}
                            </tbody>
                        </table>
                        </div>
                    </div>
                    <div className="form-group col-md-6">

                        <br/>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <div className ='container__table1'>
                        <table className="table table-bordered">
                            <thead>
                            <tr>
                                <th>ת.ז</th>
                                <th>שם</th>
                                <th>דוא"ל</th>
                                <th>בחר</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.renderSecondTable()}
                            </tbody>
                        </table>
                        </div>

                        <button type="submit" className="btn btn-primary link-users-btn"
                        style={{   marginTop:"300px"  }}
                        >
                        
                            בצע פעולות
                        </button>
                        
                    </div>
                </div>
            </form>
        );
    }
    renderFirstTable (){
        if (this.state.lnkstat === "1") {

            return (this.state.people
                .filter(person => person.type ==="חונך" && person.first !== "true" && (person.link_user == null || person.link_user === "")).filter(person => person.fName.indexOf(this.state.teachsrch)>-1)
                .map((person) => (

                    <tr><td>{person.id}</td><td>{person.fName +" "+ person.lName}</td><td>{person.email}</td>

                        <td person_id={person.id}><input type='checkbox' id = {person.id} className='people_check' onChange={(e)=> {

                            if (this.state.mentorId === "") {
                                this.setState({mentorId: e.target.id});
                            }
                            else if (e.target.id === this.state.mentorId) {
                                this.setState({mentorId: ""});
                            }
                            else {
                                document.getElementById(this.state.mentorId).checked = false;
                                this.setState({mentorId: e.target.id});
                            }
                            if (this.state.lnkstudid !== "") {
                                document.getElementById(this.state.lnkstudid).checked = false;
                                this.state.lnkstudid = "";
                            }
                            if (this.state.studentId !== "") {
                                document.getElementById(this.state.studentId).checked = false;
                                this.state.studentId = "";
                            }
                            this.state.mentorRef = "";
                            this.state.lnkstudid = "";
                            this.setState({discon: false});
                        }
                        } />
                        </td>
                    </tr>
                )))
        }
        return (this.state.people
            .filter(person => person.type ==="חונך" && person.first !== "true").filter(person => person.fName.indexOf(this.state.teachsrch)>-1)
            .map((person) => (

                <tr><td>{person.id}</td><td>{person.fName +" "+ person.lName}</td><td>{person.email}</td>
                    <td person_id={person.id}><input type='checkbox' id = {person.id} className='people_check' onChange={(e)=> {
                        if (this.state.mentorId === "") {
                            this.setState({mentorId: e.target.id});
                        }
                        else if (e.target.id === this.state.mentorId) {
                            this.setState({mentorId: ""});
                        }
                        else {
                            document.getElementById(this.state.mentorId).checked = false;
                            this.setState({mentorId: e.target.id});
                        }
                        if (this.state.lnkstudid !== "") {
                            document.getElementById(this.state.lnkstudid).checked = false;
                            this.state.lnkstudid = "";
                        }
                        if (this.state.studentId !== "") {
                            document.getElementById(this.state.studentId).checked = false;
                            this.state.studentId = "";
                        }
                        this.state.mentorRef = "";
                        this.state.lnkstudid = "";
                        this.setState({discon: false});
                    }
                    } />
                    </td>
                </tr>
            )))
    }
    renderSecondTable (){
        this.usersRef.where('id', '==', this.state.mentorId)
            .limit(1)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                         if (this.state.mentorId === doc.data().id && this.state.discon === false) {
                             this.setState({mentorRef: doc.id})
                         }
                    }
                );
            })
        if (this.state.mentorId === "") {
            return null;
        }
        //display second table either not connected or || already connected to mentor selected if yes && select this student || if it hase been unselected only display it

        var lists = [];
        var nwlst = 0;
        var mins = 0;
        for (var i = 0 ; i < 10 ; i++) {

                lists.push(<tr>
                    <td>  </td>
                    <td>  </td>
                    <td> {"עדיפות "+(i+1)} </td>
                    <td>  </td>
                </tr>)

            lists.push(this.state.people
                .filter(person => person.type === "חניך" && person.first !== "true" && this.gtscor(person.first , person.birthDate) === i && (person.link_user === undefined || person.link_user === "" || ((person.link_user === this.state.mentorRef) && (this.state.discon === false) && (this.state.lnkstudid = person.id) && (this.state.studentId = person.id)) || (person.link_user === this.state.mentorRef)) && (nwlst = 1))
                .map((person) => (
                    <tr><td>{person.id}</td><td>{person.fName +" "+ person.lName}</td><td>{person.email}</td>
                        <td person_id={person.id}><input id = {person.id} type='checkbox' className='people_check' onChange={(e)=> {
                            if (this.state.studentId === "") {
                                this.setState({studentId: e.target.id});
                            }
                            else if (e.target.id !== this.state.studentId) {
                                document.getElementById(this.state.studentId).checked = false;
                                this.setState({studentId: e.target.id});
                                this.setState({discon: true});
                            }
                            else {
                                this.setState({studentId: ""});
                                this.setState({discon: true});
                                console.log(this.state.lnkstudid);
                            }


                        }
                        }/></td></tr>
                )))
            if (nwlst > 0) {
                mins = i+1
                nwlst = 0;
            }

            let chk = lists.pop();
            if (chk == "") {
                lists.push(<tr>
                    <td>  </td>
                    <td>  </td>
                    <td> {"אין"} </td>
                    <td>  </td>
                </tr>)

            }
            else {
                lists.push(chk)
            }
            chk = null;
        }
        lists=lists.slice(0,lists.length-((i*2) - (mins*2)))

        return (lists)
    }

    gtscor(studscr , date) {
        if (studscr === undefined) {

            return 0;
        }

        let menscr= "";
        this.state.people
            .filter(person => person.type ==="חונך" && person.first !== "true" && person.id === this.state.mentorId)
            .forEach((elem) => (menscr = elem.first))
        var scr = 0;

        if (menscr === undefined) {

            return -1;
        }

        var ind  = 0
        var ind2 = 0
        for (var ln  = 0 ; ln < 12 ;) {

            if (studscr[ind] === "/") {
                ln++;
                ind++;
                while (menscr[ind2] !== "/") {
                    ind2++
                }
                ind2++;
            }

           else if (menscr[ind2] === "/") {
                ln++;
                ind2++;
                while (studscr[ind] !== "/") {
                    ind++
                }
                ind++;
            }
            if (studscr[ind] === menscr[ind2] && studscr[ind+1] === "/" && menscr[ind2+1] === "/") {
                //console.log(studscr[ind] +" "+ ind +" "+ ind2+"match"+" "+ln)
                ind++;
                ind2++;

            }
            else {
                if (ln === 0 && menscr[ind2] === "1") {
                    return -1;
                }

                if (ln !== 8) {
                    scr++;
                }
                else {
                    let newDate = new Date();
                    let year = newDate.getFullYear();
                    let number = parseInt(date.substring(0,4) , 10 ) + 1;
                    if (menscr[ind2] === "1" && ((year - number) < 5 || (year - number) > 12)) {
                        scr++;
                    }
                    else if (menscr[ind2] === "2" && ((year - number) < 12 || (year - number) > 18)) {
                        scr++;
                    }
                    else if (menscr[ind2] === "3" && (year - number) < 18) {
                        scr++;
                    }
                }

                while (menscr[ind2] !== "/") {
                    ind2++
                }
                while (studscr[ind] !== "/") {
                    ind++
                }

            }

        }

        return scr;
    }


}

export default LinkUsers;