import React, { Component } from 'react';
import { connect } from 'react-redux';
import history from '../history';
import { GetNewfeed } from '../store/actions/index';
import * as account from '../lib/account';
import Post from './Post';
import { Link } from 'react-router-dom';

class Newfeed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1
        }
        window.onscroll = () => {
            //if is loading getout
            if (this.props.newfeed) {
                //get out if end of page
                if (this.state.page >= Math.floor(this.props.newfeed.length / 10)) {

                    return;
                }
                if (
                    window.innerHeight + document.documentElement.scrollTop
                    === document.documentElement.offsetHeight
                ) {
                    this.setState({ page: this.state.page + 1 });
                }
            }
        }
    }
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
            tweets = tweets.slice(0, (this.state.page * 10));
            media = tweets.map((tweet, index) => {
                let time = tweet.time;
                let content;
                switch (tweet.content.key) {
                    case "post":
                        content = [];
                        let text = tweet.content.value.text.split(/(\r\n|\n|\r)/gm);
                        text.map((element, index) => {
                            //console.log(element);
                            if (element === '\n') return [];
                            content.push(<span key={index}>{element}<br /></span>);
                        });

                        break;
                    case "update_account":
                        if (tweet.content.value.key === "name") {
                            content = <span>Updated name to <strong>{tweet.content.value.value}</strong></span>;
                        } else {
                            content = <span>Updated picture to <img className="newfeed-img" src={'data:image/jpeg;base64,' + tweet.content.value.value} /></span>;
                        }
                        break;
                    case "payment":
                        content = <span>Sent <strong>{tweet.content.value.amount * 1.0 / 100000000} TRE</strong> to <Link style={{ wordBreak: "break-all" }} to={'/' + tweet.content.value.address + '/tweets'}>{tweet.content.value.address}</Link></span>
                        break;
                    default:
                        break;
                }
                return (
                    <div className="media" href="/" key={index} onClick={(e) => {
                        e.preventDefault();
                        if (tweet.content.key !== "post") return;
                        if (!(history.pathname === '/' + tweet.account + '/tweets')) {
                            this.ClickTweet(tweet.account, tweet.hash);
                        } else {

                        }
                    }}>
                        <Link className="media-left" to={'/' + tweet.account + '/tweets'}>
                            <img alt={tweet.img_url} className="media-object img-circle" src={tweet.img_url ? tweet.img_url !== "Not Set" ? 'data:image/jpeg;base64,' + tweet.img_url : "/default_profile_icon.png" : "/loading_circle.gif"} />
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
                            <p>{content ? content : null}</p>
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
            if (tweets.length === 0) {
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