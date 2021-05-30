import * as React from "react";
import "./NewsList.css";
import Loader from 'react-loader-spinner'

export class NewsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    formatDate = (timeStamp, includeDate = true) => {
        var newDate = new Date(timeStamp);
        var today = new Date();
        if (today.getDate() === newDate.getDate() && today.getMonth() === newDate.getMonth() && today.getFullYear() === newDate.getFullYear())
            return "היום";
        if (today.getDate() === newDate.getDate() + 1 && today.getMonth() === newDate.getMonth() && today.getFullYear() === newDate.getFullYear())
            return "אתמול";
        if (today.getDate() === newDate.getDate() - 1 && today.getMonth() === newDate.getMonth() && today.getFullYear() === newDate.getFullYear())
            return "מחר";
        if (includeDate)
            return "בתאריך " + newDate.getDate() + "/" + (parseInt(newDate.getMonth()) + 1) + "/" + newDate.getFullYear();
        return newDate.getDate() + "/" + (parseInt(newDate.getMonth()) + 1) + "/" + newDate.getFullYear();
    }

    formatTime = () => {
        var timeStamp = this.props.otherUserLastOnline;
        var newTime = new Date(timeStamp);
        var minutes = newTime.getMinutes();
        var fullMinutes = minutes < 10 && minutes >= 0 ? "0" + minutes : minutes;
        return "בשעה " + newTime.getHours() + ":" + fullMinutes;
    }

    connectionStatus = () => {
        if (this.props.otherUserConnection)
            return (
                <li className="list-group-item list-group-item-dark conn-element">
                    <h2>
                        <span className="badge badge-secondary w-50 bg-success text-white friend-connected">
                            {this.props.linked_name} מחובר/ת!
                        </span>
                    </h2>
                    <button className="btn btn-primary video-invite" onClick={() => this.props.connectToVideo(true)} >הזמן לשיחת וידאו!</button>
                </li>
            );
        else
            return (
                <li className="list-group-item list-group-item-dark conn-element">
                    <h2>
                        <span
                            className="badge badge-secondary w-50 bg-danger text-white friend-disconnected">
                            {/* {this.props.linked_name} לא מחובר/ת */}
                            </span>
                    </h2>
                    <h5>
                        <span hidden={this.props.otherUserLastOnline ? false : true}
                            className="badge badge-secondary w-50 bg-danger text-white friend-last-seen">
                            נראה לאחרונה {this.formatDate(this.props.otherUserLastOnline)} {this.formatTime()}
                        </span>
                    </h5>
                </li>
            );
    }

    renderNewVideo = () => {
        if (!this.props.vidButtonHide && this.props.otherUserConnection)
            return (
                <li className="list-group-item list-group-item-dark">
                    {this.props.linked_name} הזמין אותך לשיחת וידאו!
                    <button
                        disabled={this.props.vidButtonHide}
                        className="btn btn-success rounded-pill join-video"
                        onClick={() => this.props.connectToVideo(false)}>
                        הצטרף לשיחת וידאו!</button>
                </li>

            );
        else
            return null;
    }

    renderNewPost = () => {
        if (this.props.newPosts > 1)
            return (
                <li className="list-group-item list-group-item-dark">
                    <span>  {this.props.linked_name} העלה {this.props.newPosts} פוסטים חדשים לקיר!</span>
                    <button
                        className="btn btn-warning rounded-pill watch-post-btn"
                        onClick={this.props.routeToWall}
                    >צפה בפוסטים!
                   </button>
                </li>
            );
        else if (this.props.newPosts === 1)
            return (
                <li className="list-group-item list-group-item-dark">
                    <span>  {this.props.linked_name} העלה פוסט חדש לקיר!</span>
                    <button
                        className="btn btn-warning rounded-pill watch-post-btn"
                        onClick={this.props.routeToWall}
                    >צפה בפוסט!
               </button>
                </li>
            );
        else
            return null;
    }

    renderNextMeeting = () => {
        if (this.props.next_meeting !== null)
            return (
                <table className="table table-hover h4 table-dark rounded text-white w-75 table-sm next-meeting-table">
                    <tbody>
                        <tr>
                            <td className="align-middle">{this.formatDate(this.props.next_meeting.date, false)}</td>
                            <td className="align-middle">{this.props.next_meeting.time}</td>
                            <td className="align-middle">{this.props.next_meeting.place}</td>
                        </tr>
                        <tr>
                            <td className="align-middle" colSpan="3">{this.props.next_meeting.description}</td>
                        </tr>
                    </tbody>
                </table>
            );
        else
            return (<h1>אין פגישות קרובות</h1>);
    }

    renderList = () => {
        if (!this.props.loadingNextMeeting)
            return (
                <ul className="list-group w-50 home-list">
                    <li className="list-group-item active header-list"><h3>מה התחדש לאחרונה</h3></li>
                    {this.renderNewVideo()}
                    {this.renderNewPost()}
                    <li className="list-group-item list-group-item-dark">
                        פגישה קרובה:
                        {this.renderNextMeeting()}
                        <button
                            hidden={!this.props.next_meeting}
                            className="btn btn-danger rounded-pill meeting-btn"
                            onClick={this.props.routeToMeeting}
                        >צפה ביומן הפגישות!
                        </button>
                    </li>
                    {this.connectionStatus()}
                </ul>
            );
        else
            return (<Loader className="next-meeting-loader" type="ThreeDots" height="300px" width="300px"></Loader>)

    }

    render() {
        return (
            this.renderList()
        );
    }
}

export default NewsList;