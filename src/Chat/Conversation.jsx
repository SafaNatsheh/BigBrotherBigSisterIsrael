import React, {useState} from "react";
import './Conversation.css'

function Conversation(){

    const[input,setInput] =useState("");
    const sendMessage =(e) =>{
        e.preventDefault();
        console.log(input);
        setInput("")
    };

    return(
        <div className="conversation">
            <div className="conversationHeader">

            </div>
            <div className="conversationBody">

                <p className="message">
                    <span className="messageName">
                    Najeeb
                        Ibrahim
                </span>
                    hi
                <span className="timestamp">
                    1:46pm
                </span>
                </p>
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