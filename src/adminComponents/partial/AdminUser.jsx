import React, {Component} from "react";
import "./AdminUser.css";
import firebase, {auth,CreateNewUser,db} from "../../config/Firebase"

class AdminUser extends Component {
  constructor(props) {
    super(props);
    this.usersRef = db.collection('Users');
    this.state = {
      firstName: "",
      lastName: "",
      id: "",
      email: "",
      phone: "",
      address: "",
      area: "",
      gender: "",
      birthDate: "",
      type: "",
      first: "",
      addOnce: true,
      changeUser:false,
      passwrd:"",
      isauthed: false
    };

  }

  onLoginFail() {
    alert("שם משתמש או סיסמא שגויים");
  }

    onLoginSuccess() {
      this.props.funcret(this.state.passwrd)
      this.setState({isauthed:true })
      this.usersRef.get()
          .then(querySnap => querySnap.forEach(doc => {
              if (doc.data().id === this.state.id || doc.data().email === this.state.email) {
                  alert("כבר קיים משתמש במערכת עם מספר תעודת זהות זהה.");
                  throw Error(500);
              }
          }))
          .then(() => {
              CreateNewUser(this.state.email, this.state.id)
                  .catch(() => {
                      alert("בעיה בהוספת משתמש חדש למערכת. ייתכן והסיסמא שהוכנסה קצרה או חלשה מדי או שהאימייל שהוכנס כבר קיים במערכת.");
                  })
          })
          .catch(() => console.log("נוצרה בעיה בהוספת משתמש חדש למערכת."))
  }



  componentDidMount() {
    if (this.props.oldpass !== "") {

      this.setState({passwrd: this.props.oldpass , isauthed:true})
    }
    firebase.auth().onAuthStateChanged(user=> {
      if (!user) {
        window.location.href = "/"
        return
      }

      if (user.email === this.props.oldusr.email && this.state.isauthed === false && this.state.passwrd !== "") {

      }

       if (this.state.isauthed === true) {

      this.usersRef.doc(user.uid).get().then(doc => {
            if (!doc.exists && this.state.addOnce) {
              this.setState({addOnce: false});
              let newUser = {
                fName: this.state.firstName,
                lName: this.state.lastName,
                id: this.state.id,
                email: this.state.email,
                phone: this.state.phone,
                area: this.state.area,
                gender: this.state.gender,
                type: this.state.type,
                first: "true",
                birthDate: this.state.birthDate
              }
              if (this.state.address !== "")
                newUser.address = this.state.address;
              if (this.state.addOnce === false && this.state.id !== "") {

                this.usersRef.doc(user.uid).set(newUser)
                    .then(() => {
                      console.log(user.uid)
                      alert("המשתמש נוסף למערכת בהצלחה!");
                    }).then(()=>{
                  auth.signInWithEmailAndPassword(this.props.oldusr.email, this.state.passwrd).then(()=>{
                    this.setState({
                      addOnce: true,
                      firstName: "", lastName: "", id: "",
                      email: "", phone: "", address: "", area: "",
                      gender: "", birthDate: "", type: "", first: "true"
                    })
                  })
                }).catch((e) => console.log(e.name))

              }
            }


          }
      )
    }
    })
  }

  addUser = (event) => {
    event.preventDefault();
    var con = window.confirm("האם אתה בטוח שברצונך להוסיף משתמש זה?")
    if (!con)
      return;
    if (this.state.id.length !== 9) {
        alert("מספר תז לא תקין");
        return;
    }
    if (this.state.phone.length !== 10 || this.state.phone.substring(0, 2) !== "05") {
        alert("מספר טלפון לא תקין");
        return;
    }
    let newDate = new Date();
    let year = newDate.getFullYear();

    if (year - (parseInt(this.state.birthDate.substring(0,4) , 10 )) < 6) {
      alert("תאריך לידה לא תקין");
      return;
    }
    if (this.state.isauthed === true) {
      this.onLoginSuccess()
    }
    else {
      auth.signInWithEmailAndPassword(this.props.oldusr.email, this.state.passwrd).then(this.onLoginSuccess.bind(this))
          .catch(this.onLoginFail.bind(this));
    }
  }

  render() {
    return (
      <form className="add-user-form" onSubmit={this.addUser}>
        <header className="title">
          <h1 className="add-user-h">
            <u> הוספת משתמש חדש</u>
          </h1>
        </header>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="inputFirstName">שם פרטי</label>
            <input
              required
              type="text"
              className="form-control"
              id="inputFirstName"
              value={this.state.firstName}
              placeholder="שם פרטי"
              title="שם פרטי"
              onChange={(e) => this.setState({ firstName: e.target.value })}
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="inputLastName">שם משפחה</label>
            <input
              required
              type="text"
              className="form-control"
              id="inputLastName"
              value={this.state.lastName}
              placeholder="שם משפחה"
              onChange={(e) => this.setState({ lastName: e.target.value })}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="inputEmail">אימייל</label>
            <input
              required
              type="email"
              className="form-control"
              id="inputEmail"
              value={this.state.email}
              placeholder="email@example.com"
              onChange={(e) => this.setState({ email: e.target.value })}
            />
          </div>

          <div className="form-group col-md-61">
            <label htmlFor="inputId">תעודת זהות</label>
            <input
              type="number"
              className="form-control"
              id="inputId"
              value={this.state.id}
              placeholder="תעודת זהות"
              onChange={(e) => this.setState({ id: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="inputPhone">טלפון</label>
            <input
              required
              type="number"
              className="form-control"
              id="inputPhone"
              value={this.state.phone}
              placeholder="טלפון"
              onChange={(e) => this.setState({ phone: e.target.value })}
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="inputCity">אזור מגורים</label>
            <input
              required
              type="text"
              className="form-control"
              id="inputCity"
              value={this.state.area}
              placeholder="אזור מגורים"
              onChange={(e) => this.setState({ area: e.target.value })}
            />
          </div>
        </div>
        <div className="form-row">
        <div className="form-group">
          <label htmlFor="inputAddress">כתובת מגורים</label>
          <input
            type="text"
            className="form-control"
            id="inputAddress"
            value={this.state.address}
            placeholder="כתובת מגורים"
            onChange={(e) => this.setState({ address: e.target.value })}
          />
        </div>

          <div className="form-group col-md-6">
            <label htmlFor="inputState">מין</label>
            <select
                required id="inputState"
                className="form-control"
                value={this.state.gender}
                onChange={(e) => this.setState({ gender: e.target.value })}>
              <option id="ff" disabled value=""> בחר מין</option>
              <option >זכר</option>
              <option >נקבה</option>
            </select>
          </div>

        </div>
        <div className="form-row">

          <div className="form-group col-md-6">
            <label htmlFor="inputCity">תאריך לידה</label>
            <input
              required
              type="date"
              className="form-control"
              id="inputBirthDate"
              value={this.state.birthDate}
              placeholder="תאריך לידה"
              onChange={(e) => this.setState({ birthDate: e.target.value })}
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="inputState">סוג המשתמש</label>
            <select
              required id="inputState"
              className="form-control"
              value={this.state.type}
              onChange={(e) => this.setState({ type: e.target.value })}>
              <option id="ff" disabled value=""> הכנס סוג משתמש</option>
              <option >אדמין</option>
              <option >רכז</option>
              <option >מדריך</option>
              <option >חונך</option>
              <option >חניך</option>

            </select>
          </div>
        </div>

        {this.state.isauthed === false && <div className="form-group col-md-4">
          <h3>אמות סיסמת אדמין</h3>
          <input
              required
              type="text"
              className="form-control"
              id="password"
              value={this.state.passwrd}
              placeholder="סיסמת אדמין"
              onChange={(e) => this.setState({passwrd: e.target.value})}
          />
        </div>
        }
        <button type="submit" className="btn btn-success add-new-user-btn">
          הוסף משתמש חדש
        </button>
      </form>
    );
  }
}

export default AdminUser;
