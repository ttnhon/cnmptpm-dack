import React, { Component } from 'react';
import './../assets/css/news_detail.css';
import { connect } from 'react-redux';
import Header from './Header';
import { GetProfile, GetInteract } from '../store/actions/index';
import history from '../history';
import Reaction from './Reaction';
import Popup from "reactjs-popup";
//import * as account from '../lib/account';

class NewsDetail extends Component {
    componentWillMount() {
        let id = "";

        if (this.props.match.params.id) {
            id = this.props.match.params.id;
            this.props.GetProfile(id, 1, { balance: 0, sequence: 0, tweets: [] });
            this.props.GetInteract(id, 1, []);
        }
    }
    render() {
        let hash = this.props.match.params.hash;
        var tweet = this.props.tweet;
        let interact = [];
        let error;
        let react = { none: [],
                    like: [],
                    love: [],
                    haha: [],
                    wow: [],
                    sad: [],
                    angry: [] };
        let replies = null;
        let reps = [];
        let reacts;
        let yourReact = "none";
        //console.log(tweet);
        if (tweet && hash) {
            let index = null;
            for (let i = 0; i < tweet.length; i++) {
                if (tweet[i].hash === hash) {
                    index = i;
                    break;
                }
            }
            if (index !== null) {
                tweet = tweet[index];
            } else {
                tweet = undefined;
                error = "Tweet not found";
            }
        } else {
            tweet = undefined;
        }
        if (tweet && this.props.interact && hash) {
            for (let i = 0; i < this.props.interact.length; i++) {
                if (this.props.interact[i].object === hash) {
                    interact.push(this.props.interact[i]);
                }
            }
            if (interact.length > 0) {
                for (let i = 0; i < interact.length; i++) {
                    if (interact[i].content.type === 1) {
                        reps.push(interact[i]);
                    } else {
                        let isBreak = false;
                        for (let j = interact.length - 1; j > i; j--) {
                            if (interact[i].account.account === interact[j].account.account) isBreak = true;
                        }
                        if (isBreak) continue;
                        switch (interact[i].content.reaction) {
                            case 0:
                                react.none.push(interact[i]);
                                break;
                            case 1:
                                react.like.push(interact[i]);
                                break;
                            case 2:
                                react.love.push(interact[i]);
                                break;
                            case 3:
                                react.haha.push(interact[i]);
                                break;
                            case 4:
                                react.wow.push(interact[i]);
                                break;
                            case 5:
                                react.sad.push(interact[i]);
                                break;
                            case 6:
                                react.angry.push(interact[i]);
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        }
        //console.log(react);
        //console.log(reps);
        if (tweet) {
            if (reps.length > 0) {
                if (reps[0].account.name) {
                    replies = reps.map((reply, index) => {
                        if (reply.isLooped) {
                            return [];
                        }
                        //console.log(reply.account);
                        let rep = [];
                        let hasRep = false;
                        for (let i = index + 1; i < reps.length; i++) {
                            if (reps[index].hash === reps[i].object) {
                                //console.log(reps[i]);
                                hasRep = true;
                                rep.push(<div className={"row one-news-comments"} key={i}>
                                    <div className="col-xs-3 col-sm-2 col-md-3 col-lg-2 img">
                                        <img src={reps[i].account.img_url === "Not Set" ? "/default_profile_icon.png" : ('data:image/jpeg;base64,' + reps[i].account.img_url)} className="img-circle" alt="" />
                                    </div>
                                    <div className="col-xs-9 col-sm-10 col-md-9 col-lg-10 comment-content">
                                        <pre><strong className="name"><a className="nav-link-account" href="/" onClick={(e) => {
                                e.preventDefault();
                                history.push('/' + reply.account.account + '/tweets');
                            }}>{reps[i].account.name ? reps[i].account.name : ""}</a></strong><i className="time"> {reps[i].date ? reps[i].date.toLocaleString() : "time"}</i></pre>
                                        <div className="content">
                                            <h4>{reps[i].content.text}</h4>
                                        </div>
                                        <ul className="associate">
                                            <li><button><i className="far fa-comment"></i><span> {null}</span></button></li>
                                            <li><button><span className="glyphicon glyphicon-retweet"></span><span> {null}</span></button></li>
                                            <li><button><span className="glyphicon glyphicon-heart-empty"></span><span> {null}</span></button></li>
                                            <li><button><span className="glyphicon glyphicon-envelope"></span></button></li>
                                        </ul>
                                    </div>
                                </div>);
                                reps[i].isLooped = true;
                            }
                        }
                        rep = [(
                            <div className={!hasRep ? "row one-news-comments" : "row one-news-comments have-reply"} key={index}>
                                <div className="col-xs-3 col-sm-2 col-md-2 col-lg-2 img">
                                    <img src={reply.account.img_url === "Not Set" ? "/default_profile_icon.png" : ('data:image/jpeg;base64,' + reply.account.img_url)} className="img-circle" alt="" />
                                </div>
                                <div className="col-xs-9 col-sm-10 col-md-10 col-lg-10 comment-content">
                                    <pre><strong className="name"><a className="nav-link-account" href="/" onClick={(e) => {
                                e.preventDefault();
                                history.push('/' + reply.account.account + '/tweets');
                            }}>{reply.account.name ? reply.account.name : ""}</a></strong><i className="time"> {reply.date ? reply.date.toLocaleString() : "time"}</i></pre>
                                    <div className="content">
                                        <h4>{reply.content.text}</h4>
                                    </div>
                                    <ul className="associate">
                                        <li><button><i className="far fa-comment"></i><span> {null}</span></button></li>
                                        <li><button><span className="glyphicon glyphicon-retweet"></span><span> {null}</span></button></li>
                                        <li><button><span className="glyphicon glyphicon-heart-empty"></span><span> {null}</span></button></li>
                                        <li><button><span className="glyphicon glyphicon-envelope"></span></button></li>
                                    </ul>
                                </div>
                            </div>
                        )].concat(rep);
                        //console.log(rep);
                        return rep;
                    })
                }
            }
            if (reps.length === 0) {
                replies = undefined;
            }
            let list = [{ type: "like", array: react.like },
            { type: "love", array: react.love },
            { type: "haha", array: react.haha },
            { type: "wow", array: react.wow },
            { type: "sad", array: react.sad },
            { type: "angry", array: react.angry }]
            reacts = list.map((react, index) => {
                if (react.array.length <= 0) return [];
                let result = [];
                for(let i = 0; i < react.array.length; i++){
                    if(this.props.auth.user){
                        if(react.array[i].account.account === this.props.auth.user.publicKey){
                            yourReact = react.type;
                        }
                    }
                    result.push(
                        <div key={i}><a className="nav-link-account" href="/" onClick={(e) => {
                            e.preventDefault();
                            history.push('/' + react.array[i].account.account + '/tweets');
                        }}>{react.array[i].account.name}</a></div>
                    );
                }
                return (
                    <div className="popup-react" key={index}>
                    <Popup trigger={<div className="react-wrapper">
                            <button><img src={"/reaction/" + react.type + ".png"} className="img-responsive" alt="" /></button>
                            <span className="number">{react.array.length}</span>
                        </div>}
                        position="bottom center"
                        on="hover"
                    >
                    <div>{result.length > 0 ? result : null}</div>
                    </Popup>
                    </div>
                );
            })
        }
        //console.log(replies);
        return (
            <div>
                <Header />
                <div className="container one-news-detail">
                    <div className="row one-news-header">
                        <div className="col-xs-2 col-sm-2 col-md-3 col-lg-2 img-responsive">
                            <img src={this.props.auth ? this.props.auth.picture ? ('data:image/jpeg;base64,' + this.props.auth.picture) : "/default_profile_icon.png" : "/loading_circle.gif"} className="img-circle" alt="" />
                        </div>
                        <div className="col-xs-10 col-sm-10 col-md-9 col-lg-10 news-owner-name">
                            <h4><strong><a className="nav-link-account" href="/" onClick={(e) => {
                                e.preventDefault();
                                history.push('/' + this.props.auth.publicKey + '/tweets');
                            }}>{this.props.auth.name}</a></strong></h4>
                        </div>
                    </div> {/* end one-news-header */}
                    <div className="row one-news-content">
                        <div className="text">
                            {error ? <h4>{error}</h4> : null}
                            <h4>{tweet ? tweet.content ? tweet.content.text : null : null}</h4>
                        </div>
                        <div className="imgs">
                            {/* truong hop co 1 anh */}
                            {/* <img src="https://pbs.twimg.com/media/DtRAulKWwAYKani.jpg" className="img-responsive" alt="" />
                    truong hop co 2 anh
                    <div className="col-md-6">
                        <img src="https://pbs.twimg.com/media/DtRAulKWwAYKani.jpg" className="img-responsive" alt="" />
                    </div>
                    <div className="col-md-6">
                        <img src="https://pbs.twimg.com/media/DtRAulKWwAYKani.jpg" className="img-responsive" alt="" />
                    </div>
                    <div className="col-md-9">
                        <img src="https://pbs.twimg.com/media/DtRAulKWwAYKani.jpg" className="img-responsive" alt="" />
                    </div>
                    truong hop nhieu hon 3 anh
                    <div className="col-md-3">
                        <img src="https://pbs.twimg.com/media/DtRAulKWwAYKani.jpg" className="img-responsive" alt="" />
                        <img src="https://pbs.twimg.com/media/DtRAulKWwAYKani.jpg" className="img-responsive" alt="" />
                        <img src="https://pbs.twimg.com/media/DtRAulKWwAYKani.jpg" className="img-responsive" alt="" />
                    </div> */}
                        </div>
                        <div className="videos">
                        </div>
                    </div> {/* end one-new-content */}
                    <div className="row one-news-status">
                        <div className="col-md-12 post-time">
                            <p>{tweet ? tweet.date ? tweet.date.toLocaleString() : tweet.height ? tweet.height : "time" : "time"}</p>
                        </div>
                        <ul className="stats col-md-12">
                            <li>Retweet: <strong>{tweet ? tweet.retweet ? tweet.retweet : null : null}</strong> </li>
                            <li>React: <div className="rection-case">
                                {reacts ? reacts : null}
                            </div></li>
                        </ul>
                        <ul className="associate col-md-12">
                            <li><button><i className="far fa-comment"></i><span></span></button></li>
                            <li><button><span className="glyphicon glyphicon-retweet"></span><span></span></button></li>
                            <li><div className="popup-react"><Popup
                                trigger={<button><span className="glyphicon glyphicon-heart-empty"></span></button>}
                                position="bottom center"
                                on="hover"
                            >
                                <Reaction yourReact={yourReact} hash={hash} />
                            </Popup></div></li>
                            <li><button><span className="glyphicon glyphicon-envelope"></span></button></li>
                        </ul>
                    </div> {/* end one-new-status */}
                    <div className="row one-news-reply">
                        <form className="form-inline" action="/">
                            <div className="form-group">
                                <label htmlFor="your_comment">
                                    <img src={this.props.auth.user ? this.props.auth.user.picture ? ('data:image/jpeg;base64,' + this.props.auth.user.picture) : "/default_profile_icon.png" : "/loading_circle.gif"} className="img-circle" alt="" />
                                </label>
                                <input type="text" className="form-control" placeholder="Để lại bình luận của bạn" name="your_comment" />
                                <button type="submit" className="btn btn-primary form-control" name="comment_send" >Send</button>
                            </div>
                        </form>
                    </div> {/* end one-new-reply */}
                    {replies === null ? replies ? null : <div className="img-loading-wrapper"><img className="img-loading" src="/loading.gif" alt="" /></div> : replies}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    //console.log(state);
    return {
        auth: state.auth,
        tweet: state.auth.tweets,
        interact: state.auth.interact
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        GetProfile: (key, page, result) => dispatch(GetProfile(key, page, result)),
        GetInteract: (key, page, result) => dispatch(GetInteract(key, page, result))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsDetail)