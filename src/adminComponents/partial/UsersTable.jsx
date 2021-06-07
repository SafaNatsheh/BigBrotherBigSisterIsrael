import React, {Component} from "react";
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
            searchTerm: "",
            people:[]
        }
        this.usersRef = firebase.firestore().collection('Users');
        this.uid = firebase.auth().currentUser.uid;
        this.usersRef.doc(this.uid).get()
            .then((doc) => {
                this.setState({ id: doc.data().id });
                this.setState({ type: doc.data().type });
            })
            .catch((e) => console.log(e.name));


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
    handleSubmit = (event) => {
        event.preventDefault();

        if(this.state.type === "אדמין"||this.state.type === "רכז")
        {
            var con = window.confirm("האם אתה בטוח שברצונך למחוק את המשתמשים?" )
            if (con){
                for(let i =0;i<this.state.checkedList.length;i++)
                {
                    firebase.firestore().collection('Users').get().then((querySnapshot) => {
                        querySnapshot.docs.forEach(doc => {
                            if(doc.data().id === this.state.checkedList[i])
                            {
                                if (typeof (doc.data().link_user) !== 'undefined' && doc.data().link_user !== "")
                                {
                                    this.usersRef.doc(doc.data().link_user).update({ link_user: "" })
                                }
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

        return (
            <div className="form-group">
                <br />

                <h3>רשימת משתמשים</h3>

                <input
                    type="text"
                    placeholder="search"
                    value={this.state.searchTerm}
                    onChange={(e) => this.setState({ searchTerm: e.target.value })}
                    // style={{ marginRight: "450px" ,position:"realtive" ,marginInline:"500px"}}
                />

                <div className="table-t" >
                    <label
                        className="fLabels"
                        style={{ float: "right" }}
                        htmlFor="description"
                    >
                    </label>

                    <table className="table table-bordered">

                        <thead>
                        <tr>
                            <th>שם</th>
                            <th>ת.ז</th>
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
                <div className="button">
                    <br />
                    <button
                        className="button-de"
                        style={{ float: "right", marginRight: "700px" , color:"#dc3545"  }}
                        onClick={this.handleSubmit}
                    >
                        <div className="button-text">
                            מחק המשתמשים
                        </div>
                        {" "}
                    </button>
                </div>

            </div>
        );
    }
    renderTable() {
        if (this.state.type === "אדמין")
        {
            return (this.state.people
                .filter(person => person.fName.indexOf(this.state.searchTerm)>-1)
                .map((person) => (
                    <tr><td>{person.fName +" "+ person.lName}</td><td>{person.id}</td><td>{person.email}</td><td>{person.type}</td>
                        <td person_id={person.id}><input type='checkbox' className='people_check' onChange={() => this.state.checkedList.push(person.id)}/></td></tr>
                )))
        }
        else if(this.state.type === "רכז")
        {
            return (this.state.people
                .filter(person => person.type !== "אדמין")
                .map((person) => (
                    <tr><td>{person.fName +" "+ person.lName}</td><td>{person.id}</td><td>{person.email}</td><td>{person.type}</td>
                        <td person_id={person.id}><input type='checkbox' className='people_check' onChange={() => this.state.checkedList.push(person.id)}/></td></tr>
                )))
        }
    }



}

export default UsersTable;
