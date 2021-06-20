import './Zoom.css';
import React   from 'react';
// import { ZoomMtg } from '@zoomus/websdk'
import {useEffect} from 'react'
import {yellow} from "@material-ui/core/colors";


const crypto = require('crypto') // crypto comes with Node.js

function generateSignature(apiKey, apiSecret, meetingNumber, role) {
    return new Promise((resolve,reject)=>{
        // Prevent time sync issue between client signature generation and zoom
        const timestamp = new Date().getTime() - 30000
        const msg = Buffer.from(apiKey + meetingNumber + timestamp + role).toString('base64')
        const hash = crypto.createHmac('sha256', apiSecret).update(msg).digest('base64')
        const signature = Buffer.from(`${apiKey}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64')

        resolve(signature)
    })
}
//create meeting zoom and change number and password//
// https://username.zoom.us/j/91016556147?pwd=Z2NzdHBuSFFaSksxcXhaSlZPV21OUT09
var meetingNumber = '4873876039'
var passWord = 'RXVuWTR0Z1lVbmsvR3Z2aHVtSzZ4QT09'
//-----------------------------------------------------------------------------//

var apiKey = '2gulLCLFSVKTYxLvLq9pXQ'
var apiSecret= 'X2Sx67Soi7O1U3OVF2p5j97Gyzou5wmKgZyf'

var role = '0'
var leaveUrl = 'http://localhost:3000'
var userName = 'test'
var userEmail = 'bbbs.personal.area@gmail.com'
var signature =''

generateSignature(apiKey, apiSecret, meetingNumber, role).then((res)=>{
    signature = res;
});



const Zoom=()=> {
    const { ZoomMtg } = require('@zoomus/websdk')
    useEffect(()=>{
        showZoomDIv();
        ZoomMtg.setZoomJSLib('https://source.zoom.us/1.9.5/lib', '/av');
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareJssdk();
        initiateMeeting()
    },[]);

    const showZoomDIv=()=>{
        document.getElementById('zmmtg-root').style.display='hide'
    }


    const initiateMeeting=()=>{
        ZoomMtg.init({
            leaveUrl: leaveUrl,
            isSupportAV: true,
            success: (success) => {
                console.log(success)

                ZoomMtg.join({
                    signature: signature,
                    meetingNumber: meetingNumber,
                    userName: userName,
                    apiKey: apiKey,
                    userEmail: userEmail,
                    passWord: passWord,
                    success: (success) => {
                        console.log(success)
                    },
                    error: (error) => {
                        console.log(error)
                    }
                })

            },
            error: (error) => {
                console.log(error)
            }
        })
    }



    return (
        // <div className="Zoom" >
            <div className="test" >
                <h1 style={{backgroundColor:"white"}}>test</h1>
            </div>
        // </div>
    );
}

export default Zoom;

