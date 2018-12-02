import React, { Component } from 'react';
import { connect } from 'react-redux';
import Popup from "reactjs-popup";

class ProfileFollow extends Component {
    handleChange(event) {
        
      }

    render() {
        //console.log(this.props);
        let auth = this.props.auth;
        let value = this.props.value;
        let input;
        return (
            <div className="profile-canopy">
                <div className="profile-canopy-inner">
                    <div className="profile-canopy-header">
                        <div className="profile-canopy-header-img">
                        <img src="https://pbs.twimg.com/profile_banners/1068876238993801216/1543684186/1500x500" alt="" />
                        </div>
                        <div className="container">
                            <div className="profile-canopy-avatar">
                                    <img src="https://pbs.twimg.com/profile_images/1068915193982271488/5-DfGVRD_400x400.jpg" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="profile-canopy-navbar">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-3 col-md-3 col-lg-3">
                                    
                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-6 profile-nav">
                                    <ul className="profile-nav-list">
                                        <li className={value === "" ? "profile-nav-item active" : "profile-nav-item"}>
                                            <a href="/">
                                                <span className="profile-nav-label">Tweets</span>
                                                <span className="profile-nav-value">{auth ? auth.tweets.length : 0}</span>
                                            </a>
                                        </li>
                                        <li className={value === "following" ? "profile-nav-item active" : "profile-nav-item"}>
                                            <a href={"/"+ auth.id +"/following"}>
                                                <span className="profile-nav-label">Following</span>
                                                <span className="profile-nav-value">{this.props.following ? this.props.following : 0}</span>
                                            </a>
                                        </li>
                                        <li className={value === "followers" ? "profile-nav-item active" : "profile-nav-item"}>
                                            <a href={"/"+ auth.id +"/followers"}>
                                                <span className="profile-nav-label">Followers</span>
                                                <span className="profile-nav-value">{this.props.followers ? this.props.followers : 0}</span>
                                            </a>
                                        </li>
                                        <li className={value === "lists" ? "profile-nav-item active" : "profile-nav-item"}>
                                            <a href={"/"+ auth.id +"/lists"}>
                                                <span className="profile-nav-label">Lists</span>
                                                <span className="profile-nav-value">0</span>
                                            </a>
                                        </li>
                                        <li className={value === "moments" ? "profile-nav-item active" : "profile-nav-item"}>
                                            <a href={"/"+ auth.id +"/moments"}>
                                                <span className="profile-nav-label">Moments</span>
                                                <span className="profile-nav-value">0</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-sm-3 col-md-3 col-lg-3 profile-nav-btn">
                                <Popup
                                    trigger={
                                        <button className="btn btn-edit-profile">
                                            Edit profile
                                        </button>
                                    } 
                                    position="left center"
                                    modal={true}>
                                    <div className="modal-edit-profile">
                                        <h3 className="modal-header-text">
                                            Edit your profile
                                        </h3>
                                        <div className="form-group modal-form-item">
                                            <label htmlFor="usr">Name:</label>
                                            <input className="form-control" type="text" ref={node => input = node} defaultValue={"Phuc"} />
                                        </div>
                                        <div className="modal-form-btn-group">
                                            <button className="btn btn-default">Cancel</button>
                                            <button className="btn btn-primary" onClick={(e)=>{
                                                if (!input.value.trim()) {
                                                    return;
                                                }
                                                alert(input.value);
                                            }
                                            }>Save change</button>
                                        </div>
                                    </div>
                                </Popup>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth.auth,
        followers: state.followers.users.length,
        following: state.following.users.length
    }
};

const mapDispatchToProps = (dispatch) => {
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileFollow)