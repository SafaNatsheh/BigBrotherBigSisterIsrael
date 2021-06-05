import React, { Component } from "react";
import firebase from "../../config/Firebase"
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
<<<<<<< Updated upstream
            people:[]
=======
            search: ""
>>>>>>> Stashed changes
        }
        this.usersRef = firebase.firestore().collection('Users');
        this.people = [];
        firebase.firestore().collection('Users').get().then((querySnapshot) => {
            querySnapshot.docs.map((doc) => {
                this.people.push({
                    id: doc.data().id,
                    name: doc.data().fName + " " + doc.data().lName,
                    type:  doc.data().type,
                    email: doc.data().email
                });
                return null;
            });
        });
    }
    componentDidMount() {
        this.usersRef
            .get()
            .then(queryShot => {
                queryShot.forEach(
                    (doc) => {
                        this.setState({ people: [...this.state.people, doc.data()] })
                    }
                )
            })
            .catch((e) => console.log(e.name));

    }
    isValid = (querySnapshot, type) => {
        if (querySnapshot.empty) {
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
                    console.log("המשתמשים עודכנו בהצלחה!");
                    alert("עודכן בהצלחה!\n" + this.state.mentorName + " הוא החונך של " + this.state.studentName + ".");
                    this.setState({ studentId: "", mentorId: "" });
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

    componentDidMount() {

        var linkedUserId;
        this.usersRef
            .where('type', "==", "חונך")
            .orderBy('fName', 'asc')
            .orderBy('lName', 'asc')
            .get()
            .then(queryShot => {
                queryShot.forEach(
                    (doc) => {
                        linkedUserId = doc.data().link_user;
                        if (typeof (linkedUserId) !== 'undefined' && linkedUserId !== "") {
                            this.setState({ usersArr: [...this.state.usersArr, doc.data()] })
                            this.usersRef.doc(linkedUserId).get()
                                .then(linkedDoc => this.setState({ linkedUserArr: [...this.state.linkedUserArr, linkedDoc.data()] }))
                        }
                    }
                )
            })
            .catch((e) => console.log(e.name));
        this.usersRef
            .orderBy('type', 'desc')
            .orderBy('fName', 'asc')
            .orderBy('lName', 'asc')
            .get()
            .then(queryShot => {
                queryShot.forEach(
                    (doc) => {
                        linkedUserId = doc.data().link_user;
                        if ((typeof (doc.data().link_user) === 'undefined' || doc.data().link_user === "") &&
                            (doc.data().type === "חונך" || doc.data().type === "חניך")) {
                            var newUser = {
                                name: doc.data().fName + " " + doc.data().lName,

                                id: doc.data().id,

                            };
                            this.setState({ noLinkedUsers: [...this.state.noLinkedUsers, newUser] })
                        }
                    })
            })
            .catch((e) => console.log(e.name));
    }

    maketable(){

        if (this.type === "רכז")
        {
            return (this.people
                .filter(person => person.name.indexOf(this.state.search)>-1)
                .filter(person => person.type !== "אדמין")
                .map((person) => (
                    <tr><td>{person.id}</td><td>{person.name}</td><td>{person.type}</td>
                        <td person_id={person.id}><input type='checkbox' className='people_check' /></td></tr>
                )))
        }
        else if (this.type === "מדריך")
        {
            return (this.people
                .filter(person => person.name.indexOf(this.state.search)>-1)
                .filter(person => person.type !== "אדמין")
                .filter(person => person.type !== "רכז")
                .map((person) => (
                    <tr><td>{person.id}</td><td>{person.name}</td><td>{person.type}</td>
                        <td person_id={person.id}><input type='checkbox' className='people_check'/></td></tr>
                )))
        }
        else if (this.type === "חונך")
        {
            return (this.people
                .filter(person => person.name.indexOf(this.state.search)>-1)
                .filter(person => person.type !== "אדמין")
                .filter(person => person.type !== "רכז")
                .filter(person => person.type !== "מדריך")
                .filter(person => person.type !== "חונך")
                .map((person) => (
                    <tr><td>{person.id}</td><td>{person.name}</td><td>{person.type}</td>
                        <td person_id={person.id}><input type='checkbox' className='people_check' /></td></tr>
                )))
        }
        else

            if (this.mounted === 0) {

            }

            return (this.people
                .filter(person => person.name.indexOf(this.state.search)>-1)
                .map((person) => (
                    <tr >
                        <td>{person.id}</td><td>{person.name}</td><td>{person.type}</td>
                        <td person_id={person.id}><input type='checkbox' className='people_check' /></td></tr>
                )))
    }

    render() {
        return (
            <form className="ad-user-form" onSubmit={this.addLink}>

                <div className="form-group">
                    <label
                        className="fLabels"
                        style={{ float: "right" }}
                        htmlFor="description"
                    >


                    </label>
                    <table className="table table-bordered"  >
                        <h6>משתתפים</h6>

                        <input
                            type="text"
                            placeholder="search name"
                            onChange={(e) => this.setState({ search: e.target.value })}
                        />
                        <div className ='container__table'>
                            <thead>

                            <tr>
                                <td>ת.ז</td>
                                <td>שם</td>
                                <td>סוג משתמש</td>
                                <td>בחר</td>

                            </tr>
                            </thead>
                            <tbody >

                            {this.maketable()}


                            </tbody>
                        </div>
                    </table>
                </div>

                <header className="title">
                    <h1 className="add-user-h">
                        <u> קישור חניך לחונך</u>
                    </h1>
                </header>
<<<<<<< Updated upstream
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label className="first-link-input-btn" htmlFor="inputLinkFirstName">תעודת זהות חניך</label>
                        <input
                            required
                            type="number"
                            className="form-control"
                            id="inputLinkFirstName"
                            value={this.state.studentId}
                            placeholder="תעודת זהות חניך"
                            title="שם פרטי"
                            onChange={(e) => this.setState({ studentId: e.target.value })}
                        />
                        <br/>
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
                    <div className="form-group col-md-6">
                        <label className="last-link-input-btn" htmlFor="inputLinkLastName">תעודת זהות חונך</label>
                        <input
                            required
                            type="number"
                            className="form-control"
                            id="inputLinkLastName"
                            value={this.state.mentorId}
                            placeholder="תעודת זהות חונך"
                            onChange={(e) => this.setState({ mentorId: e.target.value })}
                        />
                        <br/>
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
=======

>>>>>>> Stashed changes
                        <button type="submit" className="btn btn-primary link-users-btn">
                            הוסף קישור
                         </button>


            </form>
        );
    }
    renderFirstTable (){
        return (this.state.people
            .filter(person => person.type ==="חניך")
            .map((person) => (
                <tr><td>{person.id}</td><td>{person.name}</td><td>{person.email}</td>
                    <td person_id={person.id}><input type='checkbox' className='people_check' /></td></tr>
            )))
    }
    renderSecondTable (){
        return (this.state.people
            .filter(person => person.type ==="חונך")
            .map((person) => (
                <tr><td>{person.id}</td><td>{person.name}</td><td>{person.email}</td>
                    <td person_id={person.id}><input type='checkbox' className='people_check' /></td></tr>
            )))
    }

}

export default LinkUsers;