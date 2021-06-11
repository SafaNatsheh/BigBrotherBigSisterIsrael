import React, {Component} from "react";
import firebase from "../../config/Firebase"


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
            pathToStorage:"profile_pictures/"
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

        var con = window.confirm("האם אתה בטוח שברצונך ליצור קבוצה זו?" )
        if(this.state.groupName === "")
        {
            window.alert("הזן שם קבוצה");



        }
        else
        {
            if(con){
                for(let i =0;i<this.state.checkedList.length;i++)
                {

                    firebase.firestore().collection('Users').get().then((querySnapshot) => {
                        querySnapshot.docs.forEach(doc => {
                            if(doc.data().id === this.state.checkedList[i].id)
                            {
                                this.state.members.push({
                                    id: doc.data().id,
                                    name: doc.data().fName + " " + doc.data().lName,
                                    uid: doc.id
                                })

                            }
                        });
                    })

                }
                firebase.firestore().collection('Chats').add(
                    {

                        name: this.state.groupName,
                        type: "group",
                        members: this.state.checkedList,
                    })
            }
        }

        setTimeout(function(){
            window.location.reload(1);
        }, 1000);
    }



    render() {

        return (
            <div className="form-group">
                <br />


                <input
                    type="text"

                    placeholder="שם הקבוצה"
                    value={this.state.groupName}
                    required
                    onChange={(e) => this.setState({ groupName: e.target.value })}
                    style={{ marginRight: "225px" ,display:"block" }}
                />
                <br/>
                <input
                    type="text"
                    placeholder="חיפוש"
                    value={this.state.searchTerm}
                    onChange={(e) => this.setState({ searchTerm: e.target.value })}
                    style={{ marginRight: "225px" ,display:"block" }}
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
                        style={{ float: "right", marginRight: "780px" ,marginTop:"0px", color:"#dc3545"  }}
                        onClick={this.handleSubmit}
                    >
                        <div className="button-text">
                            יצור קבוצה
                        </div>
                        {" "}
                    </button>
                </div>


            </div>
        );
    }
    renderTable() {


        return (this.state.people
                .filter(person => person.fName.indexOf(this.state.searchTerm)>-1)
                .map((person) => (
                    <tr><td>{person.fName +" "+ person.lName}</td><td>{person.id}</td><td>{person.email}</td><td>{person.type}</td>
                        <td person_id={person.id}><input type='checkbox' className='people_check' onChange={() => this.state.checkedList.push({id: person.id,name: person.fName + " " + person.lName})}/></td></tr>
                )))

    }

}

export default CreateNewChat;