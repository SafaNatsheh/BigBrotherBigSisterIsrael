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

			<div className="main-background" >
				{/*<form className="report-form" onSubmit={this.handleSubmit}>*/}
				<br />
				<div className="form-group">
					<h1 className="report-title"><u>הצג דוח פגישות </u></h1>

					<input type="text"
						   placeholder="חיפוש לפי מס' תעודת זהות "
						   value={this.state.searchTerm}
						   onChange={(e) => this.setState({ searchTerm: e.target.value })}
						   style={{ marginRight: "225px",width: "50%" ,display:"block" }}/>


					<label
						className="fLabels"
						style={{ float: "right" }}
						htmlFor="date"
					>
						בחר טווח תארכים  מתאריך:
					</label>
					<input
						onChange={(e) => {
							let t=new Date(e.target.value)
							console.log(t)
							this.setState({searchTerm:"56789876", fromDate: new Date(e.target.value) })}}
						type="date"
						className="form-control"
						id="fromDate"
						placeholder="מתאריך"
						//value={this.state.fromDate}
						required
					/>
					<label
						className="fLabels"
						style={{ float: "right" }}
						htmlFor="date"
					>
						:עד תאריך
					</label>
					<input
						onChange={(e) => this.setState({ toDate:new Date(e.target.value) })}
						type="date"
						className="form-control"
						id="toDate"
						placeholder="עד תאריך"
						//	value={this.state.toDate}
						required
					/>


					<button
						className="btn btn-success setup-meeting-btn"
						style={{ float: "right", marginRight: "700px" }}
						onClick={()=>{
							this.handleSubmit()}}
					>
						הצג דוח שעות
					</button>
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
			<div>
				<table className="table table-bordered">

					<thead>
					<tr>
						<th>תאריך</th>
						<th>זמן התחלה </th>
						<th>זמן סיום </th>
						<th>זמן נסיעה </th>
						<th>תיאור פגישה </th>
						<th>אורך פגישה כולל זמן נסיעה </th>
					</tr>
					</thead>

					<tbody>

					{ this.renderTable()}
					</tbody>
					<tfoot>
					<tr>
						<td>
							ס"ה שעות
						</td>
						<td>
							{
								this.state.meetingsArr.length >0 ?
									this.calculateTotalTime():""
							}
						</td>
					</tr>
					</tfoot>
				</table>



				<div className="button">
					<br />
					<button
						className="button-de"
						style={{ float: "right", marginRight: "780px" ,marginTop:"0px", color:"#dc3545"  }}
						onClick={this.handleSubmit}
					>
						<div className="button-text">
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

					<tr key={index}>
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
