import React from 'react';
import { SetUserProfile } from "../store/actions/index";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as account from './../lib/account.js';
import '../assets/css/Header.css';
import { logout } from '../lib/account';
import history from '../history';

const Header = (props) => {
  const key = account.checkLogged();
  //console.log(key);
  if (key === false) {
    console.log(key);
    return <Redirect to={"/login"} />
  } else {
    if (props.auth.user === undefined || props.auth.user === null) {
      //console.log(props.auth.user);
      props.SetUserProfile(key.publicKey());
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
              <input type="text" className="form-control-nav" id="search" aria-describedby="search1" />
              <span className="glyphicon glyphicon-search form-control-feedback" aria-hidden="true"></span>
            </div>
            <div className="dropdown user-dropdown">
              <button className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img className="img-circle" src={props.auth.avtUrl ? props.auth.avtUrl : "https://pbs.twimg.com/profile_images/1068915193982271488/5-DfGVRD_400x400.jpg"} alt="" /></button>
              <ul className="dropdown-menu">
                <li className="menu-user-acc">
                  <a href={"/" + key.publicKey() + "/tweets"}>
                    <h4>{props.auth.user ? props.auth.user.name ? props.auth.user.name : "No name" : "No name"}</h4>
                  </a>
                </li>
                <li role="separator" className="divider"></li>
                <li className="menu-user-profile"><a href={"/" + key.publicKey() + "/tweets"}>Profile</a></li>
                <li role="separator" className="divider"></li>
                <li className="menu-user-logout"><a href="#fake" onClick={(e) => {
                  e.preventDefault();
                  props.logout();
                  history.push('/login');
                }
                }>Log out</a></li>
              </ul>
            </div>
            <button className="btn btn-primary" type="submit" aria-label="Left Align">
              Tweet
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
};

const mapDispatchToProps = (dispatch) => ({
  logout: () => logout(),
  SetUserProfile: (key) => dispatch(SetUserProfile(key))
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);