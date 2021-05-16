import React, { Component } from "react";
import App from "../mainPageComponents/App";
import LoginForm from "../loginComponents/LoginForm";
import AdminPage from "../adminComponents/main/AdminPage";
import firebase from "../config/Firebase"

class AppIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            isAdmin: false
        };
        this.usersRef = firebase.firestore().collection('Users');
    }

    determineIfAdmin = (type) => {
        if (type === "אדמין" || this.state.isAdmin)
            this.setState({ isAdmin: true });
        else
            this.setState({ isAdmin: false });
    }

    exitAdmin = () => {
        this.setState({ isLoggedIn: false, isAdmin: false })
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
        if (this.state.isLoggedIn && !this.state.isAdmin)
            return (<App />)
        if (this.state.isLoggedIn && this.state.isAdmin)
            return (<AdminPage exitAdmin={this.exitAdmin} />)
        else
            return (<LoginForm determineIfAdmin={this.determineIfAdmin} isLoggedIn={this.state.isLoggedIn} />)
    }

    render() {
        return (this.renderContent());
    }
}

export default AppIndex;
