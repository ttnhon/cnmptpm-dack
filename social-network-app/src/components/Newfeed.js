import React, { Component } from 'react';
import { connect } from 'react-redux';
import history from '../history';
import { GetNewfeed } from '../store/actions/index';
import * as account from '../lib/account';
import Post from './Post';
import { Link } from 'react-router-dom';

class Newfeed extends Component {
    ClickTweet(acc, hash) {
        history.push('/' + acc + '/tweets/' + hash);
    }

    componentWillMount() {
        if (this.props.newfeed === undefined || this.props.newfeed === null) {
            let key = account.checkLogged().publicKey();
            this.props.GetNewfeed(key);
        }
    }

    render() {
        //console.log(this.props);
        const auth = this.props.auth;
        //console.log(auth);
        let tweets = this.props.newfeed;
        //console.log(tweets);
        let media = null;
        if (tweets) {
            media = tweets.map((tweet, index) => {
                let time = tweet.time;
                return (
                    <div className="media" href="#toDetail" key={index} onClick={(e) => {
                        e.preventDefault();
                        let event = e.nativeEvent;
                        let uri = event.toElement.baseURI;
                        if(!(uri === window.location.href)){
                            this.ClickTweet(tweet.account, tweet.hash);
                        }else{

                        }
                        }}>
                        <Link className="media-left" to={'/' + tweet.account + '/tweets'}>
                            <img alt={tweet.img_url} className="media-object img-circle" src={tweet.img_url ? tweet.img_url !== "Not Set" ?  'data:image/jpeg;base64,' + tweet.img_url : "/default_profile_icon.png" : "/loading_circle.gif"} />
                        </Link>
                        <div className="media-body">
                            <div className="profile-tweets-user-header">
                                <Link className="profile-tweets-user" to={'/' + tweet.account + '/tweets'}>
                                    <span className="user-name">
                                        <span>{tweet.name ? tweet.name : null}</span>
                                    </span>
                                    <div className="user-time">
                                        <span>{time ? time.toLocaleString() : null}</span>
                                    </div>
                                </Link>
                            </div>
                            <p>{tweet.content.text}</p>
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
            if(tweets.length === 0){
                media = undefined;
            }
        }
        return (
            <div className="profile-tweets">
                <div className="panel panel-info profile-tweets-item">
                    <Post />
                    <div className="panel-body">
                        {media === null ? media ? null : <div className="img-loading-wrapper"><img className="img-loading" src="/loading.gif" alt="" /></div> : media}
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