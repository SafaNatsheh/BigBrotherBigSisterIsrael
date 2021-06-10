import React, {Component, useState} from "react";
import "./Chat.css";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink,
    Redirect,
    Link,
    useParams
} from "react-router-dom";

import firebase from "../config/Firebase"
import Sidebar from "./Sidebar";
import Conversation from "./Conversation"

class Chat extends Component {

    constructor(props) {
        super(props);
        this.state ={}
    }
    render(){
        return (
            <div className="chat">
                <Router>
                    <Sidebar />
                    <Switch>
                        <Route path="/chats/:chatId">
                            <Conversation />
                        </Route>
                        <Route path="/">
                            <Conversation />
                        </Route>
                    </Switch>
                </Router>


            </div>


        )
    }


}


export default Chat;
