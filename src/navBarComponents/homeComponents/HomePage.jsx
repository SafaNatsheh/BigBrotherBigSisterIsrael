import * as React from "react";
import "./HomePage.css";
import firebase, {auth} from "../../config/Firebase"
import AddPicture from "../wallComponents/wall/AddPicture"
import NewsList from "./NewsList"
import logo from '../../static_pictures/no_profile_picture.png'

export class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: "",
      vidButtonHide: true,
      profilePicture: "",
      showPicForm: false,
      newPosts: 0
    };
    this.userUid = firebase.auth().currentUser.uid;
    this.usersRef = firebase.firestore().collection('Users');
    this.cloudRef = firebase.storage().ref();
    this.myProfilePicturesRef = this.cloudRef.child('profile_pictures/' + firebase.auth().currentUser.uid);
  }

  formatDate = (date) => { // formatting date to [DD/MM/YYYY]
    if (isNaN(date.getMonth())) {
      return null;
    }
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  }

  callbackForm = (formData) => {
    this.setState({ showPicForm: formData });
  };

  connectToVideo = (hosting) => { // connect to video directly from home page
    this.setState({ vidButtonHide: true });
    this.props.directVid(hosting);
  }

  setVideoButton = () => { // determine the appearance of join video button
    if (this.props.newVideo === "added")
      this.setState({ vidButtonHide: false });
    else if (this.props.newVideo === "removed")
      this.setState({ vidButtonHide: true });
  }

  getNewPostAlert = () => {
    var postsRef;
    var linkUser;
    this.usersRef.doc(this.userUid).get()
      .then(doc => {
        if (doc.data().type === 'חונך')
          postsRef = doc.ref.collection('Posts');
        else if (doc.data().type === 'חניך')
          postsRef = this.usersRef.doc(doc.data().link_user).collection('Posts');
        linkUser = doc.data().link_user;
      })
      .then(() => {
        postsRef
          .where('uploader', '==', linkUser)
          .where('unread', '==', true)
          .get()
          .then((docs) =>
            this.setState({ newPosts: docs.docs.length }));
      })
      .catch((e) => console.log(e.name));
  }

  componentDidMount() {
    auth.onAuthStateChanged(user=> {
      console.log(user)
      if (!user) {
        window.location.href = "/"
        return
      }
      this.setVideoButton();
      this.props.getNextMeeting();
      this.setState({profilePicture: this.props.myProfilePic});
      this.getNewPostAlert();
    })
  }

  componentDidUpdate(prevProp) {
    if (this.props.newVideo !== prevProp.newVideo)
      this.setVideoButton();
    else if (this.props.myProfilePic !== prevProp.myProfilePic)
      this.setState({ profilePicture: this.props.myProfilePic });
  }

  uploadProfilePicture = () => {
    this.setState({
      showPicForm: true,
    });
  }

  deleteProfilePicture = () => {
    var con = window.confirm("האם אתה בטוח שברצונך להסיר את תמונת הפרופיל הנוכחית שלך?");
    if (!con)
      return;
    this.myProfilePicturesRef.delete()
      .then(() => {
        console.log("Deleted profile picture successfully")
        this.props.changeProfilePicture("")
      })
      .catch((e) => console.log(e.name));
  }

  setProfilePicture = (pictures, url) => {
    this.props.changeProfilePicture(url);
    this.myProfilePicturesRef.put(pictures[0]);
  };

  render() {
    return (
      <div className="page">
        <div className="homepage-main">
          <div className="homepage-background-right">
            <div className="homepage-right">
              <div className="homepage-profile-top">
                <div className="homepage-profile-name">
                  {this.props.myDetails.fName + " " + this.props.myDetails.lName}
                </div>
                <img src={this.state.profilePicture} alt="" className="homepage-profile-picture" style={{ backgroundImage: `url(${logo})` }} />
              </div>
              <div className="homepage-profile-footer">
                <div className="homepage-profile-type-m-s">
                  {this.props.myDetails.type}
                </div>
                <div className="homepage-profile-city">
                  {this.props.myDetails.area}
                </div>
                <div className="homepage-profile-birthday">
                  {this.formatDate(new Date(this.props.myDetails.birthDate))}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="homepage-background-left">
            <div className="homepage-left">
              <div className="homepage-profile-top">
                <div className="homepage-profile-name">
                  {this.props.linkedDetails.fName + " " + this.props.linkedDetails.lName}
                </div>
                <img src={this.props.friendProfilePic} alt="" className="homepage-profile-picture" style={{ backgroundImage: `url(${logo})` }} />
              </div>
              <div className="homepage-profile-footer">
                <div className="homepage-profile-type-m-s">
                  {this.props.linkedDetails.type}
                </div>
                <div className="homepage-profile-city">
                  {this.props.linkedDetails.area}
                </div>
                <div className="homepage-profile-birthday">
                  {this.formatDate(new Date(this.props.linkedDetails.birthDate))}
                </div>
              </div>
            </div>
          </div> */}
        </div>
        <button className="btn btn-success profile-upload-btn" onClick={this.uploadProfilePicture}>שנה תמונת פרופיל</button>
        <button className="btn btn-danger profile-delete-btn" onClick={this.deleteProfilePicture}>הסר תמונת פרופיל</button>
        <NewsList
          // linked_name={this.props.linkedDetails.fName}
          connectToVideo={this.connectToVideo}
          vidButtonHide={this.state.vidButtonHide}
          // otherUserConnection={this.props.otherUserConnection}
          // otherUserLastOnline={this.props.otherUserLastOnline}
          next_meeting={this.props.next_meeting}
          loadingNextMeeting={this.props.loadingNextMeeting}
          routeToWall={this.props.routeToWall}
          routeToMeeting={this.props.routeToMeeting}
          newPosts={this.state.newPosts}
        />

        {this.state.showPicForm ? (
          <AddPicture
            parentCallback={this.callbackForm}
            showText={false}
            setImagePostParent={this.setProfilePicture}
          />
        ) : null}
      </div>
    );
  }
}

export default HomePage;