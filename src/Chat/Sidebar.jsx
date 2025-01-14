import React, {useEffect, useState} from 'react';
import './Sidebar.css'
import SidebarChat from './SidebarChat'
import {firestore} from "firebase";
import firebase from "../config/Firebase";
function Sidebar(){
    const [id,setId] = useState("");
    const [rooms,setRooms] = useState([]);
    const [searchTerm,setSearchTerm] = useState("");
    const db = firebase.firestore().collection('Chats');
    const uid = firebase.auth().currentUser.uid;
    firebase.firestore().collection('Users').get().then((querySnapshot)=>{
        querySnapshot.docs.forEach((doc) => {
            if(doc.id === uid){
                setId(doc.data().id);

            }

        });
    });

    useEffect(() =>{
        db.onSnapshot((snapshot) =>
        setRooms(
            snapshot.docs.map((doc)=>({
                id: doc.id,
                data: doc.data(),
            }))
        )
        );

    },[]);

    function arrayContainsID(id,arr){
        for(let i=0;i<arr.length;i++)
        {
            if(arr[i].id === id)
                return true;
        }
        return false;
    }
    function roomContainsID(id,room)
    {

        for(let i=0;i<room.data.members.length;i++)
        {
            if(room.data.members[i].id === id)
                return true;
        }
        return false;

    }

    function renderChats()
    {
        return (rooms.filter(room => room.data.name.indexOf(searchTerm)>-1)
            .filter(room=> roomContainsID(id,room)).map(room =>(

            <SidebarChat key={room.id} id={room.id} name={room.data.name} />
        )));
    }
    return(
        <div className="sidebar">
            <div className="sidebarSearch">
                <div className="searchContainer">
                    <input
                        type="text"
                        placeholder="חיפוש"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}

                    />
                </div>

            </div>
            <div className="sidebarChats">

                {renderChats()}

            </div>
        </div>
    )

}
export  default Sidebar;