import React from 'react';
//import { logOut } from "../actions/index";
import { connect } from 'react-redux';

const Header = (props) => {
    return (
        <div className="navbar navbar-default navbar-static-top">
  <div className="container">
    <div className="navbar-collapse navbar-collapse-1 collapse" aria-expanded="true">
      <ul className="nav navbar-nav">
        <li className="active">
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

        <button className="btn btn-primary" type="submit" aria-label="Left Align">
          <span className="glyphicon glyphicon-pencil" aria-hidden="true"> </span> Tweet
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