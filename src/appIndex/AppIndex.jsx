import React, { Component } from "react";
import App from "../mainPageComponents/App";
import Quest from "../mainPageComponents/MatchQuestion";
import Queststud from "../mainPageComponents/MatchQuestionstud";
import LoginForm from "../loginComponents/LoginForm";
import AdminPage from "../adminComponents/main/AdminPage";
import RakazPage from '../rakazComponents/RakazPage'
import InstructorPage from "../InstructorComponents/InstructorPage";
import firebase from "../config/Firebase"

class AppIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            isAdmin: false,
            isRakaz: false,
            isInstructor : false,
            isfirst : "",
            filled: false,
            end:false,
            oldusr:"",
            passwrd:""
        };
        this.usersRef = firebase.firestore().collection('Users');
    }

    determineIfAdmin = (type) => {
        if (type === "אדמין" || this.state.isAdmin) {
            this.setState({isAdmin: true});
        }
        else if (type === "רכז" || this.state.isRakaz){

            this.setState({...this.state, isRakaz: true});
        }
        else if (type === "מדריך" || this.state.isRakaz){

            this.setState({...this.state,  isInstructor: true});
        }

        else {
            this.setState({...this.state, isAdmin: false, isRakaz: false, isInstructor: false});
        }
    }

    filled = () => {
        this.setState({ filled: true})
    }

    exitAdmin = () => {
        this.setState({ isLoggedIn: false, isAdmin: false })
    }

    exitRakaz = () => {
        this.setState({ isLoggedIn: false, isRakaz: false })
    }

    exitInstructor = () => {
        this.setState({ isLoggedIn: false, isInstructor: false })
    }

    onAuthChanged = (user) => {
        if (user) {
            // User is signed in.
            var userType;
            var userUid = user.uid;
            this.usersRef.doc(userUid).get()
                .then(doc => {
                    if (doc.exists) {
                        userType = doc.data().type;
                        this.setState({isfirst: doc , oldusr: user})
                    }
                        else {
                        userType = "";
                    }
                })
                .then(() => {
                    this.determineIfAdmin(userType);

                })
                .then(() => this.setState({ isLoggedIn: true,end:true }))
                .catch((e) => console.log(e.name));
        }
        else
            // No user is signed in.
            this.setState({ isLoggedIn: false ,end:true});
    }

    myCallback = (dataFromChild) => {
        this.setState({passwrd: dataFromChild})
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => this.onAuthChanged(user));
    }

    renderContent() {
        if (this.state.isLoggedIn && !this.state.isAdmin && !this.state.isRakaz && !this.state.isInstructor ) {
            if (this.state.isfirst.data().first === "true" && this.state.isfirst.data().type === "חונך" && this.state.filled === false) {
                return (<Quest refwin = {this.state.isfirst} complt = {this.filled}/>)
            }
            else if (this.state.isfirst.data().first === "true" && this.state.isfirst.data().type === "חניך" && this.state.filled === false) {
                return (<Queststud refwin = {this.state.isfirst} complt = {this.filled}/>)
            }
            return (<App/>)
        }
        if (this.state.isLoggedIn && this.state.isAdmin && !this.state.isRakaz && !this.state.isInstructor) {
            return (<AdminPage exitAdmin={this.exitAdmin} oldusr = {this.state.oldusr} oldpass = {this.state.passwrd}/>)
        }
        if (this.state.isLoggedIn && !this.state.isAdmin && this.state.isRakaz && !this.state.isInstructor) {
            return (<RakazPage exitRakaz={this.exitRakaz} oldusr = {this.state.oldusr} oldpass = {this.state.passwrd}/>)
        }
        if (this.state.isLoggedIn && !this.state.isAdmin && !this.state.isRakaz && this.state.isInstructor) {
            if (this.state.isfirst.data().first === "true") {
                var con = window.confirm("אני מצהיר על שמירת שפה נאותה, חינוכית ונכונה. יש לשמור על לבוש הולם. לרשות העמותה להקליט, לבקר ולדגום שיחות")
                if (con) {
                    this.state.isfirst.ref.update({first: "acpt"});
                } else {
                    alert("אתה צריך לאשר");
                    this.setState({isLoggedIn: false , end: true});
                }
            }
            return (<InstructorPage exitInstructor={this.exitInstructor}/>)
        }
        else if(!this.state.isLoggedIn && this.state.end)
            return (<LoginForm determineIfAdmin={this.determineIfAdmin} isLoggedIn={this.state.isLoggedIn} funcret={this.myCallback}/>)
        return <div></div>
    }

    render() {
        return (this.renderContent());
    }
}

export default AppIndex;
