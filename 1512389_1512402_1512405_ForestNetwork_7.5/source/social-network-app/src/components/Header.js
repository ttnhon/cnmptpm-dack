import React, { Component } from 'react';
import { SetUserProfile } from "../store/actions/index";
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import * as account from './../lib/account.js';
import '../assets/css/Header.css';
import { logout } from '../lib/account';
import history from '../history';
import Popup from "reactjs-popup";
import Signup from './Signup';
import Post from './Post';
import {SetDefaultState, GetNewfeed, SetDefaultHomeState} from '../store/actions/index';

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
  componentWillMount() {
    const key = account.checkLogged();
    if (key === false) {
      //console.log(key);
      return <Redirect to={"/login"} />
    } else {
      if (this.props.auth.user === undefined || this.props.auth.user === null) {
        //console.log(this.props.auth.user);
        this.props.SetUserProfile(key.publicKey(), 1, { sequence: 0, balance: 0, numberReceive: 0 });
      }
    }
  }
  render() {
    let inputSearch;
    let HasNotification;
    const key = account.checkLogged();
    if (key === false) {
      //console.log(key);
      return <Redirect to={"/login"} />
    }else{
      if (this.props.auth.user === undefined || this.props.auth.user === null) {
        //console.log(this.props.auth.user);
        this.props.SetUserProfile(key.publicKey(), 1, { sequence: 0, balance: 0, numberReceive: 0 });
      }
    }
    if(this.props.auth.user){
      let number = account.getItemLocal("numberReceive");
      if(this.props.auth.user.numberReceive){
        HasNotification = number !== this.props.auth.user.numberReceive.toString();
      }
    }
    
    return (
      <div className="navbar navbar-default navbar-static-top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
          </div>
          <div className="navbar-collapse collapse" id="bs-example-navbar-collapse-1" aria-expanded="true">
            <ul className="nav navbar-nav">
              <li>
                <Link onClick={(e)=>{
                  if(this.props.user){
                    if(this.props.user.newfeed){
                      //this.props.SetDefaultHomeState();
                      //this.props.GetNewfeed(key.publicKey());
                    }
                  }
                  
                }} to="/"><span className="glyphicon glyphicon-home"></span> Home</Link>
              </li>
              <li className="notification">
                {HasNotification ? <span className="attention"><i className="fas fa-exclamation"></i></span> : null}
                <div className="btn-group">
                  <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span className="glyphicon glyphicon-bell"></span> Notifications <span className="caret"></span>
                  </button>
                  <ul className="dropdown-menu">
                    {HasNotification ?
                      <li><Link onClick={(e)=>{
                        if(this.props.auth.user){
                          if(this.props.auth.user.numberReceive){
                            account.setItemLocal("numberReceive", this.props.auth.user.numberReceive);
                          }
                        }
                      }} to="/payment-history">Bạn có giao dịch mới</Link></li>
                      : <li>Không có thông báo mới</li>}
                  </ul>
                </div>
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
                <button className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img className="img-circle" src={this.props.auth.user ? this.props.auth.user.picture !== "Not Set" ? ('data:image/jpeg;base64,' + this.props.auth.user.picture) : "/default_profile_icon.png" : "/loading_circle.gif"} alt="" /></button>
                <ul className="dropdown-menu">
                  <li className="menu-user-acc">
                    <Link to={"/" + key.publicKey() + "/tweets"}>
                      <h4>{this.props.auth.user ? this.props.auth.user.name ? this.props.auth.user.name : "No name" : "No name"}</h4>
                    </Link>
                  </li>
                  <li role="separator" className="divider"></li>
                  <li className="menu-user-profile"><Link to={"/" + key.publicKey() + "/tweets"}>Profile</Link></li>
                  <li role="separator" className="divider"></li>
                  <li className="menu-user-profile"><Link to='/payment'>Send Money</Link></li>
                  <li role="separator" className="divider"></li>
                  <li className="menu-user-profile"><Link to='/payment-history'>Payment History</Link></li>
                  <li role="separator" className="divider"></li>
                  <li className="menu-user-logout"><a href="#fake" onClick={(e) => {
                    e.preventDefault();
                    this.props.logout();
                    this.props.SetDefaultState();
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
                      <button className="btn btn-default btn-close-modal" onClick={this.closeModal}>Exit</button>
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
  SetUserProfile: (key, page, result) => dispatch(SetUserProfile(key, page, result)),
  setUserPro: (profile) => dispatch(profile),
  GetNewfeed: (key) => dispatch(GetNewfeed(key)),
  SetDefaultState: () => dispatch(SetDefaultState()),
  SetDefaultHomeState: () => dispatch(SetDefaultHomeState())
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);