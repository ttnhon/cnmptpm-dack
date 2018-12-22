import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../assets/css/Home.css';
import Header from './Header';
import Newfeed from './Newfeed';

class Home extends Component {
  render() {
    //console.log(this.props);
    return (
        <div className="homepage">
            <Header />
            <div className="container">
                <div className="row">
                    <div className="col-md-3 col-lg-3">
                        
                    </div>
                    <div className="col-md-6 col-lg-6">
                    <Newfeed />
                    </div>
                    <div className="col-md-3 col-lg-3">
                        
                    </div>
                </div>
            </div>
        </div>
    )
  }
}

const mapStatetoProps = (state) => {
  return {
    tweets: state.auth.tweets
  }
};

export default connect(mapStatetoProps)(Home);