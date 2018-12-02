import React, { Component } from 'react';
import { connect } from 'react-redux';
import Popup from "reactjs-popup";

class ProfileFollow extends Component {
    constructor(props) {
        super(props);
    }

    handleChange(event) {
        
      }

    render() {
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
                                        <li className={this.props.activeId == 0 ? "profile-nav-item active" : "profile-nav-item"}>
                                            <a href="/">
                                                <span className="profile-nav-label">Tweets</span>
                                                <span className="profile-nav-value">1</span>
                                            </a>
                                        </li>
                                        <li className={this.props.activeId == 1 ? "profile-nav-item active" : "profile-nav-item"}>
                                            <a href="/following">
                                                <span className="profile-nav-label">Following</span>
                                                <span className="profile-nav-value">3</span>
                                            </a>
                                        </li>
                                        <li className={this.props.activeId == 2 ? "profile-nav-item active" : "profile-nav-item"}>
                                            <a href="/followers">
                                                <span className="profile-nav-label">Followers</span>
                                                <span className="profile-nav-value">2</span>
                                            </a>
                                        </li>
                                        <li className="profile-nav-item">
                                            <a href="/">
                                                <span className="profile-nav-label">Lists</span>
                                                <span className="profile-nav-value">0</span>
                                            </a>
                                        </li>
                                        <li className="profile-nav-item">
                                            <a href="/">
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
        auth: state.auth
    }
};

const mapDispatchToProps = (dispatch) => {
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileFollow)