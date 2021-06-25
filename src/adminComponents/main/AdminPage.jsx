
import Zoom from "../../Zoom/Zoom";
import React, { Component } from "react";
import Chat from "../../Chat/Chat";
import AdminUser from "../partial/AdminUser";
import UpdateUser from "../partial/UpdateUser"
import UsersTable from "../partial/UsersTable"
import LinkUsers from "../partial/LinkUsers";
import firebase, {auth} from "../../config/Firebase";
import Meetings from "../../rakazComponents/Meetings";
import Home from "../../rakazComponents/Home";
import logo from '../../static_pictures/big_brothers_big_sisters.png';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import "./AdminPage.css";
import CreateNewChat from "../partial/CreateNewChat";
//import UserDetails from "../partial/UserDetails";
//import addMeeting from "../partial/addMeeting";
//import ReportTable from "../partial/ReportTable";
class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      zoom: Math.min(window.innerHeight / 620, window.innerWidth / 1536),
      user_name: "",
        passwrd:""
    };
    this.usersRef = firebase.firestore().collection('Users');
    this.uid = firebase.auth().currentUser.uid;
  }
  myCallback = (dataFromChild) => {
      this.setState({passwrd: dataFromChild})
  }
  componentDidMount() {
      this.setState({passwrd:this.props.oldpass})
    auth.onAuthStateChanged(user=> {
      if (!user) {
        window.location.href = "/"
        return
      }
      var webSiteWidth = 1280;
      var webScale = window.screen.width / webSiteWidth
      document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=' + webSiteWidth + ', initial-scale=' + webScale + '');

      window.addEventListener("resize", this.resizeWin);
      this.usersRef.doc(this.uid).get()
          .then((doc) => {
            this.setState({user_name: doc.data().fName});
          })
          .catch((e) => console.log(e.name));
    })
  }

  resizeWin = (e) => {
    this.setState({
      zoom: Math.min(window.innerHeight / 620, window.innerWidth / 1536),
    });
  };

  logoutAdmin = () => {
    var logOutConfirm = window.confirm("האם אתה בטוח שברצונך להתנתק מהמערכת?");
    if (!logOutConfirm)
      return;
    this.props.exitAdmin();
    firebase.auth().signOut()
      .then(() => {
        console.log("Successful sign-out")
        // Sign-out successful.
      }).catch((error) => {
        console.log("Sign-out error")
        // An error happened.
      });
  }

  hrefClick = (e) => {
    var con = window.confirm("האם אתה בטוח שברצונך לעזוב את האתר?");
    if (!con)
      e.preventDefault();
  }

  render() {

    const activeTabStyle = {
      fontWeight: "bold",
    };
    return (
      <div>
        <div className="nmn" style={{ zoom: this.state.zoom }}>
          <nav>
            <a
              href="https://www.bigbrothers.org.il/"
              onClick={(e) => this.hrefClick(e)}>
              <img
                src={logo}
                alt=""
                className="MainLogoAdmin"
              />
            </a>
            <h2 className="admin-title">ברוך הבא למסך האדמין, {this.state.user_name}</h2>
            <button className="btn btn-danger log-out-admin" onClick={this.logoutAdmin}>התנתק</button>
          </nav>

          <Router>
            <div className="sidenav admin-navbar">
              {this.addUser(activeTabStyle)}
            </div>{" "}


            {/* A <Switch> looks through its children <Route>s and
                                                    renders the first one that matches the current URL. */}{" "}

            <Switch>
                <Route path="/Home">
                <Home />
                </Route>
              <Route path="/AdminUser">
                <AdminUser oldusr={this.props.oldusr} oldpass={this.state.passwrd} funcret={this.myCallback}/>
              </Route>
              <Route path="/UpdateUser/:personId">
                <UpdateUser />
              </Route>
              <Route path="/UsersTable">
                <UsersTable />
              </Route>{" "}
              <Route path="/LinkUsers">
                <LinkUsers />
              </Route>{" "}
              <Route path="/Meetings">
                <Meetings />
             </Route>{" "}
              <Route path="/Chat">
                <Chat />
              </Route>{" "}
              <Route path="/CreateChat">
                <CreateNewChat />
              </Route>{" "}
                <Route path="/UserDetails">
                    {/*<UserDetails />*/}
                </Route>{" "}
                <Route path="/ReportTable">
                    {/*} <ReportTable />*/}
                </Route>{" "}
                <Route path="/addMeeting">
                    {/*<addMeeting />*/}
                </Route>{" "}

                <Route exact path={"/zoom"} component={Zoom}/>

              <Route path="/">
              <Home />
              </Route>

            </Switch>{" "}
          </Router>{" "}
        </div>
      </div>
    );
  }


  addUser(activeTabStyle)
  {
    return(
        <ul className="nav">

            <li className="nav-item text-center">
            <NavLink
                className="tab"
                to="/Home"
                activeStyle={activeTabStyle}
            >
              <div className= "bait">
              דף הבית 
              </div>
            </NavLink>
          </li>

          <li className="nav-item text-center">
            <NavLink
                className="tab"
                to="/AdminUser"
                activeStyle={activeTabStyle}
            >הוספת משתמש חדש
            </NavLink>
          </li>
          {/*<li className="nav-item text-center">*/}
          {/*  <NavLink*/}
          {/*      className="tab"*/}
          {/*      to="/UpdateUser"*/}
          {/*      activeStyle={activeTabStyle}*/}
          {/*  >*/}
          {/*    עדכון פרטי משתמש*/}
          {/*  </NavLink>*/}
          {/*</li>*/}
          
          <li className="nav-item text-center">
            <NavLink
                className="tab"
                to="/LinkUsers"
                activeStyle={activeTabStyle}
            >קישור חונך לחניך
            </NavLink>
          </li>

          <li className="nav-item text-center">
            <NavLink
                className="tab"
                to="/UsersTable"
                activeStyle={activeTabStyle}
            >רשימת משתמשים
            </NavLink>
          </li>

          <li className="nav-item text-center">
            <NavLink
                className="tab"
                to="/Meetings"
                activeStyle={activeTabStyle}
            >קביעת פגישות
            </NavLink>
          </li>

          <li className="nav-item text-center">
            <NavLink
                className="tab"
                to="/Chat"
                activeStyle={activeTabStyle}
            >שיחות
            </NavLink>
          </li>

            <li className="nav-item text-center">
                <NavLink
                    className="tab"
                    to="/CreateChat"
                    activeStyle={activeTabStyle}
                >יצירת קבוצה
                </NavLink>
            </li>

            <li className="nav-item ">
                <NavLink
                    className="tab"
                    to="/Zoom"
                >שיחות וידאו
                </NavLink>
            </li>

        </ul>
    )
  }
}

export default AdminPage;

import Zoom from "../../Zoom/Zoom";
import React, { Component } from "react";
import Chat from "../../Chat/Chat";
import AdminUser from "../partial/AdminUser";
import UpdateUser from "../partial/UpdateUser"
import UsersTable from "../partial/UsersTable"
import LinkUsers from "../partial/LinkUsers";
import firebase, {auth} from "../../config/Firebase";
import Meetings from "../../rakazComponents/Meetings";
//import AddMeeting from "../../mainPageComponents/addMeeting"
import ReportTable from "../../mainPageComponents/ReportTable"
import Home from "../../rakazComponents/Home";

import logo from '../../static_pictures/big_brothers_big_sisters.png';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import "./AdminPage.css";
import CreateNewChat from "../partial/CreateNewChat";
//import UserDetails from "../partial/UserDetails";
//import ReportTable from "../partial/ReportTable";
class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      zoom: Math.min(window.innerHeight / 620, window.innerWidth / 1536),
      user_name: "",
        passwrd:""
    };
    this.usersRef = firebase.firestore().collection('Users');
    this.uid = firebase.auth().currentUser.uid;
  }
  myCallback = (dataFromChild) => {
      this.setState({passwrd: dataFromChild})
  }
  componentDidMount() {
      this.setState({passwrd:this.props.oldpass})
    auth.onAuthStateChanged(user=> {
      if (!user) {
        window.location.href = "/"
        return
      }
      var webSiteWidth = 1280;
      var webScale = window.screen.width / webSiteWidth
      document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=' + webSiteWidth + ', initial-scale=' + webScale + '');

      window.addEventListener("resize", this.resizeWin);
      this.usersRef.doc(this.uid).get()
          .then((doc) => {
            this.setState({user_name: doc.data().fName});
          })
          .catch((e) => console.log(e.name));
    })
  }

  resizeWin = (e) => {
    this.setState({
      zoom: Math.min(window.innerHeight / 620, window.innerWidth / 1536),
    });
  };

  logoutAdmin = () => {
    var logOutConfirm = window.confirm("האם אתה בטוח שברצונך להתנתק מהמערכת?");
    if (!logOutConfirm)
      return;
    this.props.exitAdmin();
    firebase.auth().signOut()
      .then(() => {
        console.log("Successful sign-out")
        // Sign-out successful.
      }).catch((error) => {
        console.log("Sign-out error")
        // An error happened.
      });
  }

  hrefClick = (e) => {
    var con = window.confirm("האם אתה בטוח שברצונך לעזוב את האתר?");
    if (!con)
      e.preventDefault();
  }

  render() {

    const activeTabStyle = {
      fontWeight: "bold",
    };
    return (
      <div>
        <div className="nmn" style={{ zoom: this.state.zoom }}>
          <nav>
            <a
              href="https://www.bigbrothers.org.il/"
              onClick={(e) => this.hrefClick(e)}>
              <img
                src={logo}
                alt=""
                className="MainLogoAdmin"
              />
            </a>
            <h2 className="admin-title">ברוך הבא למסך האדמין, {this.state.user_name}</h2>
            <button className="btn btn-danger log-out-admin" onClick={this.logoutAdmin}>התנתק</button>
          </nav>

          <Router>
            <div className="sidenav admin-navbar">
              {this.addUser(activeTabStyle)}
            </div>{" "}


            {/* A <Switch> looks through its children <Route>s and
                                                    renders the first one that matches the current URL. */}{" "}

            <Switch>
                <Route path="/Home">
                <Home />
                </Route>
              <Route path="/AdminUser">
                <AdminUser oldusr={this.props.oldusr} oldpass={this.state.passwrd} funcret={this.myCallback}/>
              </Route>
              <Route path="/UpdateUser">
                <UpdateUser />
              </Route>
              <Route path="/UsersTable">
                <UsersTable />
              </Route>{" "}
              <Route path="/LinkUsers">
                <LinkUsers />
              </Route>{" "}
              <Route path="/Meetings">
                <Meetings />
              </Route>
             {/* <Route path="/AddMeeting">*/}
             {/*   <AddMeeting />*/}
             {/*</Route>{" "}*/}

              <Route path="/ReportTable">
                <ReportTable />
              </Route>{" "}

              <Route path="/Chat">
                <Chat />
              </Route>{" "}
              <Route path="/CreateChat">
                <CreateNewChat />
              </Route>{" "}
                <Route path="/UserDetails">
                    {/*<UserDetails />*/}
                </Route>{" "}
                <Route path="/ReportTable">
                    {/*} <ReportTable />*/}
                </Route>{" "}

                <Route exact path={"/zoom"} component={Zoom}/>


              <Route path="/">
              <Home />
              </Route>

            </Switch>{" "}
          </Router>{" "}
        </div>
      </div>
    );
  }


  addUser(activeTabStyle)
  {
    return(
        <ul className="nav">

            <li className="nav-item text-center">
            <NavLink
                className="tab"
                to="/Home"
                activeStyle={activeTabStyle}
            >
              <div className= "bait">
              דף הבית 
              </div>
            </NavLink>
          </li>

          <li className="nav-item text-center">
            <NavLink
                className="tab"
                to="/AdminUser"
                activeStyle={activeTabStyle}
            >הוספת משתמש חדש
            </NavLink>
          </li>
          {/*<li className="nav-item text-center">*/}
          {/*  <NavLink*/}
          {/*      className="tab"*/}
          {/*      to="/UpdateUser"*/}
          {/*      activeStyle={activeTabStyle}*/}
          {/*  >*/}
          {/*    עדכון פרטי משתמש*/}
          {/*  </NavLink>*/}
          {/*</li>*/}
          
          <li className="nav-item text-center">
            <NavLink
                className="tab"
                to="/LinkUsers"
                activeStyle={activeTabStyle}
            >קישור חונך לחניך
            </NavLink>
          </li>

          <li className="nav-item text-center">
            <NavLink
                className="tab"
                to="/UsersTable"
                activeStyle={activeTabStyle}
            >רשימת משתמשים
            </NavLink>
          </li>

          <li className="nav-item text-center">
            <NavLink
                className="tab"
                to="/Meetings"
                activeStyle={activeTabStyle}
            >קביעת פגישות
            </NavLink>
          </li>

          <li className="nav-item text-center">
            <NavLink
                className="tab"
                to="/Chat"
                activeStyle={activeTabStyle}
            >שיחות
            </NavLink>
          </li>

          {/*<li className="nav-item text-center">*/}
          {/*  <NavLink*/}
          {/*      className="tab"*/}
          {/*      to="/AddMeeting"*/}
          {/*      activeStyle={activeTabStyle}*/}
          {/*  >*/}
          {/*    הוספת פגישה*/}
          {/*  </NavLink>*/}
          {/*</li>*/}

            <li className="nav-item text-center">
                <NavLink
                    className="tab"
                    to="/ReportTable"
                    activeStyle={activeTabStyle}
                >
                    הצג דוח שעות
                </NavLink>
            </li>


            <li className="nav-item text-center">
                <NavLink
                    className="tab"
                    to="/CreateChat"
                    activeStyle={activeTabStyle}
                >יצירת קבוצה
                </NavLink>
            </li>

            <li className="nav-item ">
                <NavLink
                    className="tab"
                    to="/Zoom"
                >שיחות וידאו
                </NavLink>
            </li>


        </ul>
    )
  }
}

export default AdminPage;

