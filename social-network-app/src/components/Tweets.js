import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import history from '../history';
import Post from './Post';
import * as account from '../lib/account';

class Tweets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1
        }
        window.onscroll = () => {
            //if is loading getout
            if (this.props.tweets) {
                //get out if end of page
                if (this.state.page >= Math.floor(this.props.tweets.length / 10)) {
                    
                    return;
                }
                if (
                    window.innerHeight + document.documentElement.scrollTop
                    === document.documentElement.offsetHeight
                ) {
                    this.setState({page: this.state.page + 1});
                }
            }
        }
    }

    ClickTweet(hash) {
        history.push('/' + this.props.auth.publicKey + '/tweets/' + hash);
    }

    render() {
        let tweets = this.props.tweets;
        let media = null;
        let isUser = account.checkLogged().publicKey() === this.props.auth.publicKey;
        //console.log(this.state);
        if (tweets) {
            tweets = tweets.slice(0, (this.state.page * 10));
            media = tweets.map((tweet, index) => {
                let time = tweet.time;
                //let date = time.toLocaleDateString();
                let content;
                if (tweet) {
                    content = [];
                    let text = tweet.content.text.split(/(\r\n|\n|\r)/gm);
                    text.map((element, index) => {
                        //console.log(element);
                        if (element === '\n') return [];
                        content.push(<span key={index}>{element}<br /></span>);
                    });
                }
                return (
                    <div className="media" href="#toDetail" key={index} onClick={(e) => {
                        e.preventDefault();
                        let event = e.nativeEvent;
                        //console.log(event.toElement.id === "toAcc");
                        if (!(event.toElement.id === "toAcc")) {
                            this.ClickTweet(tweet.hash);
                        }
                    }}>
                        <Link className="media-left" to={this.props.auth.publicKey ? "/" + this.props.auth.publicKey + "/tweets" : "/error"}>
                            <img id="toAcc" alt="" className="media-object img-circle" src={this.props.auth.picture ? this.props.auth.picture !== "Not Set" ? ('data:image/jpeg;base64,' + this.props.auth.picture) : "/default_profile_icon.png" : "/loading_circle.gif"} />
                        </Link>
                        <div className="media-body">
                            <div className="profile-tweets-user-header">
                                <Link className="profile-tweets-user" to={this.props.auth.publicKey ? "/" + this.props.auth.publicKey + "/tweets" : "/error"}>
                                    <span id="toAcc" className="user-name">
                                        <span id="toAcc" >{this.props.auth ? this.props.auth.name ? this.props.auth.name : "No name" : null}</span>
                                    </span>
                                    <div className="user-time">
                                        <span id="toAcc">{time ? time.toString().replace(" +0700", "") : null}</span>
                                    </div>
                                </Link>
                            </div>
                            <p>{tweet ? content ? content : null : null}</p>
                            {/* <ul className="nav nav-pills nav-pills-custom">
                                <li><a href="#fake"><i className="far fa-comment"></i></a></li>
                                <li><a href="#fake"><span className="glyphicon glyphicon-retweet"></span></a></li>
                                <li><a href="#fake"><span className="glyphicon glyphicon-heart-empty"></span> <span>1</span></a></li>
                                <li><a href="#fake"><i className="far fa-chart-bar"></i></a></li>
                            </ul> */}
                        </div>
                    </div>
                );
            })
            if (tweets.length <= 0) media = "noMedia";
        }
        return (
            <div className="profile-tweets">
                <div className="panel panel-info profile-tweets-item">
                    {isUser ? <Post /> : <div className="panel-heading">
                        <div className="media">
                            <h4 className="media-left">
                                Tweets
                                        </h4>
                            <div className="media-body">
                            </div>
                        </div>
                    </div>}
                    <div className="panel-body">
                        {media ? media === "noMedia" ? null : media : <div className="img-loading-wrapper"><img className="img-loading" src="/loading.gif" alt="" /></div>}
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