import React, { Component } from 'react';
import { connect } from 'react-redux';
import Popup from "reactjs-popup";
//import DatePicker from 'react-date-picker';
import { EditProfile } from '../store/actions/index';
import history from '../history';
import * as account from './../lib/account.js';

class ProfileFollow extends Component {
    constructor(props) {
        super(props)
        this.state = { open: false, date: props.auth.birthday };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onChange = this.onChange.bind(this);
        this.linkClick = this.linkClick.bind(this);
    }
    openModal() {
        this.setState({ open: true });
    }
    closeModal() {
        this.setState({ open: false });
    }
    onChange(date) {
        this.setState({ date: date });
    }
    linkClick(id, s) {
        history.push("/" + id + "/" + s);
    }
    submitPicture() {
        console.log(document.getElementById("myPicture").value);
    }

    render() {
        let auth = this.props.auth;
        let value = this.props.value;
        let id = this.props.id;
        let inputName;
        let isUser = account.checkLogged().publicKey() === auth.publicKey;
        return (
            <div className="profile-canopy">
                <div className="profile-canopy-inner">
                    <div className="profile-canopy-navbar">
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-3 col-md-3 col-lg-3">

                                </div>
                                <div className="col-sm-6 col-md-6 col-lg-6 profile-nav">
                                    <ul className="profile-nav-list">
                                        <li className={value === "tweets" ? "profile-nav-item active" : "profile-nav-item"}>
                                            <a href="#link" onClick={(e) => {
                                                e.preventDefault();
                                                this.linkClick(id, "tweets");
                                            }}>
                                                <span className="profile-nav-label">Tweets</span>
                                                <span className="profile-nav-value">{auth.tweets ? auth.tweets.length : 0}</span>
                                            </a>
                                        </li>
                                        <li className={value === "following" ? "profile-nav-item active" : "profile-nav-item"}>
                                            <a href="#link" onClick={(e) => {
                                                e.preventDefault();
                                                this.linkClick(id, "following");
                                            }}>
                                                <span className="profile-nav-label">Following</span>
                                                <span className="profile-nav-value">{this.props.following ? this.props.following.length : 0}</span>
                                            </a>
                                        </li>
                                        <li className={value === "followers" ? "profile-nav-item active" : "profile-nav-item"}>
                                            <a href="#link" onClick={(e) => {
                                                e.preventDefault();
                                                this.linkClick(id, "followers");
                                            }}>
                                                <span className="profile-nav-label">Followers</span>
                                                <span className="profile-nav-value">{this.props.followers ? this.props.followers.length : 0}</span>
                                            </a>
                                        </li>
                                        <li className={value === "lists" ? "profile-nav-item active" : "profile-nav-item"}>
                                            <a href="#link" onClick={(e) => {
                                                e.preventDefault();
                                                this.linkClick(id, "lists");
                                            }}>
                                                <span className="profile-nav-label">Lists</span>
                                                <span className="profile-nav-value">0</span>
                                            </a>
                                        </li>
                                        <li className={value === "moments" ? "profile-nav-item active" : "profile-nav-item"}>
                                            <a href="#link" onClick={(e) => {
                                                e.preventDefault();
                                                this.linkClick(id, "moments");
                                            }}>
                                                <span className="profile-nav-label">Moments</span>
                                                <span className="profile-nav-value">0</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-sm-3 col-md-3 col-lg-3 profile-nav-btn">
                                    {
                                        isUser ?
                                            <div>

                                                <button className="btn btn-edit-profile" onClick={this.openModal}>
                                                    Edit profile
                                        </button>
                                                <Popup
                                                    position="left center"
                                                    modal={true}
                                                    open={this.state.open}
                                                    onClose={this.closeModal}>
                                                    <div className="modal-edit-profile">
                                                        <h3 className="modal-header-text">
                                                            Edit your profile
                                                        </h3>
                                                        <div className="form-group modal-form-item">
                                                            <label htmlFor="usr">Name:</label>
                                                            <input className="form-control" type="text" ref={node => inputName = node} defaultValue={this.props.auth.name} />
                                                        </div>

                                                        <form onSubmit={this.submitPicture}>
                                                            <input type="file" name="myPicture" id="myPicture" />
                                                            <input type="submit" />
                                                        </form>
                                                        <div className="modal-form-btn-group">
                                                            <button className="btn btn-default" onClick={this.closeModal}>Cancel</button>
                                                            <button className="btn btn-primary" onClick={(e) => {
                                                                if (!inputName.value.trim()) {
                                                                    return;
                                                                }
                                                                let profile = {
                                                                    name: inputName.value
                                                                };
                                                                this.props.editProfile(profile);
                                                                this.closeModal();
                                                            }
                                                            }>Save change</button>
                                                        </div>
                                                    </div>
                                                </Popup>
                                            </div>
                                            : null
                                    }
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
        auth: state.auth,
        followers: state.followers.users,
        following: state.following.users
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        editProfile: (profile) => dispatch(EditProfile(profile))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileFollow)