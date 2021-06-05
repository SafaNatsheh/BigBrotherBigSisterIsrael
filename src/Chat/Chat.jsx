import React, { Component } from "react";
import "./Chat.css";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink,
    Redirect,
    Link
} from "react-router-dom";

import firebase from "../config/Firebase"
import Sidebar from "./Sidebar";
import Conversation from "./Conversation"

class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }


    render(){
        return(
            <div className="chat">

                <Sidebar />
                <Conversation />

            </div>

        )
    }

}


export default Chat;
