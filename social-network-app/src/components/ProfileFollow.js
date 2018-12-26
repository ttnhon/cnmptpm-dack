import React, { Component } from 'react';
import { connect } from 'react-redux';
import Popup from "reactjs-popup";
//import DatePicker from 'react-date-picker';
import { EditProfile, Follow, GetFollowing } from '../store/actions/index';
import history from '../history';
import * as account from '../lib/account';
import { updateName, updatePicture } from './../lib/helper';

class ProfileFollow extends Component {
    constructor(props) {
        super(props)
        this.state = { open: false, error: undefined, succeed: undefined, isLoading: false };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onChange = this.onChange.bind(this);
        this.linkClick = this.linkClick.bind(this);
        this.submitPicture = this.submitPicture.bind(this);
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
    submitPicture(e) {
        e.preventDefault();
        let seq = this.props.auth.sequence;
        seq++;
        const secretKey = account.checkLogged().secret();

        const input = document.getElementById("myPicture");
        const file = input.files[0];
        if (file === undefined) {
            alert("Please select image");
            return;
        }
        const fr = new FileReader();
        //fr.onload = receivedText;
        //fr.readAsText(file);
        fr.onload = () => {
            this.setState({ isLoading: true, error: undefined, succeed: undefined });
            const str = fr.result; //Url cua cai file
            const binary = str.split(',')[1];
            updatePicture(secretKey, seq, binary).then(res => {
                //console.log(res);
                if (res.data.result.check_tx.log) {
                    this.setState({ error: res.data.result.check_tx.log, succeed: undefined });
                } else {
                    let profile = {
                        picture: binary,
                        sequence: seq
                    };
                    this.props.editProfile(profile);
                    this.setState({ error: undefined, succeed: "Change picture succeess" })
                }

                this.setState({ isLoading: false });
            });
        }
        fr.readAsDataURL(file);
        // console.log(fr);
        // const str = fr.result;
        // updatePicture(secretKey,seq,str.split(',')[1])
    }

    render() {
        let auth = this.props.auth;
        //console.log(auth);
        let value = this.props.value;
        let id = this.props.id;
        let inputName;
        let key = account.checkLogged().publicKey();
        let isUser = key === auth.publicKey;
        let isFollow = null;
        if (!isUser) {
            //console.log(auth.user);
            if (auth.user) {
                if (auth.user.followings) {
                    isFollow = auth.user.followings.indexOf(auth.publicKey) !== -1;
                } else {
                    isFollow = false;
                }
            }
        }
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
                                                if (auth) {
                                                    if (auth.following) {
                                                        if (auth.following.users) {
                                                            this.props.GetFollowing(key);
                                                        }
                                                    }
                                                }
                                                this.linkClick(id, "following");
                                            }}>
                                                <span className="profile-nav-label">Following</span>
                                                <span className="profile-nav-value">{auth.followings ? auth.followings.length : 0}</span>
                                            </a>
                                        </li>
                                        {/* <li className={value === "followers" ? "profile-nav-item active" : "profile-nav-item"}>
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
                                        </li> */}
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
                                                        <div className="form-group modal-form-item modal-flex">
                                                            <img className="modal-form-profile-img modal-flex-left clearfix" src={auth.picture ? auth.picture !== "Not Set" ? ('data:image/jpeg;base64,' + auth.picture) : "/default_profile_icon.png" : "/loading_circle.gif"} alt="" />
                                                            <form className="modal-form-input" action="#" onSubmit={this.submitPicture}>
                                                                <div className="modal-input">
                                                                    <label>Change your avatar: </label><input className=" btn" type="file" name="myPicture" id="myPicture" />
                                                                    <input type="submit" className="btn btn-primary" />
                                                                </div>
                                                            </form>
                                                        </div>

                                                        <div className="form-group modal-form-item">
                                                            <label htmlFor="usr">Name:</label>
                                                            <input className="form-control" type="text" ref={node => inputName = node} defaultValue={auth.name} id="txtName" />
                                                        </div>
                                                        {this.state.isLoading ? <div className="img-loading-wrapper"><img className="img-loading" src="/loading.gif" alt="" /></div> : null}
                                                        {this.state.error ? <div className="alert alert-danger fade in error-log">
                                                            <strong>{this.state.error ? this.state.error : null}</strong>
                                                        </div> : null}
                                                        {this.state.succeed ? <div className="alert alert-success fade in error-log">
                                                            <strong>{this.state.succeed ? this.state.succeed : null}</strong>
                                                        </div> : null}
                                                        <div className="modal-form-btn-group">
                                                            <button className="btn btn-default" onClick={this.closeModal}>Cancel</button>
                                                            <button className="btn btn-primary" onClick={(e) => {
                                                                if (!inputName.value.trim()) {
                                                                    return;
                                                                }
                                                                if(inputName.value === auth.name){
                                                                    return;
                                                                }
                                                                this.setState({ isLoading: true, error: undefined, succeed: undefined });
                                                                //console.log(inputName.value);

                                                                let seq = auth.sequence;
                                                                seq++;
                                                                const secretKey = account.checkLogged().secret();
                                                                let name = inputName.value;
                                                                updateName(secretKey, seq, name).then(res => {
                                                                    if (res) {
                                                                        if (res.data.result.check_tx.log) {
                                                                            this.setState({ error: res.data.result.check_tx.log, succeed: undefined })
                                                                            alert(res.data.result.check_tx.log);
                                                                        } else {
                                                                            let profile = {
                                                                                name: name,
                                                                                sequence: seq
                                                                            };
                                                                            this.props.editProfile(profile);
                                                                            this.setState({ error: undefined, succeed: "Change name succeess" })
                                                                        }
                                                                        //this.closeModal();
                                                                        this.setState({ isLoading: false });
                                                                    }
                                                                })
                                                            }
                                                            }>Save change</button>
                                                        </div>
                                                    </div>
                                                </Popup>
                                            </div>
                                            : isFollow === null ? null : <button className="btn btn-edit-profile" onClick={((e) => {
                                                if (isFollow === null) return;
                                                this.props.follow(auth.publicKey, isFollow);
                                            })}>
                                                {isFollow ? "Unfollow" : "Follow"}
                                            </button>
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
        editProfile: (profile) => dispatch(EditProfile(profile)),
        follow: (key, isFollow) => dispatch(Follow(key, isFollow)),
        GetFollowing: (key) => dispatch(GetFollowing(key))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileFollow)