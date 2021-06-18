import React, {Component} from "react";
import "./UsersTable.css";
import firebase, {auth} from "../../config/Firebase"
//import {Route, useHistory} from 'react-router-dom';
import UpdateUser from "./UpdateUser";
//import NoLinkedUsers from "./NoLinkedUsers";
//import {Link} from "react-router-dom"




let nwalr;
class UsersTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedList: [],
            id: "",
            type: "",
            searchTerm: "",
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
            if(p.id !== people)
            {
                newList.push(p)

            }
        })
        return(newList)
    }




    getDetails(person){

         nwalr = window.confirm("שם: "+person.fName+" " + person.lName+ "\n ת.ז: "+person.id+"\n תאריך לידה: "+person.birthDate+"\n אימייל: " + person.email+
            "\n כתובת: "+person.address+"\n אֵזוֹר: " + person.area + " \n\nהאם אתה רוצה לעדקן מידע המשתמש הזה? ");
         if (nwalr) {

             window.location.href = "/UpdateUser";
         }
         else{
                 console.log("error")
         }
        return
    }




    handleSubmit = async (event) => {
        event.preventDefault();
        let str='profile_pictures/';
        var list=this.state.people
        if(this.state.type === "אדמין"||this.state.type === "רכז")
        {
            var con = window.confirm("האם אתה בטוח שברצונך למחוק את המשתמשים?" )
            if (con){
                this.state.checkedList.forEach(elem =>
                    document.getElementById(elem).checked = false
                );
                for(let i =0;i<this.state.checkedList.length;i++)
                {

                list = this.removePeople(list,this.state.checkedList[i])

                   let querySnapshot=await firebase.firestore().collection('Users').get()


                    querySnapshot.docs.forEach(doc => {
                        if(doc.data().id === this.state.checkedList[i])//search for the user that is on the checked list
                        {//then delete that user
                            if (typeof (doc.data().link_user) !== 'undefined' && doc.data().link_user !== "")
                            {//if the user is linked to another user, remove the link
                                this.usersRef.doc(doc.data().link_user).update({ link_user: "" })
                            }
                            doc.ref.delete();
                            var desertRef = firebase.storage().ref(str+doc.id);
                            desertRef.delete()//delete the users's profile picture from the storage

                        }

                    })
                    let tmp = this.state.checkedList[i];
                    firebase.firestore().collection('Chats').get().then((querySnapshot) => {
                        querySnapshot.docs.forEach(doc => {
                            if(doc.data().type === "private")//if the chat is private delete the chat if
                            {
                                if(this.arrayContainsID(tmp,doc.data().members)===true){
                                    doc.ref.delete();
                                }
                            }
                            if(doc.data().type === "group"){//if the chat is a group chat remove the user from the group
                                if(this.arrayContainsID(tmp,doc.data().members)===true){
                                    const newArr=doc.data().members.filter(member => member.id !== tmp);
                                    doc.ref.update({members: newArr});
                                }
                            }

                        });
                    })

                }
                //empty the checked list

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
                            <th>פרטים</th>
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
    /*<td><Link to="/UpdateUser"><button  type="button">
                            Click Me!
                        </button></Link></td>*/
    renderTable() {

        if (this.state.type === "אדמין")//if the user is an admin he can remove any user
        {//show all users in the table
            return (this.state.people
                .filter(person => person.fName.indexOf(this.state.searchTerm)>-1)
                .map((person) => (
                    <tr><td>{person.fName +" "+ person.lName}</td><td>{person.id}</td><td>{person.email}</td><td>{person.type}</td>
                        <td className='buttDetails'><input className='detailsButt' value="הצג פרטים" type ='button' onClick={(event)=>this.getDetails(person)}/></td>
                        <td person_id={person.id}><input type='checkbox' id = {person.id} className='people_check' onChange={() => this.state.checkedList.push(person.id)}/></td></tr>
                )))
        }
        else if(this.state.type === "רכז")//if the user is an instructor he can't remove an admin
        {//show all users in the table except for admins
            return (this.state.people
                .filter(person => person.type !== "אדמין" && person.fName.indexOf(this.state.searchTerm)>-1)
                .map((person) => (
                    <tr><td>{person.fName +" "+ person.lName}</td><td>{person.id}</td><td>{person.email}</td><td>{person.type}</td>
                        <td className='buttDetails'><input className='detailsButt' value="הצג פרטים" type ='button' onClick={(event)=>this.getDetails(person)}/></td>
                        <td person_id={person.id}><input type='checkbox' id = {person.id} className='people_check' onChange={(e) => { if (e.target.checked) {this.state.checkedList.push(person.id); } else {this.state.checkedList.pop(person.id); }}}/></td></tr>
                )))
        }
    }



}

export default UsersTable;