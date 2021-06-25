import React, {Component} from "react";
import firebase from "../config/Firebase"

class ReportTable extends Component {
	constructor(props) {
		super(props);
		this.state = {

			fromDate:Date.now(),
			toDate:"",
			// date:"",
			// StartTime: "",
			// EndTime: "",
			// TraverTime: "",
			// description: "",
			sumOfHours:0,
			sumOfMinutes:0,
			searchTerm: "",
			isClicked:false
		}

		this.MeetingsListRef =firebase.firestore().collection('MeetingsList');
		console.log(this.MeetingsListRef)
	}

	componentDidMount() {
		if(window.location.href.split("ReportTable/")[1] !== undefined)
		{
			this.setState({ searchTerm: window.location.href.split("ReportTable/")[1] })
		}
		console.log("in1")
		console.log(this.MeetingsListRef)
		//get all the meetings and put them on an array

		// const newArr = this.state.meetingsArr.
		// 	filter(meeting =>( meeting.userId.indexOf(this.state.searchTerm)>-1) &&(meeting.date>=this.state.fromDate)&&(meeting.date<=this.state.toDate));


	}

	// componentDidMount() {
	// 	//get all the meetings and put them on an array
	// 	this.MeetingsListRef.orderByChild("date").where("userId", "==", this.state.searchTerm)
	// 		.get()
	// 		.then(queryShot => {
	// 			queryShot.forEach(
	// 				(doc) => {
	// 					this.setState({  meetingsArr: [...this.state.meetingsArr, doc.data()] })
	// 				}
	// 			)
	// 		})
	// 		.catch((e) => console.log(e.name));
	//
	// }

	// search()
	// {
	// 	console.log("in")
	// 	 this.MeetingsListRef
	// 	.where("test",">",1)
	// 	this.MeetingsListRef.where("userId","==",this.state.searchTerm)
	//
	// 		.get()
	// 		.then((res)=>{
	// 			console.log(res)
	// 		res.forEach(data=>{
	// 			console.log(data.data())
	// 		})
	// 			// console.log(res.docs[0].data().date >= this.state.fromDate)
	//
	// 		})
	//
	// }


	async handleSubmit() {

		//this.search()
		var arrayMeeting=[]
		console.log(this.MeetingsListRef)
		var queryShot = await this.MeetingsListRef
			.where("userId","==",this.state.searchTerm)
			.where("date",">=",this.state.fromDate)
			.where("date", "<=",this.state.toDate)
			.get()
		if(queryShot ) {
			console.log(queryShot)
			queryShot.forEach(
				(doc) => {
					arrayMeeting.push(doc.data())
					// this.setState({meetingsArr: [...this.state.meetingsArr, ]})
				}
			)

		}
		console.log(arrayMeeting)
		this.setState({meetingsArr:arrayMeeting})
		this.state.sumOfHours = 0
		this.state.sumOfMinutes = 0
	}

	render() {

		return (

			<div className="MAIN-background" >
				{/*<form className="report-form" onSubmit={this.handleSubmit}>*/}
				<br />
				<div className="forms-groups title-design">
					<h1><u className="title-design2">הצג דוח פגישות </u></h1>
					<div className="right-all-div">
					<label
						className="FLabels"
						style={{ float: "right" }}
						htmlFor="date"
					>
						חיפוש לפי מס' תעודת זהות
					<input type="text"
						   className="new-design-to-input form-control"
						   placeholder="תעודת זהות "
						   value={this.state.searchTerm}
						   onChange={(e) => this.setState({ searchTerm: e.target.value })}
						  />

					</label>
					<label
						className="FLabels "
						style={{ float: "right" }}
						htmlFor="date"
					>
						בחר טווח תארכים  מתאריך:

					<input
						onChange={(e) => {
							let t=new Date(e.target.value)
							console.log(t)
							this.setState({searchTerm:"56789876", fromDate: new Date(e.target.value) })}}
						type="date"
						className="new-design-to-input form-control"
						id="fromDate"
						placeholder="מתאריך"
						//value={this.state.fromDate}
						required
					/>
					</label>
					<label
						className="right-input3"
						style={{ float: "right" }}
						htmlFor="date"
					>
						עד תאריך:

					<input
						onChange={(e) => this.setState({ toDate:new Date(e.target.value) })}
						type="date"
						className="new-design-to-input form-control"
						id="toDate"
						placeholder="עד תאריך"
						//	value={this.state.toDate}
						required
					/>
				    </label>


					<button
						className="btn btn-success setup-meeting-btn"
						style={{ float: "right", marginRight: "1230px", marginTop:"-46px", width:"230px" }}
						onClick={()=>{
							this.handleSubmit()}}
					>
						הצג דוח שעות
					</button>
				</div>
				</div>
				{/*</form>*/}
				<div>
					{ this.state.meetingsArr
					// ?<div>load</div>:<div>empty</div>
					&&this.renderHeader()
					}
				</div>

			</div>

		)
	}

	renderHeader(){
		return(
			<div className="form-group">
			<div className="now-table">

				<table className="table table-bordered">
					<thead>
					<tr className="new-color">
						<th className="table-lay">תאריך</th>
						<th className="table-lay">זמן התחלה </th>
						<th className="table-lay">זמן סיום </th>
						<th className="table-lay">זמן נסיעה </th>
						<th className="table-lay">תיאור פגישה </th>
						<th className="table-lay">אורך פגישה כולל זמן נסיעה </th>
					</tr>
					</thead>

					<tbody>
					{ this.renderTable()}
					</tbody>
					<tfoot className="background-footer">
					<tr >
						<td>ס"ה שעות</td>
						<td>
							{
								this.state.meetingsArr.length >0 ?
									this.calculateTotalTime():""
							}
						</td>
					</tr>
					</tfoot>
				</table>

			</div>
		    <div className="Button-Print">
			<br />
			<button
				className="button-print"
				onClick={this.handleSubmit}
			>
				<div className="button-text-New">
					הדפס דוח שעות
				</div>
			</button>
		</div>
			</div>
		);
	}
	test(meeting)
	{
		var d= new Date(meeting.date.toDate().toString())
		var t = new Intl.DateTimeFormat('he-IL', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(d);
		t=t.toString().replaceAll(".","/")
		console.log(t)
		// this.setState({startTime:t})
		return t
	}


	renderTable() {
		let d = this.state.meetingsArr[0].date


		//
		// var f= t.format("dd.mm.yyyy hh:MM:ss")
		// var g= t.format("dd-mm-yyyy")
		// console.log(f)
		// console.log(g)

		return (
			this.state.meetingsArr
				.map((meeting,index) => (

					<tr className="new-color2" key={index}>
						<td>{this.test(meeting)}
						</td>
						<td>{meeting.startTime}</td>
						<td>{meeting.endTime}</td>
						<td>{meeting.travelTime}</td>
						<td>{meeting.description}</td>
						<td>{this.calculateMeetingDuration(meeting)}</td>

					</tr>
				)           ))
	}

	calculateMeetingDuration(meeting){

		let travelT
		travelT=Number(meeting.travelTime )*2

		const startHours = parseInt(meeting.startTime.substring(0,2) , 10 )
		const startMinutes =parseInt(meeting.startTime.substring(3,5) , 10 )
		const endHours = parseInt(meeting.endTime.substring(0,2) , 10 )
		const endMinutes = parseInt(meeting.endTime.substring(3,5) , 10 )
		const travelHours =travelT/60
		const travelMinutes =travelT%60
		let tempHours
		tempHours= endHours-startHours
		let tempMinutes
		if(endMinutes<startMinutes){
			tempMinutes = (endMinutes+60)-startMinutes
			tempHours-=1
		}else{
			tempMinutes = endMinutes-startMinutes
		}

		if((tempMinutes+travelMinutes)>=60){
			let totalMinutes
			totalMinutes	= (tempMinutes+travelMinutes)%60
			let totalHours
			totalHours=((tempMinutes+travelMinutes)/60)+(tempHours+travelHours)
		}
		let totalMinutes
		totalMinutes=tempMinutes+travelMinutes
		let totalHours
		totalHours	=tempHours+travelHours
		this.state.sumOfHours += totalHours
		this.state.sumOfMinutes += totalMinutes
		console.log(this.state.sumOfHours  )
		console.log(this.state.sumOfMinutes )

		return totalHours +" שעות ו- "+ totalMinutes+" דקות"
	}
	calculateTotalTime= () =>{
		let addHours
		addHours =parseInt((this.state.sumOfMinutes / 60),10)
		let addMinutes
		addMinutes	= parseInt((this.state.sumOfMinutes % 60),10)
		this.state.sumOfHours += addHours

		this.state.sumOfMinutes = addMinutes
		return this.state.sumOfHours +" שעות " + this.state.sumOfMinutes +" דקות "
	}

}
export default ReportTable;
