import React, { Component } from 'react';
import { SetUserProfile } from "../store/actions/index";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as account from './../lib/account.js';
import '../assets/css/Header.css';
import { logout } from '../lib/account';
import history from '../history';
import Popup from "reactjs-popup";
import Signup from './Signup';
import Post from './Post';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  openModal() {
    this.setState({ open: true });
  }
  closeModal() {
    this.setState({ open: false });
  }
  render() {
    let inputSearch;
    const key = account.checkLogged();
    //console.log(key);
    if (key === false) {
      console.log(key);
      return <Redirect to={"/login"} />
    } else {
      if (this.props.auth.user === undefined || this.props.auth.user === null) {
        //console.log(this.props.auth.user);
        this.props.SetUserProfile(key.publicKey(), 1, { sequence: 0 });
      }
    }
    return (
      <div className="navbar navbar-default navbar-static-top">
        <div className="container">
          <div className="navbar-collapse navbar-collapse-1 collapse" aria-expanded="true">
            <ul className="nav navbar-nav">
              <li>
                <a href="/"><span className="glyphicon glyphicon-home"></span> Home</a>
              </li>
              <li>
                <a href="#fake"><span className="glyphicon glyphicon-bell"></span> Notifications</a>
              </li>
              <li>
                <a href="#fake"><span className="glyphicon glyphicon-envelope"></span> Messages</a>
              </li>
            </ul>
            <div className="navbar-form navbar-right">
              <div className="form-group has-feedback">
                <input type="text" className="form-control-nav" id="search" ref={node => inputSearch = node} aria-describedby="search1" />
                <button className="btn btn-primary btn-search" onClick={(e) => {
                  if (!inputSearch.value.trim()) return;
                  //console.log(inputSearch.value);
                  const { Keypair } = require('stellar-base');
                  try {
                    const key = Keypair.fromPublicKey(inputSearch.value);
                    return history.push("/" + inputSearch.value + "/tweets")
                  } catch (error) {
                    alert("Nhập sai key");
                  }
                }}><span className="glyphicon glyphicon-search form-control-feedback"></span></button>
              </div>
              <div className="dropdown user-dropdown">
                <button className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img className="img-circle" src={this.props.auth.user ? this.props.auth.user.picture ? ('data:image/jpeg;base64,' + this.props.auth.user.picture) : "/default_profile_icon.png" : "/loading_circle.gif"} alt="" /></button>
                <ul className="dropdown-menu">
                  <li className="menu-user-acc">
                    <a href={"/" + key.publicKey() + "/tweets"}>
                      <h4>{this.props.auth.user ? this.props.auth.user.name ? this.props.auth.user.name : "No name" : "No name"}</h4>
                    </a>
                  </li>
                  <li role="separator" className="divider"></li>
                  <li className="menu-user-profile"><a href={"/" + key.publicKey() + "/tweets"}>Profile</a></li>
                  <li role="separator" className="divider"></li>
                  <li className="menu-user-logout"><a href="#fake" onClick={(e) => {
                    e.preventDefault();
                    this.props.logout();
                    history.push('/login');
                  }
                  }>Log out</a></li>
                </ul>
              </div>
              <Popup trigger={<button className="btn btn-primary" aria-label="Left Align">
                Tweet
              </button>} position="left center"
              modal={true}>
              <div className="modal-btn-tweet">
                  <h3>Tweet what you want to say</h3>
                <Post />
              </div>
              </Popup>
              <div className="form-signup">
                <a href={"/"} onClick={((e) => {
                  e.preventDefault();
                  this.openModal();
                })}>Signup</a>
                <Popup modal={true}
                  closeOnDocumentClick={false}
                  open={this.state.open}
                  onClose={this.closeModal}>
                  <div>
                    <Signup />
                    <div className="modal-close">
                      <button className="btn btn-default btn-close-modal" onClick={this.closeModal}>Cancel</button>
                    </div>
                  </div>
                </Popup>
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

const mapDispatchToProps = (dispatch) => ({
  logout: () => logout(),
  SetUserProfile: (key, page, result) => dispatch(SetUserProfile(key, page, result))
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);