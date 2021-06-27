import React, {useEffect, useState} from "react";
import './Conversation.css'
import {useParams} from "react-router-dom";
import firebase from "../config/Firebase";
function Conversation(){
    let {chatId} = useParams();

    const [chatName,setChatName] = useState("");
    const [messages,setMessages] = useState([]);
    const [userName,setName] = useState("");
    useEffect(
        ()=>{
            let uid = firebase.auth().currentUser.uid;
            firebase.firestore().collection('Users').doc(uid)
                .onSnapshot(snapshot => (setName(snapshot.data().fName+" "+snapshot.data().lName)))
            if(chatId){
                firebase.firestore().collection('Chats').doc(chatId)
                    .onSnapshot(snapshot => (setChatName(snapshot.data().name)))

                firebase.firestore().collection('Chats')
                    .doc(chatId).collection("Messages").orderBy('timestamp','asc')
                    .onSnapshot(snapshot => (setMessages(snapshot.docs.map(doc => doc.data()))))
            }

        },[chatId])

    const[input,setInput] =useState("");
    const sendMessage =(e) =>{
        e.preventDefault();
        if(input !==""){
            firebase.firestore().collection('Chats').doc(chatId).collection("Messages").add(
                {
                    Sender_Name: userName,
                    message: input,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                })
        }

        setInput("")
    };

    return(
        <div className="conversation">
            <div className="conversationHeader">
                    <h3>{chatName}</h3>
            </div>
            <div className="conversationBody">
                {messages.map((message) =>(
                    <p className={`message ${(message.Sender_Name !== userName) && "messageReceiver"}`} >
                        <span className="messageName">
                    {message.Sender_Name}
                </span>
                        {message.message}
                        <span className="timestamp">
                            {
                                new Date(message.timestamp && message.timestamp.toDate()).toUTCString()}
                </span>
                    </p>
                ))}

            </div>
            <div className="conversationFooter">
                <form>
                    <input
                        value ={input}
                        onChange={(e)=> setInput(e.target.value)}
                        type="text" />
                    <button onClick={sendMessage} type="submit">Send</button>
                </form>
            </div>
        </div>
    )
}
export default Conversation;