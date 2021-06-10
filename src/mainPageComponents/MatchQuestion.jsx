import * as React from "react";
import "./MatchQuestion.css";
import {Component, useState} from 'react';
import logo from "../static_pictures/big_brothers_big_sisters.png";

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

        };
    }

    render() {
        return (
            <form className="q" onSubmit={this.submit}>
                <div className="questions">
                    <img src={logo} alt="asfsa" className="logo"/>
                    <h2>ברוכים הבאים לשאלון ההתאמה</h2>
                    <br/>
                    <div className="form-row">
                        <div className="form-group col-md-3">
                            <label htmlFor="inputState">1. סניף </label>
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
                        <div className="form-group col-md-3">
                            <label htmlFor="inputState">2. האם יש לך העדפה גאוגכרפית בעירך/יישובך למיקום החונכות? אם כן, אנא ציינ/י איזו</label>
                            <select
                                required id="inputState"
                                className="form-control"
                                value={this.state.secQues}
                                onChange={(e) => this.setState({ secQues: e.target.value })}>
                                <option id="ff" disabled value="">בחר תשובה</option>
                                <option value="1\">צפון העיר / יישוב</option>
                                <option value="2\">מזרח העיר / יישוב</option>
                                <option value="3\">דרום העיר / יישוב</option>
                                <option value="4\">מערב העיר / יישוב</option>
                                <option value="5\">מרכז העיר / יישוב</option>
                                <option value="6\">ללא העדפה</option>
                            </select>
                        </div>
                        <div className="form-group col-md-3">
                            <label htmlFor="inputState">3. אנא ציינ/י את השפות המדוברות שלך</label>
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
                            <label htmlFor="inputState">4. מהם התחביבים והיכולות שלך, אותם היית שמח להביא לידי ביטוי בקשר עם האח/ות הצעיר/ה?</label>
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
                    <div className="form-row">
                        <div className="form-group col-md-3">
                            <label htmlFor="inputState">5. אנא ציינ/י אם יש לך העדפה מסויימת לאח/ות צעיר/ה מהתוכנית הבאות:</label>
                            <select
                                required id="inputState"
                                className="form-control"
                                value={this.state.fifQues}
                                onChange={(e) => this.setState({ fifQues: e.target.value })}>
                                <option id="ff" disabled value="">בחר תשובה</option>
                                <option>אח.ות צעיר.ה עם מוגבלות פיזית</option>
                                <option>אח.ות צעיר.ה עם מוגבלות שכלית</option>
                                <option>אח.ות צעיר.ה על הרצף בתפקוד גבוה</option>
                                <option>אח.ות צעיר.ה שהינו.ה חלק ממשפחה עם ילד.ה על הרצף</option>
                                <option>אח.ות צעיר.ה חסרי תעסוקה והשכלה (18+)</option>
                                <option>אח.ות צעיר.ה עם קשיים רגשיים</option>
                                <option>אח.ות צעיר.ה עם קשיים לימודיים</option>
                                <option>אח.ות צעיר.ה חסרי עורף משפחתי</option>
                                <option>אח.ות צעיר.ה במצבי סיכון</option>
                                <option>ללא העדפה</option>
                            </select>
                        </div>
                        <div className="form-group col-md-3">
                            <label htmlFor="inputState">6. האם יש כלי רכב בבעלותך/נגיש לשימושך?</label>
                            <select
                                required id="inputState"
                                className="form-control"
                                value={this.state.sixQues}
                                onChange={(e) => this.setState({ sixQues: e.target.value })}>
                                <option id="ff" disabled value="">בחר תשובה</option>
                                <option>כן, רכב</option>
                                <option>כן, אופנוע</option>
                                <option>לא</option>

                            </select>
                        </div>
                        <div className="form-group col-md-3">
                            <label htmlFor="inputState">7. האם את מעדיפה לחנוך אח צעיר או אחות צעירה?</label>
                            <select
                                required id="inputState"
                                className="form-control"
                                value={this.state.sevQues}
                                onChange={(e) => this.setState({ sevQues: e.target.value })}>
                                <option id="ff" disabled value="">בחר תשובה</option>
                                <option>זכר</option>
                                <option>נקבה</option>
                                <option>ללא העדפה</option>
                            </select>
                        </div>
                    </div>
                    <br/>
                    <div className="form-row">
                        <div className="form-group col-md-3">
                            <label htmlFor="inputState">8. באילו ימים החונכות אפשרית לך </label>
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
                        <div className="form-group col-md-3" >
                            <label htmlFor="inputState">9. באילו שעות החונכות אפשרית לך</label>
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
                        <div className="form-group col-md-3" >
                            <label htmlFor="inputState">10. האם יש לך העדפה לגיל האח/ות הצעיר/ה?</label>
                            <select
                                required id="inputState"
                                className="form-control"
                                value={this.state.tenQues}
                                onChange={(e) => this.setState({ tenQues: e.target.value })}>
                                <option id="ff" disabled value="">בחר תשובה</option>
                                <option value="1\">6 - 12</option>
                                <option value="2\">12 - 18</option>
                                <option value="3\">מעל 18</option>
                                <option value="4\">ללא העדפה</option>
                            </select>
                        </div>
                    </div>
                    <br/>
                    <div >
                        <input type="checkbox" id="myCheck" className="people_check"/>
                        <h6 style={{display:"inline"}}>אני מצהיר על שמירת שפה נאותה, חינוכית ונכונה. יש לשמור על לבוש הולם. לרשות העמותה להקליט, לבקר ולדגום שיחות</h6>
                    </div>
                    <button type="submit" className="btn btn-success add-new-user-btn">
                        שלח
                    </button>
                </div>
            </form>

        );
    }

}

export default matchQuestion;