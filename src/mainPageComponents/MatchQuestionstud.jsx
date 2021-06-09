import * as React from "react";
import "./MatchQuestionstud.css";
import {Component, useState} from 'react';

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
            <form className="add-user-form" onSubmit={this.submit}>
            <div className="questions">
                <div >
                    <label htmlFor="inputState">1. סניף </label>
                    <select
                        required id="inputState"
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
                <br/>
                <div>
                        <label htmlFor="inputState">2. אזור בעיר:</label>
                        <select
                            required id="inputState"
                            value={this.state.secQues}
                            onChange={(e) => this.setState({ secQues: e.target.value })}>
                            <option id="ff" disabled value="">בחר תשובה</option>
                            <option value="1\">צפון העיר</option>
                            <option value="2\">מזרח העיר</option>
                            <option value="3\">דרום העיר</option>
                            <option value="4\">מערב העיר</option>
                        </select>
                </div>
                <br/>
                <div>
                    <label htmlFor="inputState">3. בעל.ת לקויות למידה:</label>
                    <select
                        required id="inputState"
                        value={this.state.thiQues}
                        onChange={(e) => this.setState({ thiQues: e.target.value })}>
                        <option id="ff" disabled value="">בחר תשובה</option>
                        <option value="1\">כן</option>
                        <option value="2\">לא</option>

                    </select>
                </div>
                <br/>
                <div>
                    <label htmlFor="inputState">4. מצב לימודי: </label>
                    <select
                        required id="inputState"
                        value={this.state.forQues}
                        onChange={(e) => this.setState({ forQues: e.target.value })}>
                        <option id="ff" disabled value="">בחר תשובה</option>
                        <option value="1\">גבוה</option>
                        <option value="2\">בינוני</option>
                        <option value="3\">נמוך</option>
                    </select>
                </div>
                <br/>
                <div>
                    <label htmlFor="inputState">5. מצב רגשי:</label>
                    <select
                        required id="inputState"
                        value={this.state.fifQues}
                        onChange={(e) => this.setState({ fifQues: e.target.value })}>
                        <option id="ff" disabled value="">בחר תשובה</option>
                        <option value="1\">יציב </option>
                        <option value="2\">מאתגר</option>
                    </select>
                </div>
                <br/>
                <div>
                    <label htmlFor="inputState">6.שפות מדוברות:</label>
                    <select
                        required id="inputState"
                        value={this.state.sixQues}
                        onChange={(e) => this.setState({ sixQues: e.target.value })}>
                        <option id="ff" disabled value="">בחר תשובה</option>
                        <option value="1\">עברית</option>
                        <option value="2\">ערבית</option>
                        <option value="3\">אנגלית</option>
                        <option value="4\">אמהרית</option>
                        <option value="5\">רוסית</option>
                        <option value="6\">צרפתית</option>
                    </select>
                </div>
                <br/>
                <div>
                    <label htmlFor="inputState">7.תחומי עניין:</label>
                    <select
                        required id="inputState"
                        value={this.state.sevQues}
                        onChange={(e) => this.setState({ sevQues: e.target.value })}>
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
                <br/>
                <div>
                    <label htmlFor="inputState">8. באילו ימים החונכות אפשרית לך:</label>
                    <select
                        required id="inputState"
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
                <br/>
                <div>
                    <label htmlFor="inputState">9. באילו שעות החונכות אפשרית לך:</label>
                    <select
                        required id="inputState"
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
                <br/>
                <div >
                    <input type="checkbox" id="myCheck" className="people_check" />
                   <h6 style={{display:"inline"}}>אני מצהיר על שמירת שפה נאותה, חינוכית ונכונה. יש לשמור על לבוש הולם. לרשות העמותה להקליט, לבקר ולדגום שיחות</h6>
                </div>

            </div>
                <button type="submit" className="btn btn-success add-new-user-btn">
                    שלח
                </button>
            </form>

        );
    }

}

export default matchQuestionstud;