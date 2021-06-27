import * as React from "react";
import "./MatchQuestion.css";
import {Component} from 'react';
import logo from "../static_pictures/big_brothers_big_sisters.png";
import firebase from "../config/Firebase";

class matchQuestion extends Component {

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
            ninQues: "",
            tenQues: "",
            elevQues: "",
            twlvQues: "",
            thrtQues: "",
            fName: "",
            sName:"",
            machine:"",
            numPhone1: "",
            numPhone2: "",
            email: "",
            area: "",
            address: "",
            info1: "",
            info2: "",
            info3: "",
            info4: "",
            info5: "",
            info6: "",
            info7: "",
            info8: "",
            info9: "",
            info10: "",
            info11: "",
            info12: "",
            info13: "",
            info14: "",
            info15: "",
            info16: "",
            info17: "",
            info18: "",
            info19: "",

            gend:""


        };
        this.uid = firebase.auth().currentUser.uid;
    }

    componentDidMount() {


        if (this.props.refwin.data().gender === "זכר") {
            this.setState({firQues: "1/" , secQues: "1/"})
        }
        else {
            this.setState({firQues: "0/"})
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
                this.setState({machine: doc.data().machine});
                this.setState({numPhone1: doc.data().numPhone1});
                this.setState({numPhone2: doc.data().numPhone2});
                this.setState({email: doc.data().email});
                this.setState({area: doc.data().area});
                this.setState({address: doc.data().address});
                this.setState({info1: doc.data().info1});
                this.setState({info2: doc.data().info2});
                this.setState({info3: doc.data().info3});
                this.setState({info4: doc.data().info4});
                this.setState({info5: doc.data().info5});
                this.setState({info6: doc.data().info6});
                this.setState({info7: doc.data().info7});
                this.setState({info8: doc.data().info8});
                this.setState({info9: doc.data().info9});
                this.setState({info10: doc.data().info10});
                this.setState({info11: doc.data().info11});
                this.setState({info12: doc.data().info12});
                this.setState({info13: doc.data().info13});
                this.setState({info14: doc.data().info14});
                this.setState({info15: doc.data().info15});
                this.setState({info16: doc.data().info16});
                this.setState({info17: doc.data().info17});
                this.setState({info18: doc.data().info18});
                this.setState({info19: doc.data().info19});
                this.setState({gend: doc.data().gend});
            })
            .catch((e) => console.log(e.name));

        console.log(document.getElementById("age"))

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
                    machine: this.state.machine,
                    numPhone1: this.state.numPhone1,
                    numPhone2:  this.state.numPhone2,
                    email: this.state.email,
                    area: this.state.area,
                    address: this.state.address,
                    info1: this.state.info1,
                    info2: this.state.info2,
                    info3: this.state.info3,
                    info4: this.state.info4,
                    info5: this.state.info5,
                    info6: this.state.info6,
                    info7: this.state.info7,
                    info8: this.state.info8,
                    info9: this.state.info9,
                    info10: this.state.info10,
                    info11: this.state.info11,
                    info12: this.state.info12,
                    info13: this.state.info13,
                    info14: this.state.info14,
                    info15: this.state.info15,
                    info16: this.state.info16,
                    info17: this.state.info17,
                    info18: this.state.info18,
                    info19: this.state.info19,

                    gend: this.state.gend



                })

        }
        else {
            alert("");
        }
    }

    render() {
        return (
            <form className="q" onSubmit={this.submit}>
                <div className="questions">
                    <img src={logo} alt="asfsa" className="logo"/>
                    <h2>ברוכים הבאים לשאלון ההתאמה ושאלון ההיכרות</h2>
                    <br/>

                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputState"><h6>האם יש לך העדפה גאוגכרפית בעירך/יישובך למיקום החונכות? אם כן, אנא ציינ/י איזו</h6></label>
                            <select
                                required id="inputState"
                                className="form-control"
                                value={this.state.forQues}
                                onChange={(e) => this.setState({ forQues: e.target.value })}>
                                <option id="ff" disabled value="">בחר תשובה</option>
                                <option value="1/">צפון העיר / יישוב</option>
                                <option value="2/">מזרח העיר / יישוב</option>
                                <option value="3/">דרום העיר / יישוב</option>
                                <option value="4/">מערב העיר / יישוב</option>
                                <option value="5/">מרכז העיר / יישוב</option>
                                <option value="6/">ללא העדפה</option>
                            </select>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="inputState"><h6>מהם התחביבים והיכולות שלך, אותם היית שמח להביא לידי ביטוי בקשר עם האח/ות הצעיר/ה?</h6> </label>
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
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputState"><h6>אנא ציינ/י את שפת האם שלך</h6></label>
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
                        <div className="form-group col-md-6">

                            <label htmlFor="inputState"><h6>סניף</h6></label>
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

                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputState"><h6>אנא ציינ/י אם יש לך העדפה מסויימת לאח/ות צעיר/ה מהתוכנית הבאות:</h6></label>
                            <select
                                required id="inputState"
                                className="form-control"
                                onChange={(e) => {
                                    if (e.target.value === "1/") {
                                        this.setState({tenQues:"1/" , elevQues: "2/" , twlvQues: "1/", thrtQues: "2/"})
                                    }
                                    else if (e.target.value === "2/") {
                                        this.setState({tenQues:"1/" , elevQues: "2/" , twlvQues: "2/" ,thrtQues: "1/"})
                                    }
                                    else if (e.target.value === "3/") {
                                        document.getElementById("age").value = "3/";
                                        this.setState({ninQues: "3/" , tenQues:"1/" , elevQues: "2/" , twlvQues: "2/" , thrtQues: "2/"})
                                    }
                                    else if (e.target.value === "4/") {
                                        this.setState({tenQues:"2/" , elevQues: "2/" , twlvQues: "2/" ,thrtQues: "2/"})
                                    }
                                    else if (e.target.value === "5/") {
                                        this.setState({tenQues:"1/" , elevQues: "3/" , twlvQues: "2/" ,thrtQues: "2/"})
                                    }
                                    else if (e.target.value === "6/") {
                                        this.setState({tenQues:"1/" , elevQues: "2/" , twlvQues: "2/" ,thrtQues: "2/"})
                                    }
                                }
                                }>
                                <option id="ff" disabled value="">בחר תשובה</option>
                                <option value="1/">אח.ות צעיר.ה עם מוגבלות פיזית</option>
                                <option value="2/">אח.ות צעיר.ה על הרצף בתפקוד גבוה</option>
                                <option value="3/">אח.ות צעיר.ה חסרי תעסוקה והשכלה (18+)</option>
                                <option value="4/">אח.ות צעיר.ה עם קשיים רגשיים</option>
                                <option value="5/">אח.ות צעיר.ה עם קשיים לימודיים</option>
                                <option value="6/">ללא העדפה</option>
                            </select>
                        </div>
                        <div className="form-group col-md-6">
                            <br/>
                            <label htmlFor="inputState"><h6> האם יש כלי רכב בבעלותך/נגיש לשימושך?</h6></label>
                            <select
                                required id="inputState"
                                className="form-control"
                                value={this.state.machine}
                                onChange={(e) => this.setState({ machine: e.target.value })}>
                                <option id="ff" disabled value="">בחר תשובה</option>
                                <option value="1/">כן, רכב</option>
                                <option value="2/">כן, אופנוע</option>
                                <option value="3/">לא</option>

                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputState"><h6>האם יש לך העדפה לגיל האח/ות הצעיר/ה?</h6> </label>
                            <select id="age"
                                required
                                className="form-control"
                                value={this.state.ninQues}
                                onChange={(e) => this.setState({ ninQues: e.target.value })}>
                                <option id="ff" disabled value="">בחר תשובה</option>
                                <option value="1/">6 - 12</option>
                                <option value="2/">12 - 18</option>
                                <option value="3/">מעל 18</option>
                                <option value="4/">ללא העדפה</option>
                            </select>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="inputState"><h6> באילו ימים החונכות אפשרית לך</h6></label>
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
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6" >
                            <label htmlFor="inputState"> <h6>באילו שעות החונכות אפשרית לך</h6></label>
                            <select
                                required id="inputState"
                                className="form-control"
                                value={this.state.eigQues}
                                onChange={(e) => {
                                    if (e.target.value === "1/") {
                                        document.getElementById("age").value = "3/";
                                        this.setState({eigQues: e.target.value , ninQues: "3/"})
                                    }
                                    else {
                                        this.setState({eigQues: e.target.value})
                                    }
                                }}>
                                <option id="ff" disabled value="">בחר תשובה</option>
                                <option value="1/"> שעות הבוקר (לגילאי 18+)</option>
                                <option value="2/">שעות הצהרים</option>
                                <option value="3/">שעות אחר הצהרים</option>
                                <option value="4/">שעות הערב</option>
                                <option value="5/">ללא העדפה</option>
                            </select>
                        </div>
                        { (this.state.firQues === "0/")&&(<div className="form-group col-md-6" >
                            <label htmlFor="inputState"><h6>האם את מעדיפה לחנוך אח צעיר או אחות צעירה?</h6> </label>
                            <select
                                required id="inputState"
                                className="form-control"
                                value={this.state.secQues}
                                onChange={(e) => this.setState({ secQues: e.target.value })}>
                                <option id="ff" disabled value="">בחר תשובה</option>
                                <option value="1/">זכר</option>
                                <option value="2/">נקבה</option>
                                <option value="3/">ללא העדפה</option>
                            </select>
                        </div>)

                        }

                    </div>

                    <br/>
                    <h2>שאלון ההיכרות</h2>
                    <br/>
                    <div className="form-row">
                        <div className="form-group col-md-3">
                            <label htmlFor="inputFirstName"><h6>שם פרטי</h6></label>
                            <input
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
                            <label htmlFor="inputFirstName"><h6>טלפון נייד</h6></label>
                            <input
                                type="number"
                                className="form-control"
                                id="inputFirstName"
                                value={this.state.numPhone1}
                                placeholder="טלפון נייד"
                                title="טלפון נייד"
                                onChange={(e) => this.setState({ numPhone1: e.target.value })}
                            />
                        </div>
                        <div className="form-group col-md-3">
                            <label htmlFor="inputFirstName"><h6>טלפון נוסף</h6></label>
                            <input
                                type="number"
                                className="form-control"
                                id="inputFirstName"
                                value={this.state.numPhone2}
                                placeholder="טלפון נוסף"
                                title="טלפון נוסף"
                                onChange={(e) => this.setState({ numPhone2: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputFirstName"><h6>דואר אלקטרוני</h6></label>
                            <input
                                type="text"
                                className="form-control"
                                id="inputFirstName"
                                value={this.state.email}
                                placeholder="דואר אלקטרוני"
                                title="דואר אלקטרוני"
                                onChange={(e) => this.setState({ email: e.target.value })}
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="inputFirstName"><h6>עיר מגורים</h6></label>
                            <input
                                type="text"
                                className="form-control"
                                id="inputFirstName"
                                value={this.state.area}
                                placeholder="עיר מגורים"
                                title="עיר מגורים"
                                onChange={(e) => this.setState({ area: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputFirstName"><h6>כתובת</h6></label>
                            <input
                                type="text"
                                className="form-control"
                                id="inputFirstName"
                                value={this.state.address}
                                placeholder="כתובת"
                                title="כתובת"
                                onChange={(e) => this.setState({ address: e.target.value })}
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="inputState"><h6>אנא סמנ/י אם עשית שירות צבאי/לאומי.</h6></label>
                            <select
                                className="form-control"
                                value={this.state.info1}
                                onChange={(e) => this.setState({ info1: e.target.value })}>
                                <option id="ff" disabled value="">בחר תשובה</option>
                                <option value="1\">שירות צבאי מלא</option>
                                <option value="2\">שירות צבאי חלקי</option>
                                <option value="3\">שירות לאומי</option>
                                <option value="4\">פטור משירות</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputFirstName"><h6>מה עיסוקך</h6> </label>
                            <input
                                type="text"
                                className="form-control"
                                id="inputFirstName"
                                value={this.state.info2}
                                placeholder="מה עיסוקך"
                                title="מה עיסוקך"
                                onChange={(e) => this.setState({ info2: e.target.value })}
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="inputFirstName"><h6>במידה שאינך עובד/ת כיום ציינ/י סיבה.</h6></label>
                            <input
                                type="text"
                                className="form-control"
                                id="inputFirstName"
                                value={this.state.info3}
                                placeholder="במידה שאינך עובד/ת כיום ציינ/י סיבה."
                                title="במידה שאינך עובד/ת כיום ציינ/י סיבה"
                                onChange={(e) => this.setState({ info3: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputState"><h6>אנא ציינ/י איזו סוג(י) השכלה ברשותך.</h6></label>
                            <select
                                className="form-control"
                                value={this.state.info4}
                                onChange={(e) => this.setState({ info4: e.target.value })}>
                                <option id="ff" disabled value="">בחר תשובה</option>
                                <option value="1\">תיכונית</option>
                                <option value="2\">תעודה</option>
                                <option value="3\"> תואר ראשון</option>
                                <option value="4\"> תואר שני ומעלה</option>
                            </select>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="inputState"><h6>האם הינך מלגאי?</h6></label>
                            <select
                                className="form-control"
                                value={this.state.info5}
                                onChange={(e) => this.setState({ info5: e.target.value })}>
                                <option id="ff" disabled value="">בחר תשובה</option>
                                <option value="1\">כן</option>
                                <option value="2\">לא</option>

                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="inputFirstName"><h6> שם הקרן/מלגה:</h6></label>
                            <input
                                type="text"
                                className="form-control"
                                id="inputFirstName"
                                value={this.state.info6}
                                placeholder="שם הקרן/מלגה"
                                title="שם הקרן/מלגה"
                                onChange={(e) => this.setState({ info6: e.target.value })}
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="inputFirstName"><h6>מוסד אקדמאי:</h6></label>
                            <input
                                type="text"
                                className="form-control"
                                id="inputFirstName"
                                value={this.state.info7}
                                placeholder="מוסד אקדמאי"
                                title="מוסד אקדמאי"
                                onChange={(e) => this.setState({ info7: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <label htmlFor="inputFirstName"><h6>האם הינך בעל.ת ניסיון בעבודה עם ילדים ונוער? אם כן, פרט/י</h6></label>
                            <input
                                type="text"
                                className="form-control"
                                id="inputFirstName"
                                value={this.state.info8}
                                placeholder=" "
                                title=" "
                                onChange={(e) => this.setState({ info8: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <label htmlFor="inputFirstName"><h6>מדוע ברצונך להתנדב?</h6></label>
                            <input
                                type="text"
                                className="form-control"
                                id="inputFirstName"
                                value={this.state.info9}
                                placeholder=""
                                title=""
                                onChange={(e) => this.setState({ info9: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <label htmlFor="inputFirstName"><h6>במה לדעתך, תוכל/י לתרום לאח/ות הצעיר/ה שלך?</h6></label>
                            <input
                                type="text"
                                className="form-control"
                                id="inputFirstName"
                                value={this.state.info10}
                                placeholder=""
                                title=""
                                onChange={(e) => this.setState({ info10: e.target.value })}
                            />
                        </div>
                    </div>

                    <h6 className="right">ציינ/י 3 שמות של ממליצים שאינם בני משפחה או חברים.</h6>
                    <h6 className="right">אנא דאג.י לקבל את הסכמת הממליצים לפנייתנו.</h6>
                    <h6 className="right">ממליץ 1:</h6>
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label htmlFor="inputFirstName"></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="inputFirstName"
                                    value={this.state.info11}
                                    placeholder="שם מלא"
                                    onChange={(e) => this.setState({ info11: e.target.value })}
                                />
                            </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="inputFirstName"></label>
                            <br/>
                            <input
                                type="text"
                                className="form-control"
                                id="inputFirstName"
                                value={this.state.info12}
                                placeholder="קשר אליך "
                                onChange={(e) => this.setState({ info12: e.target.value })}
                            />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="inputFirstName"></label>
                            <input
                                type="text"
                                className="form-control"
                                id="inputFirstName"
                                value={this.state.info13}
                                placeholder="פרטי התקשורת"
                                onChange={(e) => this.setState({ info13: e.target.value })}
                            />
                        </div>
                    </div>
                    <h6 className="right">ממליץ 2:</h6>
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label htmlFor="inputFirstName"></label>
                            <input
                                type="text"
                                className="form-control"
                                id="inputFirstName"
                                value={this.state.info14}
                                placeholder="שם מלא"
                                onChange={(e) => this.setState({ info14: e.target.value })}
                            />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="inputFirstName"></label>
                            <br/>
                            <input
                                type="text"
                                className="form-control"
                                id="inputFirstName"
                                value={this.state.info15}
                                placeholder="קשר אליך "
                                onChange={(e) => this.setState({ info15: e.target.value })}
                            />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="inputFirstName"></label>
                            <input
                                type="text"
                                className="form-control"
                                id="inputFirstName"
                                value={this.state.info16}
                                placeholder="פרטי התקשורת"
                                onChange={(e) => this.setState({ info16: e.target.value })}
                            />
                        </div>
                    </div>
                    <h6 className="right">ממליץ 3:</h6>
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label htmlFor="inputFirstName"></label>
                            <input
                                type="text"
                                className="form-control"
                                id="inputFirstName"
                                value={this.state.info17}
                                placeholder="שם מלא"
                                onChange={(e) => this.setState({ info17: e.target.value })}
                            />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="inputFirstName"></label>
                            <br/>
                            <input
                                type="text"
                                className="form-control"
                                id="inputFirstName"
                                value={this.state.info18}
                                placeholder="קשר אליך "
                                onChange={(e) => this.setState({ info18: e.target.value })}
                            />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="inputFirstName"></label>
                            <input
                                type="text"
                                className="form-control"
                                id="inputFirstName"
                                value={this.state.info19}
                                placeholder="פרטי התקשורת"
                                onChange={(e) => this.setState({ info19: e.target.value })}
                            />
                        </div>
                    </div>
                    <br/>
                    <div >
                        <input type="checkbox" id="myCheck" className="check" required/>
                        <h6 style={{display:"inline"}}>אני מצהיר על שמירת שפה נאותה, חינוכית ונכונה. יש לשמור על לבוש הולם. לרשות העמותה להקליט, לבקר ולדגום שיחות</h6>
                    </div>

                    <button type="submit" className="btn btn-success add-new-user-btn bot1">
                        שלח
                    </button>


                </div>
            </form>

        );
    }

}

export default matchQuestion;