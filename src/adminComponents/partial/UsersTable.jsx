import React, {Component} from "react";
import "./UsersTable.css";
import firebase, {auth} from "../../config/Firebase"
import NoLinkedUsers from "./NoLinkedUsers";


class UsersTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedList: [],
            id: "",
            type: "",
            searchTerm: "",
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


    }
    arrayContainsID(id,arr){
        for(let i=0;i<arr.length;i++)
        {
            if(arr[i].id === id)
                return true;
        }
        return false;
    }
    componentDidMount() {
        auth.onAuthStateChanged(user=> {
            console.log(user)
            if (!user) {
                window.location.href = "/"
                return
            }
            this.usersRef
                .get()
                .then(queryShot => {
                    queryShot.forEach(
                        (doc) => {
                            this.setState({people: [...this.state.people, doc.data()]})
                        }
                    )
                })
                .catch((e) => console.log(e.name));
        })
    }

    removePeople(list,people)
    {
        var newList=[]
        list.forEach(p=>{
            if(p.id !=people)
            {
                newList.push(p)

            }
        })
        return(newList)
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let str='profile_pictures/';


    handleSubmit = async (event) => {
        event.preventDefault();
        var list=this.state.people
        if(this.state.type === "אדמין"||this.state.type === "רכז")
        {
            var con = window.confirm("האם אתה בטוח שברצונך למחוק את המשתמשים?" )
            if (con){
                for(let i =0;i<this.state.checkedList.length;i++)
                {

                list = this.removePeople(list,this.state.checkedList[i])

                   let querySnapshot=await firebase.firestore().collection('Users').get()


                    querySnapshot.docs.forEach(doc => {
                        if(doc.data().id === this.state.checkedList[i])
                        {
                            if (typeof (doc.data().link_user) !== 'undefined' && doc.data().link_user !== "")
                            {
                                this.usersRef.doc(doc.data().link_user).update({ link_user: "" })
                            }
                            doc.ref.delete();

                        }

                    })
                    let tmp = this.state.checkedList[i];
                    firebase.firestore().collection('Chats').get().then((querySnapshot) => {
                        querySnapshot.docs.forEach(doc => {
                            if(doc.data().type === "private")
                            {
                                if(this.arrayContainsID(tmp,doc.data().members)===true){
                                    doc.ref.delete();
                                }
                            }
                            if(doc.data().type === "group"){
                                if(this.arrayContainsID(tmp,doc.data().members)===true){
                                    const newArr=doc.data().members.filter(member => member.id !== tmp);
                                    doc.ref.update({members: newArr});
                                }
                            }

                        });
                    })

                }
                console.log(this.state.checkedList)
                this.state.checkedList.forEach(elem =>
                    document.getElementById(elem).checked = false
                );
                this.setState({checkedList:[],people:list})
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

              

                <input
                    type="text"
                    placeholder="search"
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
                        <td person_id={person.id}><input type='checkbox' id = {person.id} className='people_check' onChange={(e) => { if (e.target.checked) {this.state.checkedList.push(person.id); } else {this.state.checkedList.pop(person.id); }}}/></td></tr>
                )))
        }
        else if(this.state.type === "רכז")
        {
            return (this.state.people
                .filter(person => person.type !== "אדמין" && person.fName.indexOf(this.state.searchTerm)>-1)
                .map((person) => (
                    <tr><td>{person.fName +" "+ person.lName}</td><td>{person.id}</td><td>{person.email}</td><td>{person.type}</td>
                        <td person_id={person.id}><input type='checkbox' id = {person.id} className='people_check' onChange={(e) => { if (e.target.checked) {this.state.checkedList.push(person.id); } else {this.state.checkedList.pop(person.id); }}}/></td></tr>
                )))
        }
    }



}

export default UsersTable;
