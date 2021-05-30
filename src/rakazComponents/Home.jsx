import * as React from "react";
import "./Home.css";
import firebase from "../config/Firebase"
import AddPicture from "../navBarComponents/wallComponents/wall/AddPicture"
import logo from '../static_pictures/no_profile_picture.png'
import NewsList from "../navBarComponents/homeComponents/NewsList"
export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomId: "",
      vidButtonHide: true,
      profilePicture: "",
      fname: "",
      lname : "",
      area : "",
      birthdate: "",
      type : "",
      loadingNextMeeting: "",
      next_meeting: "",
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
  getNextMeeting = () => {
    var meetingRef = firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid).collection('Meetings');
    console.log(meetingRef)
    meetingRef
      .where('timeStamp', ">=", ((Date.now() / 1000)) - 900)
      .orderBy("timeStamp", "asc")
      .limit(1)
      .get()
      .then(querySnap => {
        if (!querySnap.empty)
          this.setState({ next_meeting: querySnap.docs[0].data() });
        else
          this.setState({ next_meeting: null })
      })
      .then(() => this.setState({ loadingNextMeeting: false }))
      .catch((e) => console.log(e.name))
  }
  getNewPostAlert = () => {

    
    this.usersRef.doc(this.userUid).get()
      .then(doc => {
         this.setState({ fname: doc.data().fName })
         this.setState({ lname: doc.data().lName })
         this.setState({ type: doc.data().type })
         this.setState({ area: doc.data().area })


         this.setState({ birthdate: doc.data().birthDate })

          this.myProfilePicturesRef.getDownloadURL().catch(function(error) {})
              .then(url => this.setState({profilePicture: url}))

      })
      
      .catch((e) => console.log(e.name));
  }

  componentDidMount() {
    this.setVideoButton();
    this.getNextMeeting();
    if (this.profilePicture !== undefined) {
      this.setState({profilePicture: this.myProfilePicturesRef});
    }
    else
    {
      this.setState({profilePicture: ""});
    }
    this.getNewPostAlert();
  }

  componentDidUpdate(prevProp) {
    if (this.props.newVideo !== prevProp.newVideo)
      this.setVideoButton();
    else if (this.props.myProfilePic !== prevProp.myProfilePic)
      this.setState({ profilePicture: this.myProfilePicturesRef });
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
        this.setState({ profilePicture: "" });
      })
      .catch((e) => console.log(e.name));
  }

  setProfilePicture = (pictures, url) => {
    this.setState({ profilePicture: url });
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
                  {this.state.fname + " " + this.state.lname}
                </div>
                <img src={this.state.profilePicture} alt="" className="homepage-profile-picture" style={{ backgroundImage: `url(${logo})` }} />
              </div>
              <div className="homepage-profile-footer">
                <div className="homepage-profile-type-m-s">
                  {this.state.type}
                </div>
                <div className="homepage-profile-city">
                  {this.state.area}
                </div>
                <div className="homepage-profile-birthday">
                  {this.formatDate(new Date(this.state.birthdate))}
                </div>
              </div>
            </div>
            
          </div>
          
        </div>
        
        
        <NewsList
          // linked_name={this.props.linkedDetails.fName}
          connectToVideo={this.connectToVideo}
          vidButtonHide={this.state.vidButtonHide}
          // otherUserConnection={this.props.otherUserConnection}
          // otherUserLastOnline={this.props.otherUserLastOnline}
          next_meeting={this.state.next_meeting}
          loadingNextMeeting={this.state.loadingNextMeeting}
          routeToWall={this.state.routeToWall}
          routeToMeeting={this.state.routeToMeeting}
          newPosts={this.state.newPosts}
        />

      <button className="btn btn-success profile-upload-btn" onClick={this.uploadProfilePicture}>שנה תמונת פרופיל</button>
       <button className="btn btn-danger profile-delete-btn" onClick={this.deleteProfilePicture}>הסר תמונת פרופיל</button>
    
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

export default Home;