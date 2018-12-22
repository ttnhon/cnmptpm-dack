import React, { Component } from 'react';
import { connect } from 'react-redux';
import history from '../history';
import { GetNewfeed } from '../store/actions/index';
import * as account from './../lib/account.js';

class Newfeed extends Component {
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
        //history.push('/' + this.props.auth.publicKey + '/tweets/' + index);
    }

    ClickPerson(key){
        history.push('/' + key + '/tweets/');
    }

    componentWillMount() {
        if (this.props.newfeed === undefined || this.props.newfeed === null) {
            let key = account.checkLogged().publicKey();
            this.props.GetNewfeed(key);
        }
    }

    render() {
        //console.log(this.props);
        let inputPost;
        let tweets = this.props.newfeed;
        //console.log(tweets);
        let media = null;
        if (tweets) {
            media = tweets.map((tweet, index) => {
                //let time = this.getTime(tweet.date);
                return (
                    <div className="media" href="#toDetail" key={index} onClick={() => this.ClickTweet(index)}>
                        <a className="media-left" href="#fake">
                            <img alt="" className="media-object img-circle" src="https://pbs.twimg.com/profile_images/1068915193982271488/5-DfGVRD_400x400.jpg" />
                        </a>
                        <div className="media-body">
                            <div className="profile-tweets-user-header">
                                <a className="profile-tweets-user" onClick={(e)=>{
                                    e.preventDefault();
                                    this.ClickPerson(tweet.account);
                                }} href="/">
                                    <span className="user-name">
                                        <span>{tweet.name ? tweet.name : null}</span>
                                    </span>
                                    <div className="user-time">
                                        <span>{tweet.height}</span>
                                    </div>
                                </a>
                            </div>
                            <p>{tweet.content.text}</p>
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
                            <div className="media-left">
                                <img src="https://pbs.twimg.com/profile_images/1068915193982271488/5-DfGVRD_400x400.jpg" alt="" />
                            </div>
                            <div className="media-body">
                                <div className="new-post">
                                    <div className="text-input-wrapper">
                                        <textarea className="form-control" ref={node => inputPost = node} placeholder="What's happening?"></textarea>
                                    </div>
                                    <div className="btn-send-wrapper">
                                        <button type="button" className="btn btn-default" onClick={(e) => {
                                            if (inputPost.value.trim()) return;
                                            console.log("btn send");
                                        }}>
                                            <span className="glyphicon glyphicon-send" aria-hidden="true"></span>
                                    </button>
                                    </div>
                                </div>
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
        newfeed: state.auth.newfeed
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        GetNewfeed: (key) => dispatch(GetNewfeed(key))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Newfeed)