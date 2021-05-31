import * as React from "react";
import "./Profile.css";
import logo from '../../../static_pictures/no_profile_picture.png'

export class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  formatDate = (date) => {
    if (isNaN(date)) {
      return null;
    }
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  }

  render() {
    return (
      <div className="profile-main">
        <div className="profile-top">
          <div className="profile-name">{this.props.userDetails.fName + " " + this.props.userDetails.lName}</div>
          <img src={this.props.profilePic} alt="" className="profile-picture" style={{ backgroundImage: `url(${logo})` }} />
        </div>
        <div className="profile-footer">
          <div className="profile-type-m-s">{this.props.userDetails.type}</div>
          <div className="profile-city">{this.props.userDetails.area}</div>
          <div className="profile-birthday">{this.formatDate(new Date(this.props.userDetails.birthDate))}</div>
        </div>
      </div>
    );
  }
}

export default Profile;