import React, { Component } from "react";
import "./UpdateUser.css";
import firebase from "../../config/Firebase"


class UpdateUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            id: "",
            email: "",
            phone: "",
            address: "",
            area: "",
            birthDate: "",
            type: "",
            transferEnable: false,
            docId: ""
        };
        this.usersRef = firebase.firestore().collection('Users');
        firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid).get()
        .then((doc) => {
            this.type = doc.data().type;
        })
        .catch((e) => console.log(e.name))
    }

    getUserByEmailOrId(event) {
        event.preventDefault();
        if (this.state.email === "" && this.state.id === "") {
            alert("אנא מלא את אחד מהשדות: אימייל או תעודת זהות");
            return;
        }
        if (this.state.email !== "" && this.state.id !== "") {
            alert("אנא מלא רק אחד מהשדות: אימייל או תעודת זהות");
            return;
        }
        if (this.state.email !== "") {
            this.usersRef
                .where('email', "==", this.state.email)
                .limit(1)
                .get()
                .then(docs => {
                    if (docs.empty) {
                        alert("משתמש זה לא קיים במערכת");
                        throw Error(500);
                    }
                    else {
                        docs.forEach(doc => {
                            this.setState({
                                firstName: doc.data().fName,
                                lastName: doc.data().lName,
                                id: doc.data().id,
                                phone: doc.data().phone,
                                address: doc.data().address,
                                area: doc.data().area,
                                birthDate: doc.data().birthDate,
                                type: doc.data().type,
                                transferEnable: true,
                                docId: doc.id
                            })
                        })
                    }
                })
                .catch((e) => console.log(e.name));
        }
        if (this.state.id !== "") {
            this.usersRef
                .where('id', "==", this.state.id)
                .limit(1)
                .get()
                .then(docs => {
                    if (docs.empty) {
                        alert("משתמש זה לא קיים במערכת");
                        throw Error(500);
                    }
                    else {
                        docs.forEach(doc => {
                            this.setState({
                                firstName: doc.data().fName,
                                lastName: doc.data().lName,
                                email: doc.data().email,
                                phone: doc.data().phone,
                                address: doc.data().address,
                                area: doc.data().area,
                                birthDate: doc.data().birthDate,
                                type: doc.data().type,
                                transferEnable: true,
                                docId: doc.id
                            })
                        })
                    }
                })
                .catch((e) => console.log(e.name));
        }
    }

    UpdateUser = (event) => {
        event.preventDefault();
        if(this.type === "רכז" && this.state.type === "אדמין"){
            alert("אין לך הרשאות לעדכן ");
            this.setState({
                firstName: "", lastName: "", id: "",
                email: "", phone: "", address: "", area: "",
                birthDate: "", type: "",
                transferEnable: false
            })

            return;
        }
        if(this.type === "מדריך" && (this.state.type === "אדמין"|| this.state.type === "רכז")){
            alert("אין לך הרשאות לעדכן ");
            this.setState({
                firstName: "", lastName: "", id: "",
                email: "", phone: "", address: "", area: "",
                birthDate: "", type: "",
                transferEnable: false
            })

            return;
        }
        var con = window.confirm("האם אתה בטוח שברצונך לעדכן משתמש זה?")
        if (!con)
            return;
            console.log(this.type);
            console.log(this.state.type);
            
            
        var newUser = {
            fName: this.state.firstName,
            lName: this.state.lastName,
            phone: this.state.phone,
            area: this.state.area,
            type: this.state.type,
            birthDate: this.state.birthDate
        }
        if (this.state.address !== "")
            newUser.address = this.state.address;
        this.usersRef.doc(this.state.docId).update(newUser)
            .then(() => {
                alert("פרטי המשתמש התעדכנו במערכת בהצלחה!");
                this.setState({
                    firstName: "", lastName: "", id: "",
                    email: "", phone: "", address: "", area: "",
                    birthDate: "", type: "",
                    transferEnable: false
                })
            })
            .catch((e) => console.log(e.name + " נוצרה בעיה בעדכון פרטי המשתמש."));
        
    }

    render() {
        return (
            <form className="update-user-form">
                <header className="title">
                    <h1 className="update-user-h">
                        <u> עדכון פרטי משתמש</u>
                    </h1>
                </header>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="inputFirstName">שם פרטי</label>
                        <input
                            required
                            disabled={!this.state.transferEnable}
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
                            disabled={!this.state.transferEnable}
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
                            disabled={this.state.transferEnable}
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
                            disabled={this.state.transferEnable}
                            type="number"
                            className="form-control"
                            id="inputId"
                            value={this.state.id}
                            placeholder="תעודת זהות"
                            onChange={(e) => this.setState({ id: e.target.value })}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="inputPhone">טלפון</label>
                        <input
                            disabled={!this.state.transferEnable}
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
                            disabled={!this.state.transferEnable}
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
                        disabled={!this.state.transferEnable}
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
                        required
                        disabled={!this.state.transferEnable}
                        id="inputState"
                        className="form-control"
                        value={this.state.gender}
                        onChange={(e) => this.setState({ gender: e.target.value })}>
                        <option id="ff" disabled value="">בחר המין</option>
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
                            disabled={!this.state.transferEnable}
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
                            required
                            disabled={!this.state.transferEnable}
                            id="inputState"
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

                <button
                    type="submit"
                    disabled={this.state.transferEnable}
                    className="btn btn-success load-user-btn"
                    onClick={(e) => this.getUserByEmailOrId(e)}
                >
                    טען פרטי משתמש
        </button>
                <button type="submit"
                    disabled={!this.state.transferEnable}
                    className="btn btn-warning update-user-btn"
                    onClick={this.UpdateUser}
                >
                    עדכן פרטי משתמש
        </button>
            </form>
        );
    }
}

export default UpdateUser;
