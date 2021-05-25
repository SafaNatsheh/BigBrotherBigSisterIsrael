import React, { Component } from "react";
import "../../rakazComponents/Meetings.css";
import "./MeetingList.css";
import Loader from 'react-loader-spinner'
import {db} from "../../config/Firebase"

class MeetingList extends Component {
    formatDate = (timeStamp) => { // formatting date to [DD/MM/YYYY]
        var newDate = new Date(timeStamp);
        var today = new Date();
        if (today.getDate() === newDate.getDate() && today.getMonth() === newDate.getMonth() && today.getFullYear() === newDate.getFullYear())
            return "היום";
        if (today.getDate() === newDate.getDate() + 1 && today.getMonth() === newDate.getMonth() && today.getFullYear() === newDate.getFullYear())
            return "אתמול";
        if (today.getDate() === newDate.getDate() - 1 && today.getMonth() === newDate.getMonth() && today.getFullYear() === newDate.getFullYear())
            return "מחר";
        return newDate.getDate() + "/" + (parseInt(newDate.getMonth()) + 1) + "/" + newDate.getFullYear();
    }

    renderTable = () => {
        return (this.props.meetingsArr.map((data, index) =>
            <tr key={"row" + index} className="table-cols">
                <td className="align-middle">{this.formatDate(data.date)}</td>
                <td className="align-middle">{data.time}</td>
                <td className="align-middle">{data.place}</td>
                <td className="align-middle">{data.description}</td>
                <td className="align-middle"><button
                    className="btn btn-danger delete-meeting"
                    onClick={() => { this.deleteMeeting(data.doc_id) }}
                >
                    מחק
                    </button>
                </td>
            </tr >
        ));
    }

    deleteMeeting = async (data) => {
        var tempArr = [];
        var con = window.confirm("האם אתה בטוח שברצונך למחוק פגישה זו?");
        if (!con)
            return;
        
        
       var t = await this.props.myUser.doc(data).get()
       
       t.data().send_list.forEach(async user=>{
           await  db.collection('Users').doc(user.uid).collection('Meetings').doc(t.id).delete()
       

       })

        this.props.myUser.doc(data).delete()
            // .then(() => this.props.linkUser.forEach.doc(data).delete())
            .then(() => console.log("Meeting " + data + " has successfully deleted from DB"))
            .catch(() => console.log("Error in deleting meeting from DB"))
            .then(() => {
                tempArr = [...this.props.meetingsArr];
                this.props.meetingsArr.forEach((item, index) => {
                    if (data === item.doc_id && index !== -1) {
                        tempArr.splice(index, 1);
                        this.props.updateRef(tempArr)
                    }
                })
            })
            .catch((e) => console.log(e.name))

    }

    renderComponent = () => {
        if (this.props.loading)
            return (<Loader className="meetings-loader" type="Grid" width="200px" height="200px" color="#776078" />);
        else
            return (
                <table className="table table-striped table-dark w-50 table-responsive meeting-table" >
                    <thead>
                        <tr><th colSpan="5" className="table-title">רשימת פגישות קרובות</th></tr>
                        <tr className="table-cols">
                            <th className="align-middle">מועד הפגישה</th>
                            <th className="align-middle">שעת הפגישה</th>
                            <th className="align-middle">מיקום הפגישה</th>
                            <th className="align-middle">תיאור הפגישה</th>
                            <th className="align-middle">מחיקה</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderTable()}
                        <tr className="table-cols">
                            <td className="align-middle" colSpan="5">
                                <button
                                    disabled={this.props.loadedAll}
                                    className="btn btn-primary load-past-meetings"
                                    onClick={this.props.loadPrev}>
                                    טען 5 פגישות נוספות מהעבר
                                        </button>
                                <Loader className="loader-past-meeting" type="TailSpin" height="30px" width="30px" color="royalblue" visible={this.props.loadingPastMeetings}></Loader>
                            </td>
                        </tr>
                    </tbody>
                </table>
            );
    }

    render() {
        return (this.renderComponent());
    }
}

export default MeetingList;
