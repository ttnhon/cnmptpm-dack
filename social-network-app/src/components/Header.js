import React from 'react';
//import { logOut } from "../actions/index";
import { connect } from 'react-redux';
import '../assets/css/Header.css'

const Header = (props) => {
    return (
      <div className="navbar navbar-default navbar-static-top">
        <div className="container">
          <div className="navbar-collapse navbar-collapse-1 collapse" aria-expanded="true">
            <ul className="nav navbar-nav">
              <li>
                <a href="#fake"><span className="glyphicon glyphicon-home"></span> Home</a>
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
                <button className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img className="img-circle" src="https://pbs.twimg.com/profile_images/1068915193982271488/5-DfGVRD_400x400.jpg" alt="" /></button>
                <ul className="dropdown-menu">
                  <li className="menu-user-acc">
                    <a href="#fake">
                      <h4>Phuc</h4>
                      <h5>@Phuc89286488</h5>
                    </a>
                  </li>
                  <li role="separator" className="divider"></li>
                  <li className="menu-user-profile"><a href="#fake">Profile</a></li>
                  <li role="separator" className="divider"></li>
                  <li className="menu-user-logout"><a href="#fake">Log out</a></li>
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

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch()
});

export default connect(undefined, mapDispatchToProps)(Header);