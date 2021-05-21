import React, {Component, useState} from "react";
import Loader from 'react-loader-spinner'
import "./UsersTable.css";
import firebase from "../../config/Firebase"
import NoLinkedUsers from "./NoLinkedUsers";

class UsersTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usersArr: [],
            linkedUserArr: [],
            noLinkedUsers: [],
            noLink: false,
            checkedList: [],
            id: "",
            type: "",
            searchTerm: ""
        }
        this.usersRef = firebase.firestore().collection('Users');
        this.uid = firebase.auth().currentUser.uid;
        this.usersRef.doc(this.uid).get()
            .then((doc) => {
                this.setState({ id: doc.data().id });
                this.setState({ type: doc.data().type });
            })
            .catch((e) => console.log(e.name));
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
                                role: doc.data().type,
                                id: doc.data().id,
                                email: doc.data().email,
                                phone: doc.data().phone
                            };
                            this.setState({ noLinkedUsers: [...this.state.noLinkedUsers, newUser] })
                        }
                    })
            })
            .catch((e) => console.log(e.name));
    }
    handleSubmit = (event) => {
        event.preventDefault();

        if(this.state.type === "אדמין"||this.state.type === "רכז")
        {
            var con = window.confirm("האם אתה בטוח שברצונך למחוק את המשתמשים?" )
            if (con){
                for(let i =0;i<this.state.checkedList.length;i++)
                {
                    firebase.firestore().collection('Users').get().then((querySnapshot) => {
                        querySnapshot.docs.map((doc) => {
                            if(doc.data().id === this.state.checkedList[i])
                            {
                                doc.ref.delete()

                            }
                        });
                    })
                }
            }
        }
        else
        {
            alert("אין לך הרשאה לעשות זה");
        }




    }

    render() {
        console.log(this.state.id);
        return (
            <div>
                <br />


                <input
                    type="text"
                    placeholder="search"
                    value={this.state.searchTerm}
                    onChange={(e) => this.setState({ searchTerm: e.target.value })}
                />
                <div className="form-group">
                    <label
                        className="fLabels"
                        style={{ float: "right" }}
                        htmlFor="description"
                    >
                        {/* <!-description--> */}
                        רשימת המשתמשים
                    </label>
                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th>ת.ז</th>
                            <th>שם</th>
                            <th>דוא"ל</th>
                            <th>סוג משתמש</th>
                            <th>בחר</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.renderTable()}
                        </tbody>
                    </table>
                </div>

                <br />
                <button
                    className="btn btn-success setup-meeting-btn"
                    style={{ float: "right", marginRight: "700px" }}
                    onClick={this.handleSubmit}
                >
                    מחק את המשתמשים!{" "}
                </button>
            </div>
        );
    }
    renderTable() {
        if (this.state.type === "אדמין")
        {
            return (this.people
                .filter(person => person.id.indexOf(this.state.searchTerm)>-1)
                .map((person) => (
                    <tr><td>{person.id}</td><td>{person.name}</td><td>{person.email}</td><td>{person.type}</td>
                        <td person_id={person.id}><input type='checkbox' className='people_check' onChange={() => this.state.checkedList.push(person.id)}/></td></tr>
                )))
        }
        else if(this.state.type === "רכז")
        {
            return (this.people
                .filter(person => person.type !== "אדמין")
                .map((person) => (
                    <tr><td>{person.id}</td><td>{person.name}</td><td>{person.email}</td><td>{person.type}</td>
                        <td person_id={person.id}><input type='checkbox' className='people_check' onChange={() => this.state.checkedList.push(person.id)}/></td></tr>
                )))
        }
    }



}

export default UsersTable;
