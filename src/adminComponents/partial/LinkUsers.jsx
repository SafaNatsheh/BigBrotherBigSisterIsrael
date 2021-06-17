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
            discon: false,
            numofpri:3,
            didup:false
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
        }, 1500);

    }
    isValid = async (querySnapshot, type) => {

        if (type === "חניך" && querySnapshot.empty && this.state.discon === true && this.state.lnkstudid !== "") {
            var con = window.confirm("האם אתה בטוח לבצונך לנתק את החניך ?")
            if (con) {
                let querySnapshot = await
                    this.usersRef.where('id', '==', this.state.mentorId)
                    .limit(1)
                    .get()
                console.log(querySnapshot)
                    if(querySnapshot && querySnapshot.docs.length>0) {
                        querySnapshot.docs[0].ref.update({link_user: ""})
                    }

                 querySnapshot = await this.usersRef.where('id', '==', this.state.lnkstudid)
                    .limit(1)
                    .get()
                   if(querySnapshot) {
                       querySnapshot.forEach((doc) => {
                               doc.ref.update({link_user: ""})
                           }
                       );
                   }
                querySnapshot = await firebase.firestore().collection('Chats').get()
                    querySnapshot.docs.forEach(doc => {
                        if (doc.data().type === "private") {
                            console.log(doc.data().members[0].id)
                            console.log(this.state.lnkstudid)
                            if (doc.data().members[0].id === this.state.lnkstudid) {
                                doc.ref.delete();
                            }
                        }
                    });


                console.log("המשתמשים עודכנו בהצלחה!");
                alert("עודכן בהצלחה!\n");
                this.setState({ studentId: "" , mentorId: "" , mentorRef: "" , studentRef: ""});
                this.fillpepl();

                return;
            }
            else {
                return;
            }
        }
        else if (querySnapshot.empty) {
            alert("ה" + type + " לא קיים במערכת")
            throw Error(500);
        }
        querySnapshot.forEach(doc => {
            if (doc.data().link_user != null && doc.data().link_user !== "" && this.state.discon === false) {
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
            .then((querySnapshot) => {
                this.isValid(querySnapshot, "חניך")
            })
            .then(() => {
                this.usersRef.where('id', '==', mentorId).limit(1).get()
                    .then((querySnapshot) =>
                    {this.isValid(querySnapshot, "חונך")})
                })
            .then(async () => {
                if (this.state.discon === false) {
                var con = window.confirm("האם אתה בטוח לבצונך לקשר את החונך " + this.state.mentorName + " לחניך " + this.state.studentName + "?")
                if (con) {
                    this.linkUser(studentId);
                    this.linkUser(mentorId);

                    var map1 ={id: studentId,name: this.state.studentName}
                    var map2 ={id: mentorId,name: this.state.mentorName}
                    const arr=[map1,map2]
                    await firebase.firestore().collection('Chats').add(
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
            }})
            .catch(() => {
                console.log("Error in adding new user")});
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
                        <u> קישור חןנך לחניך</u>
                    </h1>
                </header>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label className="first-link-input-btn" htmlFor="inputLinkFirstName">תעודת זהות חונך</label>

                        <input
                            type="text"
                            className="form-control"
                            id="inputLinkFirstName"
                            value={this.state.teachsrch}
                            placeholder="שם חונך"
                            title="שם פרטי"
                            onChange={(e) => this.setState({ teachsrch: e.target.value })}
                        />
                        <h5>

                            <input type='checkbox' className='people_check' onChange={(e)=> {
                                if (this.state.lnkstat === "0"){
                                    this.setState({ lnkstat: "1" });
                                }
                                else {
                                    this.setState({ lnkstat: "0" });
                                }
                                if (this.state.mentorId !== "") {
                                    document.getElementById(this.state.mentorId).checked = false;
                                    this.setState({mentorId: "" , studentId: ""})
                                }
                                this.setState({lnkstudid: ""})
                            }
                        } />
                        ללא קישור

                        </h5>
                        <br></br>
                        <h5>מספר עדיפויות
                        <select
                            required id="inputState"
                            className="form-control"
                            value={this.state.numofpri}
                            onChange={(e) => this.setState({ numofpri: parseInt(e.target.value , 10)})}>
                            <option id="ff" disabled value="0">בחר תשובה</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </select>
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
                .filter(person => person.type ==="חונך" && person.first !== "true" && (person.link_user == null || person.link_user === "") ).filter(person => person.fName.indexOf(this.state.teachsrch)>-1)
                .map((person) => (
                    <tr><td>{person.id}</td><td>{person.fName +" "+ person.lName}</td><td>{person.email}</td>

                        <td person_id={person.id}><input type='checkbox' id = {person.id} className='people_check' onChange={(e)=> {

                            if (this.state.mentorId === "") {
                                this.setState({mentorId: e.target.id , discon: false , mentorRef: "" , lnkstudid: ""});
                            }
                            else if (e.target.id === this.state.mentorId) {
                                this.setState({mentorId: "" , discon: false , mentorRef: "" , lnkstudid: ""});
                            }
                            else {
                                document.getElementById(this.state.mentorId).checked = false;
                                this.setState({mentorId: e.target.id , discon: false , mentorRef: "" , lnkstudid: ""});
                            }
                            if (this.state.lnkstudid !== "") {
                                document.getElementById(this.state.lnkstudid).checked = false;
                                this.setState({lnkstudid: "" , discon: false , mentorRef: ""});
                            }
                            if (this.state.studentId !== "") {
                                document.getElementById(this.state.studentId).checked = false;
                                this.setState({studentId: "" , discon: false , mentorRef: "" , lnkstudid: ""});
                            }

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
                            this.setState({mentorId: e.target.id , discon: false , mentorRef: "" , lnkstudid: ""});
                        }
                        else if (e.target.id === this.state.mentorId) {
                            this.setState({mentorId: "" , discon: false , mentorRef: "" , lnkstudid: ""});
                        }
                        else {
                            document.getElementById(this.state.mentorId).checked = false;
                            this.setState({mentorId: e.target.id , discon: false , mentorRef: "" , lnkstudid: ""});
                        }
                        if (this.state.lnkstudid !== "") {
                            document.getElementById(this.state.lnkstudid).checked = false;
                            this.setState({lnkstudid: "" , discon: false , mentorRef: ""})
                        }
                        if (this.state.studentId !== "") {
                            document.getElementById(this.state.studentId).checked = false;
                            this.setState({studentId: "" , discon: false , mentorRef: "" , lnkstudid: ""})
                            }
                    }
                    } />
                    </td>
                </tr>
            )))
    }
    renderSecondTable (){
        console.log("rend")
        if (this.state.mentorId === "") {
            return null;
        }

        this.usersRef.where('id', '==', this.state.mentorId)
            .limit(1)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                         if (this.state.mentorId === doc.data().id && this.state.discon === false && this.state.mentorRef !== doc.id) {
                             this.setState({mentorRef: doc.id})
                         }
                    }
                );
            })

        //display second table either not connected or || already connected to mentor selected if yes && select this student || if it hase been unselected only display it || if there is an connected user that is not up to score priority change priority

        var lists = [];
        var nwlst = 0;
        var mins = 0;
        for (var i = 0 ; i < this.state.numofpri ; i++) {

                lists.push(<tr>
                    <td>  </td>
                    <td>  </td>
                    <td> {"עדיפות "+(i+1)} </td>
                    <td>  </td>
                </tr>)

            lists.push(this.state.people
                .filter(person => person.type === "חניך" && person.first !== "true" && this.gtscor(person.first , person.birthDate) === i && (person.link_user === undefined || person.link_user === "" || ((person.link_user === this.state.mentorRef) && (this.state.discon === false) && (this.state.lnkstudid = person.id) && (this.state.studentId = person.id)) || (person.link_user === this.state.mentorRef)) && (nwlst = 1) || ((person.link_user !== "") && (person.link_user === this.state.mentorRef) && (this.state.numofpri < this.gtscor(person.first , person.birthDate) && (this.state.numofpri = this.gtscor(person.first , person.birthDate) + 1) && console.log(person.fName))))
                .map((person) => (
                    <tr><td>{person.id}</td><td>{person.fName +" "+ person.lName}</td><td>{person.email}</td>
                        <td person_id={person.id}><input id = {person.id} type='checkbox' className='people_check' onChange={(e)=> {
                            if (this.state.studentId === "") {
                                this.setState({studentId: e.target.id});
                            }
                            else if (e.target.id !== this.state.studentId) {
                                document.getElementById(this.state.studentId).checked = false;
                                this.setState({studentId: e.target.id , discon: true});
                            }
                            else {
                                this.setState({studentId: "" , discon: true});
                            }


                        }
                        }/></td></tr>
                )))

            if (this.state.lnkstudid !== "" && this.state.didup === false) {
                this.setState({didup: true});
            }

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
        var menscr = "";

        if (studscr === undefined) {
            return 0;
        }

        var scr = 0;
        this.state.people.forEach(person =>
            {
                if(person.id === this.state.mentorId && person.first !== "true" && person.type === "חונך"){
                    menscr = person.first
                }
            })


        if (menscr === "") {
            console.log("error in database")
            return -1;
        }

        var ind  = 0
        var ind2 = 0
        for (var ln  = 0 ; ln < 12 ; ) {
            if (studscr[ind] === "/") {
                ln++;
                ind++;
                while (menscr[ind2] !== "/") {
                    ind2++
                }
                ind2++;
                continue;
            }

            else if (menscr[ind2] === "/") {
                ln++;
                ind2++;
                while (studscr[ind] !== "/") {
                    ind++
                }
                ind++;
                continue;
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
                    if (ln !== 0) {
                        scr++;
                    }

                }
                else {
                    let newDate = new Date();
                    let year = newDate.getFullYear();
                    let number = parseInt(date.substring(0,4) , 10 );
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