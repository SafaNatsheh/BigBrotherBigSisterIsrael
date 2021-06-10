import React, {useEffect, useState} from "react";
import './SidebarChat.css'
import {Link} from "react-router-dom"
import firebase from "../config/Firebase";
function SidebarChat({id,name}) {

    const [messages,setMessages] = useState([]);
    useEffect(() =>{
        if(id){
            firebase.firestore().collection('Chats')
                .doc(id).collection("Messages").orderBy('timestamp','desc')
                .onSnapshot(snapshot => (setMessages(snapshot.docs.map(doc => doc.data()))));
        }
    }

    ,[id]);

    return(
            <Link to={`/chats/${id}`}>
                <div   className="sidebarChat">
                    <div className="sidebarChat_Info">
                        <h2>{name}</h2>
                        <p>{messages[0] &&messages[0].message}</p>
                    </div>
                </div>
            </Link>




    )
}


export default SidebarChat;