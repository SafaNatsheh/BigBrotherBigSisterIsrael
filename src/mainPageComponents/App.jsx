import React, { Component } from "react";
import Meetings from "../rakazComponents/Meetings";
import Chat from "../Chat/Chat"
import WallPost from "../navBarComponents/wallComponents/wall/WallPost";
import Profile from "../navBarComponents/wallComponents/profile/Profile";
import HomePage from "../navBarComponents/homeComponents/HomePage";
import VideoPage from "../navBarComponents/videoComponents/main/VideoPage";
import ChangePassword from "./ChangePassword"
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import firebase, {auth} from "../config/Firebase"
import Loader from 'react-loader-spinner'
import logo from '../static_pictures/big_brothers_big_sisters.png'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect,
} from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: {
        fName: "",
        lName: "",
        type: ""
      },
      linkedUserDetails: {
        fName: "",
        lName: "",
        type: ""
      },
      isMounted: false,
      loadingUser: true,
      loadingLinkedUser: true,
      next_meeting: null,
      loadingNextMeeting: true,
      active: false,
      isOnVideo: false,
      notAllowed: false,
      roomId: "",
      newVideo: "",
      pageLoaded: false,
      directVid: false,
      hostVid: null,
      routeToWall: false,
      routeToMeeting: false,
      otherUserConnection: false,
      otherUserLastOnline: null,
      pwdRender: false,
      connectionKey: "",
      link_user: "",
      profilePicture: "",
      friendProfile: "",
      stopSnap: null,
      zoom: Math.min(window.innerHeight / 620, window.innerWidth / 1536)
    };
    this.usersRef = firebase.firestore().collection('Users');
    this.connectionRef = firebase.database().ref('.info/connected');
    this.currUserUid = firebase.auth().currentUser.uid;
    this.cloudRef = firebase.storage().ref();
    this.myProfilePicturesRef = this.cloudRef.child('profile_pictures/' + firebase.auth().currentUser.uid);
  }

  componentWillUnmount() {
    if (this.state.stopSnap)
      this.state.stopSnap();
  }

  logout = () => {
    var logOutConfirm = window.confirm("האם אתה בטוח שברצונך להתנתק מהמערכת?");
    if (!logOutConfirm)
      return;
    if (this.state.isMounted)
      this.updateDisconnection();
    firebase.auth().signOut()
      .then(() => {
        console.log("Successful sign-out")
        // Sign-out successful.
      })
      .catch((error) => {
        console.log("Sign-out error")
        // An error happened.
      });
  }

  resizeWin = (e) => {
    this.setState({
      zoom: Math.min(window.innerHeight / 620, window.innerWidth / 1536)
    });
  };

  getUserName = () => {
    if (firebase.auth().currentUser === null)
      return;
    var currUserUid = firebase.firestore().collection('Users').doc(this.currUserUid);
    currUserUid
      .get()
      .then((uDetail) => {
        if (!uDetail.exists) {
          alert("משתמש זה לא קיים יותר במערכת. אנא פנה למנהל.");
          firebase.auth().signOut();
        }
        else {
          this.setState({ userDetails: uDetail.data() },
            () => this.setState({ loadingUser: false }))
        }
      })
      .catch((e) => console.log(e.name));
  }

  setLinkedUser = (doc) => {
    this.setState({ linkedUserDetails: doc.data() });
    this.setState({ loadingLinkedUser: false });
  }

  getLinkedUser = () => {
    var docRef = this.usersRef.doc(this.state.userDetails.link_user);
    docRef
      .get()
      .then((doc) => this.setLinkedUser(doc))
      .catch((e) => console.log(e.name))
  }

  getNextMeeting = () => {
    var meetingRef = this.usersRef.doc(this.currUserUid).collection('Meetings')
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

  checkIfVideo = (event) => {
    if (this.state.isOnVideo) {
      var con = window.confirm("האם אתה בטוח שברצונך לסיים את שיחת הוידאו?");
      if (con)
        this.setState({ directVid: false, hostVid: null, isOnVideo: false });
      else
        event.preventDefault();
    }
    else if (this.state.notAllowed)
      this.setState({ directVid: false, hostVid: null, isOnVideo: false });
  }

  modifyVideoStream = (localSt, remoteSt) => {
    this.setState({ isOnVideo: true });
  }

  modifyVideoNotAllowed = () => {
    this.setState({ notAllowed: true });
  }

  updateConnection = () => {
    var myConnectionsRef = firebase.database().ref('users/' + this.state.userDetails.id + '/connected');
    var lastOnlineRef = firebase.database().ref('users/' + this.state.userDetails.id + '/lastOnline');
    var friendConnectionsRef = firebase.database().ref('users/' + this.state.linkedUserDetails.id + '/connected');
    var friendOnlineRef = firebase.database().ref('users/' + this.state.linkedUserDetails.id + '/lastOnline');
    this.connectionRef.on('value', (snap) => {
      if (snap.val() === true) {
        var con = myConnectionsRef.push();
        con.onDisconnect().remove(this.removeDocs);
        this.setState({ connectionKey: con.key });
        con.set(true);
        lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
      }
    });
    friendConnectionsRef.on('value', (snap) => {
      if (snap.val() !== null)
        this.setState({ otherUserConnection: true })
      else
        this.setState({ otherUserConnection: false })
    });
    friendOnlineRef.on('value', (snap) => {
      this.setState({ otherUserLastOnline: snap.val() })
    });
  }

  removeDocs = () => {
    var ref = this.usersRef
      .doc(this.state.userDetails.link_user)
      .collection('Rooms');
    ref
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          doc.ref.collection('first_participant')
            .get()
            .then(subSnap => {
              subSnap.forEach(subDoc =>
                subDoc.ref.delete())
              doc.ref.collection('second_participant')
                .get()
                .then(subSnap =>
                  subSnap.forEach(subDoc =>
                    subDoc.ref.delete()))
            })
            .then(() => {
              doc.ref.delete();
            })
        })
      }).then(() => {
        console.log("Docs has removed successfully")
      })
      .catch(() => {
        console.log("Problem in removing Doc")
      })
  }

  updateDisconnection = () => {
    var myConnectionsRef = firebase.database().ref('users/' + this.state.userDetails.id + '/connected');
    var lastOnlineRef = firebase.database().ref('users/' + this.state.userDetails.id + '/lastOnline');
    myConnectionsRef.child('/' + this.state.connectionKey).remove();
    lastOnlineRef.set(firebase.database.ServerValue.TIMESTAMP);
  }

  getProfilePictures = () => {
    this.myProfilePicturesRef.getDownloadURL()
      .then(url => this.setState({ profilePicture: url }))
      .catch((e) => console.log(e.name));
    this.usersRef.doc(this.currUserUid).get()
      .then(doc => this.setState({ link_user: doc.data().link_user },
        () => {

          this.cloudRef.child('profile_pictures/' + this.state.link_user)
            .getDownloadURL()
            .then((url) => this.setState({ friendProfile: url }))
            .catch((e) => console.log(e.name));
        }))
      .catch((e) => console.log(e.name));
  }

  changeProfilePictue = (url) => {
    this.setState({ profilePicture: url });
  }

  componentDidMount() {
    auth.onAuthStateChanged(user=> {
      console.log(user)
      if (!user) {
        window.location.href = "/"
        return
      }
      var webSiteWidth = 1280;
      var webScale = window.screen.width / webSiteWidth
      document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=' + webSiteWidth + ', initial-scale=' + webScale + '');

      window.addEventListener("resize", this.resizeWin);
      this.getUserName();
      this.getProfilePictures();
    })
  }

  componentDidUpdate(prevProp, prevState) {
    if (this.state.userDetails.email !== prevState.userDetails.email) {
      var mateDoc;
      if ((typeof (this.state.userDetails.link_user) === 'undefined' || this.state.userDetails.link_user === "") && this.state.userDetails.type === "חניך") {
        alert("למשתמש זה אין חונך. אנא פנה למנהל המערכת עם הודעה זו.");
        this.setState({ loadingLinkedUser: false });
        this.setState({linkedUserDetails : {fName: "אין", lName: "חונך" , type: "" , area: "" , birthDate: ""}});
      }
      else if ((typeof (this.state.userDetails.link_user) === 'undefined' || this.state.userDetails.link_user === "") && this.state.userDetails.type === "חונך") {
        alert("למשתמש זה אין חניך. אנא פנה למנהל המערכת עם הודעה זו.");
        this.setState({ loadingLinkedUser: false });
        this.setState({linkedUserDetails : {fName: "אין", lName: "חניך" , type: "" , area: "" , birthDate: ""}});
      }
      else {
        this.getLinkedUser();
        mateDoc = firebase.firestore().collection('Users').doc(this.state.userDetails.link_user);
        mateDoc.get()
          .then((doc) => {
            if ((!doc.exists || doc.data().link_user === "") && this.state.linkedUserDetails.type === "חניך") {
              alert("למשתמש זה אין חונך. אנא פנה למנהל המערכת עם הודעה זו.");
              this.setState({ loadingLinkedUser: false });
              this.setState({linkedUserDetails : {fName: "אין", lName: "חונך" , type: "" , area: "" , birthDate: ""}});
            }
            else if ((!doc.exists || doc.data().link_user === "") && this.state.linkedUserDetails.type === "חונך") {
              alert("למשתמש זה אין חניך. אנא פנה למנהל המערכת עם הודעה זו.");
              this.setState({ loadingLinkedUser: false });
              this.setState({linkedUserDetails : {fName: "אין", lName: "חניך" , type: "" , area: "" , birthDate: ""}});
            }
            else {
              this.setState({ isMounted: true });
              this.updateConnection();
              var unsubscribe = this.usersRef.doc(this.currUserUid).collection('Rooms').onSnapshot(snapshot => { //listen to a room creation
                snapshot.docChanges().forEach(change => {
                  if (this.state.otherUserConnection && change.type === "added" && change.doc.data() && !change.doc.data().answer) {
                    this.setState({ newVideo: "added" });
                    this.setState({ roomId: change.doc.id }, () => {
                      var con = window.confirm(`${this.state.linkedUserDetails.fName} הזמין אותך לשיחת וידאו. האם אתה מעוניין להצטרף?`)
                      if (con)
                        this.directVid(false);
                    });
                  }
                  else if (change.type === "removed")
                    this.setState({ roomId: "", newVideo: "removed" });
                });
              });
              this.setState({ stopSnap: unsubscribe });
            }
          })
          .catch((e) => console.log(e.name));
      }
    }
  }

  directVid = (hosting) => {
    this.setState({ directVid: true, hostVid: hosting })
  }

  hrefClick = (e) => {
    var con = window.confirm("האם אתה בטוח שברצונך לעזוב את האתר?");
    if (!con)
      e.preventDefault();
  }

  routeToVideo = () => {
    if (this.state.directVid)
      return (<Redirect push to="/VideoPage" ></Redirect>);
    return null;
  }

  getWallRouteStatus = () => {
    this.setState({ routeToWall: true })
  }

  routeToWall = () => {
    if (this.state.routeToWall) {
      this.setState({ routeToWall: false })
      return (<Redirect push to="/Wall" ></Redirect>);
    }
    return null;
  }

  getMeetingRouteStatus = () => {
    this.setState({ routeToMeeting: true })
  }

  routeToMeeting = () => {
    if (this.state.routeToMeeting) {
      this.setState({ routeToMeeting: false })
      return (<Redirect push to="/Meeting" ></Redirect>);
    }
    return null;
  }

  waitUntilPageIsLoaded = () => {
    if (this.state.loadingUser || this.state.loadingLinkedUser)
      return (
        <div className="loader-element">
          <h1>אנא המתן... </h1>
          <Loader color="#776078" width="300px" height="300px" type="Bars" />
        </div>
      );
    else
      return (
        <Switch>
          <Route path="/VideoPage">
            <VideoPage
              userName={this.state.userDetails.fName}
              linkedName={this.state.linkedUserDetails.fName}
              linkId={this.state.userDetails.link_user}
              myLinkId={this.state.linkedUserDetails.link_user}
              modifyVideoStream={this.modifyVideoStream}
              directVid={this.state.directVid}
              hostVid={this.state.hostVid}
              room_id={this.state.roomId}
              removeDocs={this.removeDocs}
              modifyVideoNotAllowed={this.modifyVideoNotAllowed}
            />

          </Route>{" "}
          <Route path="/Wall">
            <div className="app-page">
              <Profile
                userDetails={this.state.userDetails}
                profilePic={this.state.profilePicture}
              />
              <WallPost
                userName={this.state.userDetails.fName + " " + this.state.userDetails.lName}
                friendName={this.state.linkedUserDetails.fName + " " + this.state.linkedUserDetails.lName}
                myProfilePic={this.state.profilePicture}
                friendProfilePic={this.state.friendProfile}
              />
              <Profile
                userDetails={this.state.linkedUserDetails}
                profilePic={this.state.friendProfile}
              />
            </div>{" "}
            {this.routeToVideo()}
          </Route>{" "}
          <Route path="/HomePage">
            <HomePage
              myDetails={this.state.userDetails}
              linkedDetails={this.state.linkedUserDetails}
              directVid={this.directVid}
              newVideo={this.state.newVideo}
              otherUserConnection={this.state.otherUserConnection}
              otherUserLastOnline={this.state.otherUserLastOnline}
              next_meeting={this.state.next_meeting}
              getNextMeeting={this.getNextMeeting}
              loadingNextMeeting={this.state.loadingNextMeeting}
              routeToWall={this.getWallRouteStatus}
              routeToMeeting={this.getMeetingRouteStatus}
              myProfilePic={this.state.profilePicture}
              friendProfilePic={this.state.friendProfile}
              changeProfilePictue={this.changeProfilePictue}
            />
            {this.routeToWall()}
            {this.routeToVideo()}
            {this.routeToMeeting()}
          </Route>{" "}
          <Route path="/Meetings">
            <Meetings />
            {this.routeToVideo()}
          </Route>{" "}
          <Route path="/Chat">
            <Chat />
          </Route>{" "}
          <Redirect push to="/HomePage" ></Redirect>
        </Switch>
      );
  }

  changePassword = () => {
    this.setState({ pwdRender: true })
  }

  closeChangePassword = () => {
    this.setState({ pwdRender: false })
  }

  renderPwd = () => {
    if (this.state.pwdRender)
      return (<ChangePassword parentCallback={this.closeChangePassword} email={this.state.userDetails.email} />);
    else
      return null;
  }

  render() {

    const activeTabStyle = {
      fontWeight: "bold",
      backgroundColor: "#4CAF50",
    };

    return (
      <div className="main-page-app" style={{ zoom: this.state.zoom }}>
        <Router>
          <div>
            <nav>
              <a
                href="https://www.bigbrothers.org.il/"
                onClick={(e) => this.hrefClick(e)}>
                <img
                  src={logo}
                  alt=""
                  className="MainLogo"
                />
              </a>
              <ul className="nav">
                <li className="nav-item ">
                  <NavLink
                    className="tab"
                    to="/HomePage"
                    activeStyle={activeTabStyle}
                    onClick={(event) => this.checkIfVideo(event)}
                  >
                    בית{" "}
                  </NavLink>{" "}
                </li>{" "}
                <li className="nav-item ">
                  <NavLink
                    className="tab"
                    to="/Wall"
                    activeStyle={activeTabStyle}
                    onClick={(event) => this.checkIfVideo(event)}
                  >
                    קיר{" "}
                  </NavLink>{" "}
                </li>{" "}
                <li className="nav-item ">
                  <NavLink
                    className="tab"
                    to="/VideoPage"
                    activeStyle={activeTabStyle}
                  >
                    שיחת וידאו{" "}
                  </NavLink>{" "}
                </li>{" "}
                <li className="nav-item">
                  <NavLink
                    className="tab"
                    to="/Meetings"
                    activeStyle={activeTabStyle}
                    onClick={(event) => this.checkIfVideo(event)}
                  >
                    קביעת פגישה{" "}
                  </NavLink>{" "}
                </li>{" "}
                <li className="nav-item">
                  <NavLink
                      className="tab"
                      to="/Chat"
                      activeStyle={activeTabStyle}

                  >
                    Chat{" "}
                  </NavLink>{" "}
                </li>{" "}
              </ul>{" "}
              <div className="navbar-options">
                <button onClick={this.changePassword} className="btn btn-outline-info change-pwd-btn"><h6>שינוי סיסמא</h6></button>
                <h1 className="username-home">שלום, {this.state.userDetails.fName + " " + this.state.userDetails.lName}</h1>
              </div>
              <button className="btn btn-danger sign-out-btn" onClick={this.logout}>התנתק</button>
            </nav>{" "}
            {/* A <Switch> looks through its children <Route>s and
                                                        renders the first one that matches the current URL. */}{" "}
            {this.waitUntilPageIsLoaded()}
          </div>{" "}
        </Router>{" "}
        {this.renderPwd()}
      </div>
    );
  }
}

export default App;
