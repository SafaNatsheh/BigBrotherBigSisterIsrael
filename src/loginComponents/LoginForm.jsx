import React from "react";
import "./LoginForm.css";
import firebase from "../config/Firebase";
import Loader from "react-loader-spinner";
import logo from '../static_pictures/big_brothers_big_sisters.png'

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      loading: false,
      pwdAttempt: 0,
      prevEmail: ""
    };

    this.usersRef = firebase.firestore().collection('Users');
  }

  resetPwd = () => {
    if (this.state.username === "") {
      alert("אנא הכנס כתובת אימייל בשדה המתאים");
      return;
    }
    firebase
      .auth()
      .sendPasswordResetEmail(this.state.username)
      .then(() => alert("הסיסמא החדשה נשלחה אליך למייל"))
      .catch(() => alert("שגיאה בהזנת הנתונים"));
  };

  onLoginSuccess() {
    console.log("Successful login");
  }

  componentDidUpdate(prevProp) {
    if (this.props.isLoggedIn !== prevProp.isLoggedIn)
      this.setState({ loading: false });
  }

  onLoginFail() {
    alert("שם משתמש או סיסמא שגויים");
    this.setState({ password: "", loading: false });
  }

  onLoginPress(e) {
    e.preventDefault();
    if (this.state.username === "") {
      alert("אנא הכנס שם משתמש");
      return;
    }
    if (this.state.password === "") {
      alert("אנא הכנס סיסמא");
      return;
    }

    const username = this.state.username;
    const password = this.state.password;
    this.setState({ loading: true });
    firebase
      .auth()
      .signInWithEmailAndPassword(username, password)
      .then(this.onLoginSuccess.bind(this))
      .catch(this.onLoginFail.bind(this));
  }

  renderButton() {
    if (this.state.loading) {
      return (
        <Loader
          className="indicator"
          type="Bars"
          height="100px"
          width="100px"
        />
      );
    } else {
      return (
        <button
          type="submit"
          id="submit-login"
          className="btn btn-lg btn-success"
        >
          התחבר
        </button>
      );
    }
  }

  render() {
    return (
      <div className="login-menu">
        <img
          src={logo}
          alt="asfsa"
          className="Login-logo"
        />
        <h1 className="headline">ברוכים הבאים לאזור האישי </h1>
        <form className="px-4 py-3" onSubmit={(e) => this.onLoginPress(e)}>
          <div className="login-fm">
            <div className="form-group login-form w-100">
              <input
                type="text"
                className="form-control input-login"
                id="userName"
                placeholder="שם משתמש"
                title="שם משתמש"
                value={this.state.username}
                onChange={(e) => this.setState({ username: e.target.value })}
              />
            </div>
            <div className="form-group login-form w-100">
              <input
                type="password"
                className="form-control input-login"
                id="exampleDropdownFormPassword2"
                placeholder="סיסמא"
                title="סיסמא"
                value={this.state.password}
                onChange={(e) => this.setState({ password: e.target.value })}
              />
              <br />
              {this.renderButton()}
              <br />
              <br />
              <button
                type="button"
                className="forget-pwd"
                onClick={this.resetPwd}
              >
                שכחתי את הסיסמא
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default LoginForm;
