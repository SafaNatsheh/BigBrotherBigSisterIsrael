import * as React from "react";
import "./MatchQuestionstud.css";
import {Component, useState} from 'react';
import logo from '../static_pictures/big_brothers_big_sisters.png'

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
            ninQues: ""

        };
    }

    submit = (event) => {
        event.preventDefault();
        if (document.getElementById("myCheck").checked === true) {
            var all = this.state.firQues + this.state.secQues + this.state.thiQues + this.state.forQues + this.state.fifQues + this.state.sixQues + this.state.sevQues + this.state.eigQues + this.state.ninQues;
            this.props.refwin.ref.update({first: all})
            this.props.complt();
        }
    }

    render() {
        return (
            <form className="q" onSubmit={this.submit}>
            <div className="questions">
                <img src={logo} alt="asfsa" className="logo"/>
                <h2>ברוכים הבאים לשאלון ההתאמה</h2>
                <br/>
                <div className="form-row">
                <div  className="form-group col-md-3">

                    <label htmlFor="inputState"> <h6>1. סניף</h6></label>
                    <select
                        required id="inputState"
                        className="form-control"
                        value={this.state.firQues}
                        onChange={(e) => this.setState({ firQues: e.target.value })}>
                        <option id="ff" disabled value="">בחר תשובה</option>
                        <option value="1\">עכו</option>
                        <option value="2\">כרמיאל</option>
                        <option value="3\">הרצליה</option>
                        <option value="4\">רעננה</option>
                        <option value="5\">כפר יונה</option>
                        <option value="6\">כפר סבא</option>
                        <option value="7\">תל אביב</option>
                        <option value="8\">בת ים</option>
                        <option value="9\">חולון</option>
                        <option value="10\">אור יהודה</option>
                        <option value="11\">ירושלים</option>
                        <option value="12\">אשדוד</option>
                        <option value="13\">דימונה</option>
                        <option value="14\">שדרות</option>
                        <option value="15\">באר שבע</option>
                        <option value="16\">אחר</option>
                    </select>
                </div>
                <div  className="form-group col-md-3">
                        <label htmlFor="inputState"><h6>2. אזור בעיר</h6></label>
                        <select
                            required id="inputState"
                            className="form-control"
                            value={this.state.secQues}
                            onChange={(e) => this.setState({ secQues: e.target.value })}>
                            <option id="ff" disabled value="">בחר תשובה</option>
                            <option value="1\">צפון העיר</option>
                            <option value="2\">מזרח העיר</option>
                            <option value="3\">דרום העיר</option>
                            <option value="4\">מערב העיר</option>
                        </select>
                </div>
                <div className="form-group col-md-3">
                        <label htmlFor="inputState"><h6>3.שפות מדוברות</h6></label>
                        <select
                            required id="inputState"
                            className="form-control"
                            value={this.state.thiQues}
                            onChange={(e) => this.setState({ thiQues: e.target.value })}>
                            <option id="ff" disabled value="">בחר תשובה</option>
                            <option value="1\">עברית</option>
                            <option value="2\">ערבית</option>
                            <option value="3\">אנגלית</option>
                            <option value="4\">אמהרית</option>
                            <option value="5\">רוסית</option>
                            <option value="6\">צרפתית</option>
                        </select>
                    </div>
                <div className="form-group col-md-3">
                        <label htmlFor="inputState"><h6>4.תחומי עניין</h6></label>
                        <select
                            required id="inputState"
                            className="form-control"
                            value={this.state.forQues}
                            onChange={(e) => this.setState({ forQues: e.target.value })}>
                            <option id="ff" disabled value="">בחר תשובה</option>
                            <option value="1\">ספורט וריקוד</option>
                            <option value="2\">מוסיקה ונגינה</option>
                            <option value="3\">בעלי חיים</option>
                            <option value="4\">שופינג</option>
                            <option value="5\">ציור ופיסול</option>
                            <option value="6\">צילום ועריכה</option>
                            <option value="7\">טכנולוגיה, משחקי וידיאו ומיחשוב</option>
                            <option value="8\">טיולים</option>
                            <option value="9\">אחר</option>
                        </select>
                </div>
                </div>
                <br/>
                <div className="form-row row_R2">
                <div className="form-group col-md-3">
                    <label htmlFor="inputState"><h6>5. מצב רגשי</h6></label>
                    <select
                        required id="inputState"
                        className="form-control"
                        value={this.state.fifQues}
                        onChange={(e) => this.setState({ fifQues: e.target.value })}>
                        <option id="ff" disabled value="">בחר תשובה</option>
                        <option value="1\">יציב </option>
                        <option value="2\">מאתגר</option>
                    </select>
                </div>
                <div className="form-group col-md-3">
                        <label htmlFor="inputState"><h6>6. מצב לימודי</h6></label>
                            <select
                                required id="inputState"
                                className="form-control"
                                value={this.state.sixQues}
                                onChange={(e) => this.setState({ sixQues: e.target.value })}>
                                <option id="ff" disabled value="">בחר תשובה</option>
                                <option value="1\">גבוה</option>
                                <option value="2\">בינוני</option>
                                <option value="3\">נמוך</option>
                            </select>
                </div>
                <div  className="form-group col-md-3">
                        <label htmlFor="inputState"><h6>7. בעל/ת לקויות למידה</h6></label>
                        <select
                            required id="inputState"
                            className="form-control"
                            value={this.state.sevQues}
                            onChange={(e) => this.setState({ sevQues: e.target.value })}>
                            <option id="ff" disabled value="">בחר תשובה</option>
                            <option value="1\">כן</option>
                            <option value="2\">לא</option>

                        </select>
                </div>

                </div>
                <br/>
                <div className="form-row row_R3">
                <div className="form-group col-md-6">
                    <label htmlFor="inputState"><h6>8. באילו ימים החונכות אפשרית לך?</h6></label>
                    <select
                        required id="inputState"
                        className="form-control"
                        value={this.state.eigQues}
                        onChange={(e) => this.setState({ eigQues: e.target.value })}>
                        <option id="ff" disabled value="">בחר תשובה</option>
                        <option value="1\">ראשון</option>
                        <option value="2\">שני</option>
                        <option value="3\">שלישי</option>
                        <option value="4\">רביעי</option>
                        <option value="5\">חמישי</option>
                        <option value="6\">שישי</option>
                        <option value="7\">ללא העדפה</option>
                    </select>
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="inputState"><h6>9. באילו שעות החונכות אפשרית לך?</h6></label>
                    <select
                        required id="inputState"
                        className="form-control"
                        value={this.state.ninQues}
                        onChange={(e) => this.setState({ ninQues: e.target.value })}>
                        <option id="ff" disabled value="">בחר תשובה</option>
                        <option value="1\"> שעות הבוקר (לגילאי 18+)</option>
                        <option value="2\">שעות הצהרים</option>
                        <option value="3\">שעות אחר הצהרים</option>
                        <option value="4\">שעות הערב</option>
                        <option value="5\">ללא העדפה</option>
                    </select>
                </div>
                </div>
                <br/>
                <div>
                    <input type="checkbox" id="myCheck" className='check' />
                    <h6 style={{display:"inline"}}>אני מצהיר על שמירת שפה נאותה, חינוכית ונכונה. יש לשמור על לבוש הולם. לרשות העמותה להקליט, לבקר ולדגום שיחות.</h6>
                </div>

                <button type="submit" className="btn btn-success add-new-user-btn bot">
                    שלח
                </button>
            </div>

            </form>

        );
    }

}

export default matchQuestionstud;