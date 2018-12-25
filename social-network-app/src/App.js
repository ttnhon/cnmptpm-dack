import React, { Component } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import history from './history';
import Profile from './components/Profile';
import NewsDetail from './components/NewsDetail';
import Login from './components/Login';
import { connect } from 'react-redux';
import { GetProfile } from './store/actions/index';
import Home from './components/Home';
import Payment from './components/Payment';
import * as account from './lib/account';
import PaymentHistory from './components/PaymentHistory';
//import Followers from './components/Followers';

class App extends Component {
  componentWillMount() {
    //console.log(history);
    //if(history.location.pathname === "/") history.push("/" + this.props.auth.publicKey + "/tweets");
    const key = account.checkLogged();
    if (key === false) {
      history.push('/login');
    }
  }
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route path="/:id/tweets/:hash" component={NewsDetail} />
          <Route path="/:id/:value" component={Profile} />
          <Route exact path="/payment" component={Payment} />
          <Route exact path="/payment-history" component={PaymentHistory} />
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
