import React, { Component } from 'react';
import { connect } from 'react-redux';
import Popup from "reactjs-popup";
import DatePicker from 'react-date-picker';
import { EditProfile } from '../store/actions/index';
import history from '../history';

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

    render() {
        let auth = this.props.auth;
        let value = this.props.value;
        let id = this.props.id;
        let inputName;
        let inputBio;
        let inputLocation;
        let inputWebsite;
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
                                                <span className="profile-nav-value">{this.props.following ? this.props.following : 0}</span>
                                            </a>
                                        </li>
                                        <li className={value === "followers" ? "profile-nav-item active" : "profile-nav-item"}>
                                            <a href="#link" onClick={(e) => {
                                                e.preventDefault();
                                                this.linkClick(id, "followers");
                                                }}>
                                                <span className="profile-nav-label">Followers</span>
                                                <span className="profile-nav-value">{this.props.followers ? this.props.followers : 0}</span>
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
                                        auth.publicKey === id ?
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
                                                        <div className="form-group modal-form-item">
                                                            <span className="modal-user-id">@{this.props.auth.id}</span>
                                                        </div>
                                                        <div className="form-group modal-form-item">
                                                            <label htmlFor="usr">Birthday:</label>
                                                            <DatePicker
                                                                onChange={this.onChange}
                                                                value={this.state.date}
                                                            />
                                                        </div>
                                                        <div className="form-group modal-form-item">
                                                            <label htmlFor="usr">Bio:</label>
                                                            <input className="form-control" type="text" ref={node => inputBio = node} defaultValue={this.props.auth.bio} />
                                                        </div>
                                                        <div className="form-group modal-form-item">
                                                            <label htmlFor="usr">Location:</label>
                                                            <input className="form-control" type="text" ref={node => inputLocation = node} defaultValue={this.props.auth.location} />
                                                        </div>
                                                        <div className="form-group modal-form-item">
                                                            <label htmlFor="usr">Website:</label>
                                                            <input className="form-control" type="text" ref={node => inputWebsite = node} defaultValue={this.props.auth.website} />
                                                        </div>
                                                        <div className="modal-form-btn-group">
                                                            <button className="btn btn-default" onClick={this.closeModal}>Cancel</button>
                                                            <button className="btn btn-primary" onClick={(e) => {
                                                                if (!inputName.value.trim()) {
                                                                    return;
                                                                }
                                                                let profile = {
                                                                    name: inputName.value,
                                                                    bio: inputBio.value,
                                                                    location: inputLocation.value,
                                                                    website: inputWebsite.value,
                                                                    birthday: this.state.date
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
        followers: state.followers.users.length,
        following: state.following.users.length
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        editProfile: (profile) => dispatch(EditProfile(profile))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileFollow)