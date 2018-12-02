import React, { Component } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import history from './history';
import Profile from './components/Profile';
import NewsDetail from './components/NewsDetail';
import Following from './components/Following';
import Followers from './components/Followers';

class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
        <Route exact path="/" component={Profile}/>
        <Route exact path="/news-detail" component={NewsDetail}/>
        <Route exact path="/following" component={Following}/>
        <Route exact path="/followers" component={Followers}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
