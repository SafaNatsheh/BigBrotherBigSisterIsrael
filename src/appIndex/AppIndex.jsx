import React, { Component } from "react";
import App from "../mainPageComponents/App";
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
            isInstructor : false
        };
        this.usersRef = firebase.firestore().collection('Users');
    }

    determineIfAdmin = (type) => {
        if (type === "אדמין" || this.state.isAdmin)
            this.setState({ isAdmin: true });

        else if (type === "רכז" || this.state.isRakaz){
            this.setState({...this.state, isRakaz: true});
        }
        else if (type === "מדריך" || this.state.isRakaz){
            this.setState({...this.state,  isInstructor: true});
        }
        else
            this.setState({...this.state, isAdmin: false, isRakaz: false ,  isInstructor: false });
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
                    if (doc.exists)
                        userType = doc.data().type;
                    else
                        userType = "";
                })
                .then(() => {
                    this.determineIfAdmin(userType);
                })
                .then(() => this.setState({ isLoggedIn: true }))
                .catch((e) => console.log(e.name));
        }
        else
            // No user is signed in.
            this.setState({ isLoggedIn: false });
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => this.onAuthChanged(user));
    }

    renderContent() {
        if (this.state.isLoggedIn && !this.state.isAdmin && !this.state.isRakaz && !this.state.isInstructor)
            return (<App />)
        if (this.state.isLoggedIn && this.state.isAdmin && !this.state.isRakaz && !this.state.isInstructor)
            return (<AdminPage exitAdmin={this.exitAdmin} />)
        if (this.state.isLoggedIn && !this.state.isAdmin && this.state.isRakaz && !this.state.isInstructor)
            return (<RakazPage exitRakaz={this.exitRakaz} />)
        if (this.state.isLoggedIn && !this.state.isAdmin && !this.state.isRakaz && this.state.isInstructor)
            return (<InstructorPage exitInstructor={this.exitInstructor} />)
        else
            return (<LoginForm determineIfAdmin={this.determineIfAdmin} isLoggedIn={this.state.isLoggedIn} />)
    }

    render() {
        return (this.renderContent());
    }
}

export default AppIndex;
