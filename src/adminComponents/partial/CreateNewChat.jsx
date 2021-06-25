import React, {Component} from "react";
import firebase from "../../config/Firebase"
import './CreateNewChat.css';

class CreateNewChat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checkedList: [],
            members: [],
            id: "",
            type: "",
            searchTerm: "",
            groupName: "",
            people:[],
        }
        this.usersRef = firebase.firestore().collection('Users');
        this.uid = firebase.auth().currentUser.uid;
        this.usersRef.doc(this.uid).get()
            .then((doc) => {
                this.setState({ id: doc.data().id });
                this.setState({ type: doc.data().type });
            })
            .catch((e) => console.log(e.name));




    };


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
        if(this.state.groupName === "" )//make sure the inpute is correct
        {
            window.alert("הזן שם קבוצה");
        }
        else if(this.state.checkedList.length === 0)
        {
            window.alert("אין משתמשים נבחרים");
        }
        else
        {
            var con = window.confirm("האם אתה בטוח שברצונך ליצור קבוצה זו?" )
            if(con){
                //add the chat to the db
                firebase.firestore().collection('Chats').add(
                    {

                        name: this.state.groupName,
                        type: "group",
                        members: this.state.checkedList,
                    })
                setTimeout(function(){
                    window.location.reload(1);
                }, 1000);
            }
        }


    }



    render() {

        return (
            <div className="form-group">
                <br />

                <input
                    type="text"
                    className="group-design"
                    placeholder="שם הקבוצה"
                    value={this.state.groupName}
                    required
                    onChange={(e) => this.setState({ groupName: e.target.value })}

                />

                <input
                    type="text"
                    className="search-design"
                    placeholder="חיפוש"
                    value={this.state.searchTerm}
                    onChange={(e) => this.setState({ searchTerm: e.target.value })}

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
                        className="button-de but-new-design"
                        onClick={this.handleSubmit}
                    >
                        <div className="button-text-f">
                            יצירת קבוצה
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
                .filter( person =>  person.fName.indexOf(this.state.searchTerm)>-1)
                .map((person) => (
                    <tr><td>{person.fName +" "+ person.lName}</td><td>{person.id}</td><td>{person.email}</td><td>{person.type}</td>
                        <td person_id={person.id}><input type='checkbox' className='people_check' onChange={() => this.state.checkedList.push({id: person.id,name: person.fName + " " + person.lName})}/></td></tr>
                )))
        }
        else if(this.state.type === "רכז")
        {
            return (this.state.people
                .filter( person => person.type !== "אדמין" && person.fName.indexOf(this.state.searchTerm)>-1)
                .map((person) => (
                    <tr><td>{person.fName +" "+ person.lName}</td><td>{person.id}</td><td>{person.email}</td><td>{person.type}</td>
                        <td person_id={person.id}><input type='checkbox' className='people_check' onChange={() => this.state.checkedList.push({id: person.id,name: person.fName + " " + person.lName})}/></td></tr>
                )))
        }
        else
        {
            return (this.state.people
                .filter( person => person.type !== "אדמין" && person.type !== "רכז" && person.fName.indexOf(this.state.searchTerm)>-1)
                .map((person) => (
                    <tr><td>{person.fName +" "+ person.lName}</td><td>{person.id}</td><td>{person.email}</td><td>{person.type}</td>
                        <td person_id={person.id}><input type='checkbox' className='people_check' onChange={() => this.state.checkedList.push({id: person.id,name: person.fName + " " + person.lName})}/></td></tr>
                )))
        }


    }

}

export default CreateNewChat;
