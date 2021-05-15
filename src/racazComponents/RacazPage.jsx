import React, { Component } from "react";
 
 import UpdateUser from "../adminComponents/partial/UpdateUser"
 import DeleteUser from "../adminComponents/partial/DeleteUser";
 import UsersTable from "../adminComponents/partial/UsersTable"
 import LinkUsers from "../adminComponents/partial/LinkUsers";
 import Meetings from "./Meetings";
import firebase from "../config/Firebase";
import logo from '../static_pictures/big_brothers_big_sisters.png';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import "./RacazPage.css";
import RacazUser from "./RacazUser";

class RacazPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      zoom: Math.min(window.innerHeight / 620, window.innerWidth / 1536),
      user_name: ""
    };
    this.usersRef = firebase.firestore().collection('Users');
    this.uid = firebase.auth().currentUser.uid;
  }
  componentDidMount() {
    var webSiteWidth = 1280;
    var webScale = window.screen.width / webSiteWidth
    document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=' + webSiteWidth + ', initial-scale=' + webScale + '');

    window.addEventListener("resize", this.resizeWin);
    this.usersRef.doc(this.uid).get()
      .then((doc) => {
        this.setState({ user_name: doc.data().fName });
      })
      .catch((e) => console.log(e.name));
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
    this.props.exitRacaz();
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
            <h2 className="admin-title">ברוך הבא למסך הרכז, {this.state.user_name}</h2>
            <button className="btn btn-danger log-out-admin" onClick={this.logoutAdmin}>התנתק</button>
          </nav>
          <Router>
            <div className="sidenav admin-navbar">
              {this.addUser(activeTabStyle)}
            </div>{" "}
            {/* A <Switch> looks through its children <Route>s and
                                                    renders the first one that matches the current URL. */}{" "}
            <Switch>
              { <Route path="/RacazUser">
                <RacazUser />
              </Route> }
              <Route path="/UpdateUser">
                <UpdateUser />
              </Route>
              <Route path="/DeleteUser">
                <DeleteUser />
              </Route>
              <Route path="/UsersTable">
                <UsersTable />
              </Route>{" "}
              <Route path="/LinkUsers">
                <LinkUsers />
              </Route>
              <Route path="/Meetings">
                <Meetings />
              </Route>{" "}
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
                to="/RacazUser"
                activeStyle={activeTabStyle}
            >
              הוספת משתמש חדש
            </NavLink>
          </li>
          <li className="nav-item text-center">
            <NavLink
                className="tab"
                to="/UpdateUser"
                activeStyle={activeTabStyle}
            >
              עדכון פרטי משתמש
            </NavLink>
          </li>
          <li className="nav-item text-center">
            <NavLink
                className="tab"
                to="/DeleteUser"
                activeStyle={activeTabStyle}
            >
              מחיקת משתמש
            </NavLink>
          </li>
          <li className="nav-item text-center">
            <NavLink
                className="tab"
                to="/LinkUsers"
                activeStyle={activeTabStyle}
            >
              קישור חונך לחניך
            </NavLink>
          </li>
          <li className="nav-item text-center">
            <NavLink
                className="tab"
                to="/UsersTable"
                activeStyle={activeTabStyle}
            >
              רשימת חונכים/ חניכים
            </NavLink>
          </li>
          <li className="nav-item text-center">
            <NavLink
                className="tab"
                to="/Meetings"
                activeStyle={activeTabStyle}
            >
              קביעת פגישה
            </NavLink>
          </li>
        </ul>
    )
  }
}

export default RacazPage;
