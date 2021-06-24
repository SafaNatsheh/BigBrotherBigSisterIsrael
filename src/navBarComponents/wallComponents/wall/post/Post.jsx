import * as React from "react";
import "./Post.css";
import firebase, {auth} from "../../../../config/Firebase"
import logo from '../../../../static_pictures/no_profile_picture.png'

export class Post extends React.Component {
  constructor() {
    super();
    this.state = {
      hidePicture: false
    };
    this.userUid = firebase.auth().currentUser.uid;
  }

  componentDidMount() {
    auth.onAuthStateChanged(user=>{
      console.log(user)
      if(!user)
      {
        window.location.href="/"
        return
      }
    if (this.props.img === "")
      this.setState({ hidePicture: true })
  })
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

  formatTime = (timeStamp) => {
    var newTime = new Date(timeStamp);
    var minutes = newTime.getMinutes();
    var fullMinutes = minutes < 10 && minutes >= 0 ? "0" + minutes : minutes;
    return "בשעה " + newTime.getHours() + ":" + fullMinutes;
  }

  renderProgress = () => {
    if (this.props.uploadProgress !== 0 && this.props.uploadProgress !== 100 && this.props.currId === this.props.id) {
      return (
        <div className="progress progress-pic">
          <div className="progress-bar" role="progressbar" style={{ width: this.props.uploadProgress + "%" }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">מעלה תמונה... {Math.round(this.props.uploadProgress)}%</div>
        </div>
      );
    }
    else
      return null;
  }

  renderPost = () => {
    if (this.props.uploader === this.userUid)
      return (
        <div className="post-profile">
          <img src={this.props.myProfilePic} alt="" className="post-men-picture" style={{ backgroundImage: `url(${logo})` }} />
          <div className="post-men-name">{this.props.userName}</div>
        </div>
      );

    else
      return (
        <div className="post-profile">
          <img src={this.props.friendProfilePic} alt="" className="post-men-picture" style={{ backgroundImage: `url(${logo})` }} />
          <div className="post-men-name">{this.props.friendName}</div>
        </div>
      );
  }

  render() {
    return (
      <div className="post-main">
        <div className="post-top">
          {this.renderPost()}
          <div className="post-options">
            <div className="post-date">{this.formatDate(this.props.timeStamp) + " " + this.formatTime(this.props.timeStamp)}</div>
            <div className="post-delete" onClick={this.props.delete}>
              X
            </div>
          </div>
        </div>

        <div className="post-footer">{this.props.body}</div>

        {this.props.img.map((image, index) => {
          return (
            <img key={"img" + index} className="post-picture" hidden={this.state.hidePicture} src={image} alt="" />
          );
        })}
        {this.renderProgress()}
      </div>
    );
  }
}

export default Post;