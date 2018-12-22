import React, { Component } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import history from './history';
import Profile from './components/Profile';
import NewsDetail from './components/NewsDetail';
import Login from './components/Login';
import { connect } from 'react-redux';
import { GetProfile } from './store/actions/index';
import Home from './components/Home';
//import Followers from './components/Followers';

class App extends Component {
  componentWillMount() {
    //console.log(history);
    //if(history.location.pathname === "/") history.push("/" + this.props.auth.publicKey + "/tweets");
    //if (this.props.auth.secretKey === undefined || this.props.auth.secretKey === null) history.push('/login');
  }
  render() {
    return (
      <Router history={history}>
        <Switch>
        <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route path="/:id/tweets/:index" component={NewsDetail} />
          <Route path="/:id/:value" component={Profile} />
        </Switch>
      </Router>
    );
  }
}

const mapStatetoProps = (state) => {
  //console.log(state);
  return {
    auth: state.auth
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
      GetProfile: (key) => dispatch(GetProfile(key))
  }
};

export default connect(mapStatetoProps, mapDispatchToProps)(App);
