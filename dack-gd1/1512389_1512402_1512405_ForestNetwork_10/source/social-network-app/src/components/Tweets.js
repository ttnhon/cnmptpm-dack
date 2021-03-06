import React, { Component } from 'react';
import { connect } from 'react-redux';
import history from '../history';

class Tweets extends Component {
    getTime(time) {
        let unit = "m";
        let now = new Date();
        let t = null;
        t = Math.floor((now - time) / 60000);
        if (t >= 60) {
            t = Math.floor(t / 60);
            unit = "h";
            if (t >= 24) {
                t = Math.floor(t / 24);
                if (t > 1) {
                    unit = "d";
                    if (t >= 30) {
                        t = Math.floor(t / 30);
                        if (t > 1) {
                            unit = "m";
                            if (t > 12) {
                                t = Math.floor(t / 12);
                                if (t > 1) {
                                    unit = "y";
                                } else {
                                    unit = "y";
                                }
                            }
                        } else {
                            unit = "m";
                        }
                    }
                } else {
                    unit = "d";
                }
            }
        }
        return t + " " + unit;
    }

    ClickTweet(index) {
        history.push('/' + this.props.auth.id + '/tweets/' + index);
    }

    render() {
        let tweets = this.props.tweets;
        let media = null;
        if (tweets) {
            media = tweets.map((tweet, index) => {
                let time = this.getTime(tweet.date);
                return (
                    <div className="media" href="#toDetail" key={index} onClick={()=>this.ClickTweet(index)}>
                        <a className="media-left" href="#fake">
                            <img alt="" className="media-object img-circle" src="https://pbs.twimg.com/profile_images/1068915193982271488/5-DfGVRD_400x400.jpg" />
                        </a>
                        <div className="media-body">
                            <div className="profile-tweets-user-header">
                                <a className="profile-tweets-user" href={this.props.auth ? "/" : "#noUserId"}>
                                    <span className="user-name">
                                        <span>{this.props.auth ? this.props.auth.name : null}</span>
                                    </span>
                                    <span className="user-acc">
                                        <span>@{this.props.auth ? this.props.auth.id : null}</span>
                                    </span>
                                    <div className="user-time">
                                        <span>{time}</span>
                                    </div>
                                </a>
                            </div>
                            <p>{tweet.content}</p>
                            <ul className="nav nav-pills nav-pills-custom">
                                <li><a href="#fake"><i className="far fa-comment"></i></a></li>
                                <li><a href="#fake"><span className="glyphicon glyphicon-retweet"></span></a></li>
                                <li><a href="#fake"><span className="glyphicon glyphicon-heart-empty"></span> <span>1</span></a></li>
                                <li><a href="#fake"><i className="far fa-chart-bar"></i></a></li>
                            </ul>
                        </div>
                    </div>
                );
            })
        }
        return (
            <div className="profile-tweets">
                <div className="panel panel-info profile-tweets-item">
                    <div className="panel-heading">
                        <div className="media">
                            <h4 className="media-left">
                                Tweets
                                        </h4>
                            <div className="media-body">
                                <a href="#fake">Tweets & replies</a>
                            </div>
                        </div>
                    </div>
                    <div className="panel-body">
                        {media}
                    </div>
                    <div className="panel-footer">
                        <div className="media">
                            <div className="media-body">
                                <span>Tweets</span>
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
        tweets: state.auth.tweets
    }
};

const mapDispatchToProps = (dispatch) => {
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Tweets)