import React from "react";
import './SidebarChat.css'
function SidebarChat({id,name}) {
    const handleClick = () =>{
        console.log(id);
    }
    return(

            <div onClick={handleClick}  className="sidebarChat">
                <div className="sidebarChat_Info">
                    <h2>{name}</h2>
                    <p>last message</p>
                </div>
            </div>



    )
}


export default SidebarChat;