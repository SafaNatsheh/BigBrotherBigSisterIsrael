import * as React from "react";
import "./MatchQuestionstud.css";
import {Component} from 'react';
import logo from '../static_pictures/big_brothers_big_sisters.png'
import firebase from "../config/Firebase";

class matchQuestionstud extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firQues: "",
            secQues: "",
            thiQues: "",
            forQues: "",
            fifQues: "",
            sixQues: "",
            sevQues: "",
            eigQues: "",
            ninQues: "-1/",
            tenQues: "",
            elevQues: "",
            twlvQues: "",
            thrtQues: "",
            fName: "",
            sName: "",
            numID: "",
            address: "",
            country: "",
            year: "",
            school: "",
            grade: "",
            problem: "",
            birthDate: "",
            religion1: "",
            religion2: "",
            MName: "",
            MID: "",
            numphon: "",
            work1: "",
            DName: "",
            DID: "",
            numphon2: "",
            work2: "",
            stat: "",
            leve: "",
            numBro: "",

        };
        this.uid = firebase.auth().currentUser.uid;

    }

    componentDidMount() {


        if (this.props.refwin.data().gender === "זכר") {
            this.setState({firQues: "1/" , secQues: "1/"})
        }
        else {
            this.setState({firQues: "0/" , secQues: "0/"})
        }
        firebase.firestore().collection('Users').doc(this.uid).collection("Answers").doc("Answers")
            .get()
            .then((doc) => {
                this.setState({firQues : doc.data().firQues});
                this.setState({secQues : doc.data().secQues});
                this.setState({thiQues : doc.data().thiQues});
                this.setState({forQues : doc.data().forQues});
                this.setState({fifQues : doc.data().fifQues});
                this.setState({sixQues : doc.data().sixQues});
                this.setState({sevQues : doc.data().sevQues});
                this.setState({eigQues : doc.data().eigQues});
                this.setState({ninQues : doc.data().ninQues});
                this.setState({tenQues : doc.data().tenQues});
                this.setState({elevQues : doc.data().elevQues});
                this.setState({twlvQues : doc.data().twlvQues});
                this.setState({thrtQues : doc.data().thrtQues});
                this.setState({fName: doc.data().fName});
                this.setState({sName: doc.data().sName});
                this.setState({numID: doc.data().numID});
                this.setState({address: doc.data().address});
                this.setState({country: doc.data().country});
                this.setState({year: doc.data().year});
                this.setState({school: doc.data().school});
                this.setState({grade: doc.data().grade});
                this.setState({problem: doc.data().problem});
                this.setState({birthDate: doc.data().birthDate});
                this.setState({religion1: doc.data().religion1});
                this.setState({religion2: doc.data().religion2});
                this.setState({MName: doc.data().MName});
                this.setState({MID: doc.data().MID});
                this.setState({numphon: doc.data().numphon});
                this.setState({work1: doc.data().work1});
                this.setState({DName: doc.data().DName});
                this.setState({DID: doc.data().DID});
                this.setState({numphon2: doc.data().numphon2});
                this.setState({work2: doc.data().work2});
                this.setState({stat: doc.data().stat});
                this.setState({leve: doc.data().leve});
                this.setState({numBro: doc.data().numBro});



            })
            .catch((e) => console.log(e.name));

    }


    submit = (event) => {
        event.preventDefault();
        if (document.getElementById("myCheck").checked === true) {
            var all = this.state.firQues + this.state.secQues + this.state.thiQues + this.state.forQues + this.state.fifQues + this.state.sixQues + this.state.sevQues + this.state.eigQues + this.state.ninQues + this.state.tenQues + this.state.elevQues + this.state.twlvQues + this.state.thrtQues;
            this.props.refwin.ref.update({first: all})
            this.props.complt();
            firebase.firestore().collection('Users').doc(this.uid).collection("Answers").doc("Answers").set(
                {
                    firQues: this.state.firQues,
                    secQues: this.state.secQues,
                    thiQues: this.state.thiQues,
                    forQues: this.state.forQues,
                    fifQues: this.state.fifQues,
                    sixQues: this.state.sixQues,
                    sevQues: this.state.sevQues,
                    eigQues: this.state.eigQues,
                    ninQues: this.state.ninQues,
                    tenQues: this.state.tenQues,
                    elevQues: this.state.elevQues,
                    twlvQues: this.state.twlvQues,
                    thrtQues: this.state.thrtQues,
                    fName: this.state.fName,
                    sName: this.state.sName,
                    numID: this.state.numID,
                    address: this.state.address,
                    country: this.state.country,
                    year: this.state.year,
                    school: this.state.school,
                    grade: this.state.grade,
                    problem: this.state.problem,
                    birthDate: this.state.birthDate,
                    religion1: this.state.religion1,
                    religion2: this.state.religion2,
                    MName: this.state.MName,
                    MID: this.state.MID,
                    numphon: this.state.numphon,
                    work1: this.state.work1,
                    DName: this.state.DName,
                    DID: this.state.DID,
                    numphon2: this.state.numphon2,
                    work2: this.state.work2,
                    stat: this.state.stat,
                    leve: this.state.leve,
                    numBro: this.state.numBro



                })
        }
        else {
            alert("");
        }
    }

    render() {
        return (
            <form className="q" onSubmit={this.submit}>
            <div className="ques">
                <img src={logo} alt="asfsa" className="logo"/>
                <h2>ברוכים הבאים לשאלון ההתאמה</h2>
                <br/>
                <div className="form-row">
                <div  className="form-group col-md-3">

                    <label htmlFor="inputState"> <h6>1. סניף</h6></label>
                    <select
                        required id="inputState"
                        className="form-control"
                        value={this.state.thiQues}
                        onChange={(e) => this.setState({ thiQues: e.target.value })}>
                        <option id="ff" disabled value="">בחר תשובה</option>
                        <option value="1/">עכו</option>
                        <option value="2/">כרמיאל</option>
                        <option value="3/">הרצליה</option>
                        <option value="4/">רעננה</option>
                        <option value="5/">כפר יונה</option>
                        <option value="6/">כפר סבא</option>
                        <option value="7/">תל אביב</option>
                        <option value="8/">בת ים</option>
                        <option value="9/">חולון</option>
                        <option value="10/">אור יהודה</option>
                        <option value="11/">ירושלים</option>
                        <option value="12/">אשדוד</option>
                        <option value="13/">דימונה</option>
                        <option value="14/">שדרות</option>
                        <option value="15/">באר שבע</option>
                        <option value="16/">אחר</option>
                    </select>
                </div>
                <div  className="form-group col-md-3">
                        <label htmlFor="inputState"><h6>2. אזור בעיר</h6></label>
                        <select
                            required id="inputState"
                            className="form-control"
                            value={this.state.forQues}
                            onChange={(e) => this.setState({ forQues: e.target.value })}>
                            <option id="ff" disabled value="">בחר תשובה</option>
                            <option value="1/">צפון העיר</option>
                            <option value="2/">מזרח העיר</option>
                            <option value="3/">דרום העיר</option>
                            <option value="4/">מערב העיר</option>
                            <option value="5/">מרכז העיר</option>
                            <option value="6/">ללא העדפה</option>
                        </select>
                </div>
                <div className="form-group col-md-3">
                        <label htmlFor="inputState"><h6>3.שפת האם</h6></label>
                        <select
                            required id="inputState"
                            className="form-control"
                            value={this.state.fifQues}
                            onChange={(e) => this.setState({ fifQues: e.target.value })}>
                            <option id="ff" disabled value="">בחר תשובה</option>
                            <option value="1/">עברית</option>
                            <option value="2/">ערבית</option>
                            <option value="3/">אנגלית</option>
                            <option value="4/">אמהרית</option>
                            <option value="5/">רוסית</option>
                            <option value="6/">צרפתית</option>
                        </select>
                    </div>
                <div className="form-group col-md-3">
                        <label htmlFor="inputState"><h6>4.תחומי עניין</h6></label>
                        <select
                            required id="inputState"
                            className="form-control"
                            value={this.state.sixQues}
                            onChange={(e) => this.setState({ sixQues: e.target.value })}>
                            <option id="ff" disabled value="">בחר תשובה</option>
                            <option value="1/">ספורט וריקוד</option>
                            <option value="2/">מוסיקה ונגינה</option>
                            <option value="3/">בעלי חיים</option>
                            <option value="4/">שופינג</option>
                            <option value="5/">ציור ופיסול</option>
                            <option value="6/">צילום ועריכה</option>
                            <option value="7/">טכנולוגיה, משחקי וידיאו ומיחשוב</option>
                            <option value="8/">טיולים</option>
                            <option value="9/">אחר</option>
                        </select>
                </div>
                </div>
                <br/>
                <div className="form-row row_R2">
                <div className="form-group col-md-4">
                    <label htmlFor="inputState"><h6>5. מצב רגשי</h6></label>

                    <select
                        required id="inputState"
                        className="form-control"
                        value={this.state.tenQues}
                        onChange={(e) => this.setState({ tenQues: e.target.value })}>
                        <option id="ff" disabled value="">בחר תשובה</option>
                        <option value="1/">יציב </option>
                        <option value="2/">מאתגר</option>
                    </select>
                </div>
                <div className="form-group col-md-4">
                        <label htmlFor="inputState"><h6>6. מצב לימודי</h6></label>
                            <select
                                required id="inputState"
                                className="form-control"
                                value={this.state.elevQues}
                                onChange={(e) => this.setState({ elevQues: e.target.value })}>
                                <option id="ff" disabled value="">בחר תשובה</option>
                                <option value="2/">גבוה</option>
                                <option value="2/">בינוני</option>
                                <option value="3/">נמוך</option>
                            </select>
                </div>
                <div  className="form-group col-md-4">
                        <label htmlFor="inputState"><h6>7. בעל/ת מוגבלות פיזית</h6></label>
                        <select
                            required id="inputState"
                            className="form-control"
                            value={this.state.twlvQues}
                            onChange={(e) => this.setState({ twlvQues: e.target.value })}>
                            <option id="ff" disabled value="">בחר תשובה</option>
                            <option value="1/">כן</option>
                            <option value="2/">לא</option>

                        </select>
                </div>

                </div>
                <br/>
                <div className="form-row row_R2">
                <div className="form-group col-md-4">
                        <label htmlFor="inputState"><h6>8. באילו ימים החונכות אפשרית לך?</h6></label>
                        <select
                            required id="inputState"
                            className="form-control"
                            value={this.state.sevQues}
                            onChange={(e) => this.setState({ sevQues: e.target.value })}>
                            <option id="ff" disabled value="">בחר תשובה</option>
                            <option value="1/">ראשון</option>
                            <option value="2/">שני</option>
                            <option value="3/">שלישי</option>
                            <option value="4/">רביעי</option>
                            <option value="5/">חמישי</option>
                            <option value="6/">שישי</option>
                            <option value="7/">ללא העדפה</option>
                        </select>
                    </div>
                <div className="form-group col-md-4">
                    <label htmlFor="inputState"><h6>9. באילו שעות החונכות אפשרית לך?</h6></label>
                    <select
                        required id="inputState"
                        className="form-control"
                        value={this.state.eigQues}
                        onChange={(e) => this.setState({ eigQues: e.target.value })}>
                        <option id="ff" disabled value="">בחר תשובה</option>
                        <option value="1/"> שעות הבוקר (לגילאי 18+)</option>
                        <option value="2/">שעות הצהרים</option>
                        <option value="3/">שעות אחר הצהרים</option>
                        <option value="4/">שעות הערב</option>
                        <option value="5/">ללא העדפה</option>
                    </select>
                </div>
                <div className="form-group col-md-4">
                        <label htmlFor="inputState"><h6>10. האם נמצא על הרצף האוטיסטי</h6></label>
                        <select
                            required id="inputState"
                            className="form-control"
                            value={this.state.thrtQues}
                            onChange={(e) => this.setState({ thrtQues: e.target.value })}>
                            <option id="ff" disabled value="">בחר תשובה</option>
                            <option value="1/">כן</option>
                            <option value="2/">לא</option>
                        </select>
                </div>
                </div>
                <br/>


                <h2>שאלות נוספות</h2>
                <br/>
                <div className="form-row">
                    <div className="form-group col-md-3">
                        <label htmlFor="inputFirstName"><h6>שם פרטי</h6></label>
                        <input
                            required
                            type="text"
                            className="form-control"
                            id="inputFirstName"
                            value={this.state.fName}
                            placeholder="שם פרטי"
                            title="שם פרטי"
                            onChange={(e) => this.setState({ fName: e.target.value })}
                        />
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="inputFirstName"><h6>שם משפחה</h6></label>
                        <input
                            required
                            type="text"
                            className="form-control"
                            id="inputFirstName"
                            value={this.state.sName}
                            placeholder="שם משפחה"
                            title="שם משפחה"
                            onChange={(e) => this.setState({ sName: e.target.value })}
                        />
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="inputFirstName"><h6>ת.ז ילד/ה</h6></label>
                        <input
                            required
                            type="number"
                            className="form-control"
                            id="inputFirstName"
                            value={this.state.numID}
                            placeholder="ת.ז"
                            title="ת.ז"
                            onChange={(e) => this.setState({ numID: e.target.value })}
                        />
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="inputFirstName"><h6>כתובת ילד/ה</h6></label>
                        <input
                            required
                            type="text"
                            className="form-control"
                            id="inputFirstName"
                            value={this.state.address}
                            placeholder="כתובת ילד/ה"
                            title="כתובת ילד/ה"
                            onChange={(e) => this.setState({ address: e.target.value })}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-3">
                        <label htmlFor="inputFirstName"><h6>ארץ לידה</h6></label>
                        <input
                            required
                            type="text"
                            className="form-control"
                            id="inputFirstName"
                            value={this.state.country}
                            placeholder="ארץ לידה"
                            title="ארץ לידה"
                            onChange={(e) => this.setState({ country: e.target.value })}
                        />
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="inputFirstName"><h6>שנת עלייה</h6></label>
                        <input
                            required
                            type="number"
                            className="form-control"
                            id="inputFirstName"
                            value={this.state.year}
                            placeholder="שנת עלייה"
                            title="שנת עלייה"
                            onChange={(e) => this.setState({ year: e.target.value })}
                        />
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="inputFirstName"><h6>שם בית הספר</h6></label>
                        <input
                            type="text"
                            className="form-control"
                            id="inputFirstName"
                            value={this.state.school}
                            placeholder="שם בית הספר"
                            title="שם בית הספר"
                            onChange={(e) => this.setState({ school: e.target.value })}
                        />
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="inputFirstName"><h6>כיתה</h6></label>
                        <input
                            type="text"
                            className="form-control"
                            id="inputFirstName"
                            value={this.state.grade}
                            placeholder="כיתה"
                            title="כיתה"
                            onChange={(e) => this.setState({ grade: e.target.value })}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group col-md-3">
                        <label htmlFor="inputFirstName"><h6>בעל/ת בעיות בריאות</h6></label>
                        <select
                            required id="inputState"
                            className="form-control"
                            value={this.state.problem}
                            onChange={(e) => this.setState({ problem: e.target.value })}>
                            <option id="ff" disabled value="">בחר תשובה</option>
                            <option value="1\">כן</option>
                            <option value="2\">לא</option>

                        </select>
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="inputCity"><h6>תאריך לידה</h6></label>
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
                    <div className="form-group col-md-3">
                        <label htmlFor="inputFirstName"><h6>דת</h6></label>
                        <select
                            required id="inputState"
                            className="form-control"
                            value={this.state.religion1}
                            onChange={(e) => this.setState({ religion1: e.target.value })}>
                            <option id="ff" disabled value="">בחר תשובה</option>
                            <option value="1\">יהודי/ה</option>
                            <option value="2\">מוסלמי/ת</option>
                            <option value="3\">נוצרי/ת</option>
                            <option value="4\">אחר</option>
                        </select>
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="inputFirstName"><h6>זיקה לדת</h6></label>
                        <select
                            required id="inputState"
                            className="form-control"
                            value={this.state.religion2}
                            onChange={(e) => this.setState({ religion2: e.target.value })}>
                            <option id="ff" disabled value="">בחר תשובה</option>
                            <option value="1\">חילוני/ה</option>
                            <option value="2\">דתי/ה</option>
                            <option value="3\">מסורתי/ה</option>
                            <option value="4\" >אחר</option>


                        </select>
                    </div>

                    </div>

              <br/>
              <h5 className="right">פרטי הורה/ים:</h5>
                <br/>
                <div className="form-row">
                    <div className="form-group col-md-3">
                        <label htmlFor="inputFirstName"><h6>שם האם</h6></label>
                        <input
                            required
                            type="text"
                            className="form-control"
                            id="inputFirstName"
                            value={this.state.MName}
                            placeholder="שם האם"
                            title="שם האם"
                            onChange={(e) => this.setState({ MName: e.target.value })}
                        />
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="inputFirstName"><h6>ת.ז</h6></label>
                        <input
                            required
                            type="number"
                            className="form-control"
                            id="inputFirstName"
                            value={this.state.MID}
                            placeholder="ת.ז"
                            title="ת.ז"
                            onChange={(e) => this.setState({ MID: e.target.value })}
                        />
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="inputFirstName"><h6>טלפון סלולרי</h6></label>
                        <input
                            required
                            type="number"
                            className="form-control"
                            id="inputFirstName"
                            value={this.state.numphon}
                            placeholder="טלפון סלולרי"
                            title="טלפון סלולרי"
                            onChange={(e) => this.setState({ numphon: e.target.value })}
                        />
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="inputFirstName"><h6>עיסוק</h6></label>
                        <input
                            required
                            type="text"
                            className="form-control"
                            id="inputFirstName"
                            value={this.state.work1}
                            placeholder="עיסוק"
                            title="עיסוק"
                            onChange={(e) => this.setState({ work1: e.target.value })}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-3">
                        <label htmlFor="inputFirstName"><h6>שם האב</h6></label>
                        <input
                            required
                            type="text"
                            className="form-control"
                            id="inputFirstName"
                            value={this.state.DName}
                            placeholder="שם האב"
                            title="שם האב"
                            onChange={(e) => this.setState({ DName: e.target.value })}
                        />
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="inputFirstName"><h6>ת.ז</h6></label>
                        <input
                            required
                            type="number"
                            className="form-control"
                            id="inputFirstName"
                            value={this.state.DID}
                            placeholder="ת.ז"
                            title="ת.ז"
                            onChange={(e) => this.setState({ DID: e.target.value })}
                        />
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="inputFirstName"><h6>טלפון סלולרי</h6></label>
                        <input
                            required
                            type="number"
                            className="form-control"
                            id="inputFirstName"
                            value={this.state.numphon2}
                            placeholder="טלפון סלולרי"
                            title="טלפון סלולרי"
                            onChange={(e) => this.setState({ numphon2: e.target.value })}
                        />
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="inputFirstName"><h6>עיסוק</h6></label>
                        <input
                            required
                            type="text"
                            className="form-control"
                            id="inputFirstName"
                            value={this.state.work2}
                            placeholder="עיסוק"
                            title="עיסוק"
                            onChange={(e) => this.setState({ work2: e.target.value })}
                        />
                    </div>
                </div>
                <br/>
                <h5 className="right">מידע על המשפחה:</h5>
                <br/>

                <div className="form-row">
                    <div className="form-group col-md-3">
                        <label htmlFor="inputFirstName"><h6>סטטוס הורים</h6></label>
                        <input
                            required
                            type="text"
                            className="form-control"
                            id="inputFirstName"
                            value={this.state.stat}
                            placeholder="סטטוס הורים"
                            title="סטטוס הורים"
                            onChange={(e) => this.setState({ stat: e.target.value })}
                        />
                    </div>
                    <div className="form-group col-md-3">
                            <label htmlFor="inputFirstName"><h6>רמת הכנסה של המשפחה</h6></label>
                            <select
                                required id="inputState"
                                className="form-control"
                                value={this.state.leve}
                                onChange={(e) => this.setState({ leve: e.target.value })}>
                                <option id="ff" disabled value="">בחר תשובה</option>
                                <option value="1\">מתחת לקו העוני</option>
                                <option value="2\">ברמת קו העוני</option>
                                <option value="3\">מעל קו העוני</option>
                            </select>
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="inputFirstName"><h6>מספר ילדים במשפחה</h6></label>
                        <input
                            required
                            type="number"
                            className="form-control"
                            id="inputFirstName"
                            value={this.state.numBro}
                            placeholder="מספר ילדים במשפחה"
                            title="מספר ילדים במשפחה"
                            onChange={(e) => this.setState({ numBro: e.target.value })}
                        />
                    </div>
                </div>


                <div>
                    <input type="checkbox" id="myCheck" className='check' required />
                    <h6 style={{display:"inline"}}>אני מצהיר על שמירת שפה נאותה, חינוכית ונכונה. יש לשמור על לבוש הולם. לרשות העמותה להקליט, לבקר ולדגום שיחות.</h6>
                </div>

                <button type="submit" className="btn btn-success add-new-user-btn bot1">
                    שלח
                </button>




            </div>

            </form>

        );
    }

}

export default matchQuestionstud;