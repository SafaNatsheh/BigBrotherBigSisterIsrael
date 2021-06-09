import * as React from "react";
import "./MatchQuestion.css";
import {Component, useState} from 'react';

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
            checkBox: false

        };
    }

    render() {
        return (
            <div className="questions">

                <div >
                    <label htmlFor="inputState">1. האם את מעדיפה לחנוך אח צעיר או אחות צעירה?</label>
                    <select
                        required id="inputState"
                        //className="form-control"
                        value={this.state.firQues}
                        onChange={(e) => this.setState({ firQues: e.target.value })}>
                        <option id="ff" disabled value="">בחר תשובה</option>
                        <option>זכר</option>
                        <option>נקבה</option>
                        <option>ללא העדפה</option>

                    </select>
                </div>
                <br/>
                <div >
                    <label htmlFor="inputState">2. האם יש לך העדפה לגיל האח/ות הצעיר/ה?</label>
                    <select
                        required id="inputState"
                        value={this.state.secQues}
                        onChange={(e) => this.setState({ secQues: e.target.value })}>
                        <option id="ff" disabled value="">בחר תשובה</option>
                        <option>6 - 12</option>
                        <option>12 - 18</option>
                        <option>מעל 18</option>
                        <option>ללא העדפה</option>


                    </select>
                </div>
                <br/>
                <div >
                    <label htmlFor="inputState">3. מהם התחביבים והיכולות שלך, אותם היית שמח להביא לידי ביטוי בקשר עם האח/ות הצעיר/ה?</label>
                    <select
                        required id="inputState"
                        value={this.state.thiQues}
                        onChange={(e) => this.setState({ thiQues: e.target.value })}>
                        <option id="ff" disabled value="">בחר תשובה</option>
                        <option>ספורט</option>
                        <option>מוסיקה ונגינה</option>
                        <option>בעלי חיים</option>
                        <option>שופינג</option>
                        <option>ציור ופיסול</option>
                        <option>צילום ועריכה</option>
                        <option>טכנולוגיה, משחקי וידיאו ומיחשוב</option>
                        <option>טיולים</option>
                        {/*<option type="input">אחר</option>*/}

                    </select>
                </div>
                <br/>
                <div >
                    <label htmlFor="inputState">4. אנא ציינ/י אם יש לך העדפה מסויימת לאח/ות צעיר/ה מהתוכנית הבאות:</label>
                    <select
                        required id="inputState"
                        value={this.state.forQues}
                        onChange={(e) => this.setState({ forQues: e.target.value })}>
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
                <br/>
                <div >
                    <label htmlFor="inputState">5. האם יש כלי רכב בבעלותך / נגיש לשימושך?</label>
                    <select
                        required id="inputState"
                        value={this.state.fifQues}
                        onChange={(e) => this.setState({ fifQues: e.target.value })}>
                        <option id="ff" disabled value="">בחר תשובה</option>
                        <option>כן, רכב</option>
                        <option>כן, אופנוע</option>
                        <option>לא</option>

                    </select>
                </div>
                <br/>
                <div >
                    <label htmlFor="inputState">6. האם יש לך העדפה גאוגכרפית בעירך / יישובך למיקום החונכות? אם כן, אנא ציינ/י איזו</label>
                    <select
                        required id="inputState"
                        value={this.state.sixQues}
                        onChange={(e) => this.setState({ sixQues: e.target.value })}>
                        <option id="ff" disabled value="">בחר תשובה</option>
                        <option>צפון העיר / יישוב</option>
                        <option>מזרח העיר / יישוב</option>
                        <option>מערב העיר / יישוב</option>
                        <option>דרום העיר / יישוב</option>
                        <option>מרכז העיר / יישוב</option>
                        <option>ללא העדפה</option>

                    </select>
                </div>
                <br/>
                <div >
                    <label htmlFor="inputState">7. אנא ציינ/י את השפות המדוברות שלך:</label>
                    <select
                        required id="inputState"
                        value={this.state.sevQues}
                        onChange={(e) => this.setState({ sevQues: e.target.value })}>
                        <option id="ff" disabled value="">בחר תשובה</option>
                        <option>עברית</option>
                        <option>ערבית</option>
                        <option>אנגלית</option>
                        <option>אמהרית</option>
                        <option>רוסית</option>
                        <option>צרפתית</option>
                    </select>
                </div>
                <br/>
                <div >
                    <label htmlFor="inputState">8. באילו ימים החונכות אפשרית לך: </label>
                    <select
                        required id="inputState"
                        value={this.state.eigQues}
                        onChange={(e) => this.setState({ eigQues: e.target.value })}>
                        <option id="ff" disabled value="">בחר תשובה</option>
                        <option>ראשון</option>
                        <option>שני</option>
                        <option>שלישי</option>
                        <option>רביעי</option>
                        <option>חמישי</option>
                        <option>שישי</option>
                        <option>ללא העדפה</option>

                    </select>
                </div>
                <br/>
                <div >
                    <label htmlFor="inputState">9. באילו שעות החונכות אפשרית לך:</label>
                    <select
                        required id="inputState"
                        value={this.state.ninQues}
                        onChange={(e) => this.setState({ ninQues: e.target.value })}>
                        <option id="ff" disabled value="">בחר תשובה</option>
                        <option>שעות בוקר(לגילאי 18+)</option>
                        <option>שעות הצוהרים</option>
                        <option>שעות אחר הצוהרים</option>
                        <option>שעות הערב</option>
                        <option>ללא העדפה</option>

                    </select>
                </div>
                <br/>
                <div >
                    <input type="checkbox" className="people_check"/>
                   <h6 style={{display:"inline"}}>אני מצהיר על שמירת שפה נאותה, חינוכית ונכונה. יש לשמור על לבוש הולם. לרשות העמותה להקליט, לבקר ולדגום שיחות</h6>
                </div>

            </div>


        );
    }

}

export default matchQuestion;