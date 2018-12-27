import React, { Component } from 'react';
import './../assets/css/news_detail.css';
import { connect } from 'react-redux';
import Header from './Header';
import { GetProfile, GetInteract } from '../store/actions/index';
import history from '../history';
import Reaction from './Reaction';
import Popup from "reactjs-popup";
import Comment from './Comment';
//import * as account from '../lib/account';

class NewsDetail extends Component {
    componentWillMount() {
        let id = "";
        let hash = "";
        if (this.props.match.params.id && this.props.match.params.hash) {
            id = this.props.match.params.id;
            hash = this.props.match.params.hash;
            this.props.GetProfile({key: id, hash: hash}, 1, { balance: 0, sequence: 0, tweets: [] });
            this.props.GetInteract({ key: id, hash: hash }, 1, []);
        }
    }
    render() {
        let hash = this.props.match.params.hash;
        var tweets = this.props.tweet;
        var tweet;
        let interact = this.props.interact;
        let error;
        let react = {
            none: [],
            like: [],
            love: [],
            haha: [],
            wow: [],
            sad: [],
            angry: []
        };
        let comments = null;
        let reps = [];
        let reacts;
        let yourReact = "none";
        let Content = [];
        let time;
        if(tweets){
            tweet = tweets[0];
            time = tweet.time;
        }
        //console.log(interacts);
        // if (tweets && hash) {
        //     let index = null;
        //     for (let i = 0; i < tweets.length; i++) {
        //         if (tweets[i].hash === hash) {
        //             index = i;
        //             break;
        //         }
        //     }
        //     if (index !== null) {
        //         tweet = tweets[index];
        //     } else {
        //         error = "Tweet not found";
        //     }
        // }
        if (tweet && interact && hash) {
            // for (let i = 0; i < interacts.length; i++) {
            //     if (interacts[i].skip) continue;
            //     let leng;
            //     if (interacts[i].object === hash) {
            //         leng = interact.push(interacts[i]);
            //     }
            //     if (leng) {
            //         for (let j = 0; j < interacts.length; j++) {
            //             if (interacts[j].skip) continue;
            //             if (interacts[j].object === interact[leng - 1].hash) {
            //                 if (interact[leng - 1].interact) {
            //                     interact[leng - 1].interact.push(interacts[j]);
            //                 } else {
            //                     interact[leng - 1].interact = [].concat(interacts[j]);
            //                 }
            //                 interacts[j].skip = true;
            //             }
            //         }
            //     }
            // }
            //console.log(interact);
            if (interact.length > 0) {
                for (let i = 0; i < interact.length; i++) {
                    if (interact[i].content.type === 1) {
                        reps.push(interact[i]);
                    } else {
                        let isBreak = false;
                        for (let j = interact.length - 1; j > i; j--) {
                            if (interact[i].account.account === interact[j].account.account && interact[j].content.type === 2) isBreak = true;
                        }
                        //console.log(isBreak);
                        //console.log(interact[i]);
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
                    comments = reps.map((reply, index) => {
                        //console.log(reply);
                        let rep = [];
                        let acts;
                        reply.react = {
                            none: [],
                            like: [],
                            love: [],
                            haha: [],
                            wow: [],
                            sad: [],
                            angry: []
                        };
                        let hasRep = false;
                        if (reply.interact) {
                            for (let i = 0; i < reply.interact.length; i++) {
                                //console.log(reply.interact[i]);
                                if (reply.interact[i].content.type === 1) {
                                    let content = [];
                                    let text = reply.interact[i].content.text.split(/(\r\n|\n|\r)/gm);
                                    console.log(text);
                                    text.map((element, index) => {
                                        //console.log(element);
                                        if (element === '\n') return [];
                                        content.push(<span key={index}>{element}<br /></span>);
                                    });
                                    hasRep = true;
                                    rep.push(<div className={"row one-news-comments reply-margin"} key={reply.interact[i].hash + "_" + i}>
                                        <div className="col-xs-3 col-sm-2 col-md-3 col-lg-2 img">
                                            <img src={reply.interact[i].account.img_url === "Not Set" ? "/default_profile_icon.png" : ('data:image/jpeg;base64,' + reply.interact[i].account.img_url)} className="img-circle" alt="" />
                                        </div>
                                        <div className="col-xs-9 col-sm-10 col-md-9 col-lg-10 comment-content">
                                            <pre><strong className="name"><a className="nav-link-account" href="/" onClick={(e) => {
                                                e.preventDefault();
                                                history.push('/' + reply.account.account + '/tweets');
                                            }}>{reply.interact[i].account.name ? reply.interact[i].account.name : ""}</a></strong><i className="time"> {reply.interact[i].date ? reply.interact[i].date.toLocaleString() : "time"}</i></pre>
                                            <div className="content">
                                                <h4>{content}</h4>
                                            </div>
                                            <ul className="associate">
                                                <li><button onClick={(e) => {
                                                    var x = document.getElementById(reply.hash);
                                                    if (x.style.display === "none") {
                                                        x.style.display = "block";
                                                    } else {
                                                        x.style.display = "none";
                                                    }
                                                }}><i className="far fa-comment"></i><span></span></button></li>
                                                {/* <li><button><span className="glyphicon glyphicon-heart-empty"></span><span></span></button></li> */}
                                            </ul>
                                        </div>
                                    </div>);
                                } else {
                                    let isBreak = false;
                                    for (let j = reply.interact.length - 1; j > i; j--) {
                                        if (reply.interact[i].account.account === reply.interact[j].account.account && reply.interact[j].content.type === 2) isBreak = true;
                                    }
                                    if (isBreak) continue;
                                    switch (reply.interact[i].content.reaction) {
                                        case 0:
                                            reply.react.none.push(reply.interact[i]);
                                            break;
                                        case 1:
                                            reply.react.like.push(reply.interact[i]);
                                            break;
                                        case 2:
                                            reply.react.love.push(reply.interact[i]);
                                            break;
                                        case 3:
                                            reply.react.haha.push(reply.interact[i]);
                                            break;
                                        case 4:
                                            reply.react.wow.push(reply.interact[i]);
                                            break;
                                        case 5:
                                            reply.react.sad.push(reply.interact[i]);
                                            break;
                                        case 6:
                                            reply.react.angry.push(reply.interact[i]);
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            }
                        }
                        let yourCommentReact = "none";
                        let list = [{ type: "like", array: reply.react.like },
                        { type: "love", array: reply.react.love },
                        { type: "haha", array: reply.react.haha },
                        { type: "wow", array: reply.react.wow },
                        { type: "sad", array: reply.react.sad },
                        { type: "angry", array: reply.react.angry }]
                        acts = list.map((react, index) => {
                            if (react.array.length <= 0) return [];
                            let result = [];
                            for (let i = 0; i < react.array.length; i++) {
                                if (this.props.auth.user) {
                                    if (react.array[i].account.account === this.props.auth.user.publicKey) {
                                        yourCommentReact = react.type;
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
                                <div className="popup-react" key={react.hash + "_" + index}>
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

                        let conten = [];
                        let text = reply.content.text.split(/(\r\n|\n|\r)/gm);
                        //console.log(text);
                        text.map((element, index) => {
                            //console.log(element);
                            if (element === '\n') return [];
                            conten.push(<span key={index}>{element}<br /></span>);
                        });

                        rep = [(
                            <div className={!hasRep ? "row one-news-comments" : "row one-news-comments have-reply"} key={index}>
                                <div className="col-xs-3 col-sm-2 col-md-2 col-lg-2 img">
                                    <img src={reply.account.img_url === "Not Set" ? "/default_profile_icon.png" : ('data:image/jpeg;base64,' + reply.account.img_url)} className="img-circle" alt="" />
                                </div>
                                <div className="col-xs-9 col-sm-10 col-md-10 col-lg-10 comment-content">
                                    <pre><strong className="name"><a className="nav-link-account" href="/" onClick={(e) => {
                                        e.preventDefault();
                                        history.push('/' + reply.account.account + '/tweets');
                                    }}>{reply.account.name ? reply.account.name : ""}</a></strong><i className="time"> {reply.time ? reply.time.toString().replace(" +0700", "") : "time"}</i></pre>
                                    <div className="content">
                                        <h4>{conten}</h4>
                                    </div>
                                    <ul className="stats col-xs-9 col-sm-10 col-md-10 col-lg-10">
                                        <li>React: <div className="rection-case">
                                            {acts ? acts : null}
                                        </div></li>
                                    </ul>
                                    <ul className="associate">
                                        <li><button onClick={(e) => {
                                            var x = document.getElementById(reply.hash);
                                            if (x.style.display === "none") {
                                                x.style.display = "block";
                                            } else {
                                                x.style.display = "none";
                                            }
                                        }}><i className="far fa-comment"></i><span></span></button></li>
                                        <li><div className="popup-react"><Popup
                                            trigger={<button><span className="glyphicon glyphicon-heart-empty"></span></button>}
                                            position="right center"
                                            on="hover"
                                        >
                                            <Reaction yourReact={yourCommentReact} hash={reply.hash} />
                                        </Popup></div></li>
                                    </ul>
                                </div>
                            </div>
                        )].concat(rep, <div id={reply.hash} key={reply.hash + "_reply"} style={{ display: "none" }} className="one-news-comments col-xs-12 comment-reply">
                            <Comment hash={reply.hash} />
                        </div>);
                        //console.log(rep);
                        return rep;
                    })
                }
            }
            if (reps.length === 0) {
                comments = undefined;
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
                for (let i = 0; i < react.array.length; i++) {
                    if (this.props.auth.user) {
                        if (react.array[i].account.account === this.props.auth.user.publicKey) {
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
                    <div className="popup-react" key={react.hash + "_" + index}>
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
            });

            if (tweet.content) {
                let text = tweet.content.text.split(/(\r\n|\n|\r)/gm);
                //console.log(text);
                text.map((element, index) => {
                    //console.log(element);
                    if (element === '\n') return [];
                    Content.push(<span key={index}>{element}<br /></span>);
                });
            }
        }
        //console.log(comments);
        return (
            <div>
                <Header />
                <div className="container one-news-detail">
                    <div className="row one-news-header">
                        <div className="col-xs-2 col-sm-2 col-md-3 col-lg-2 img-responsive">
                            <img src={this.props.auth.picture ? this.props.auth.picture ? ('data:image/jpeg;base64,' + this.props.auth.picture) : "/default_profile_icon.png" : "/loading_circle.gif"} className="img-circle" alt="" />
                        </div>
                        <div className="col-xs-10 col-sm-10 col-md-9 col-lg-10 news-owner-name">
                            <h4><strong>{this.props.auth.name ? <a className="nav-link-account" href="/" onClick={(e) => {
                                e.preventDefault();
                                history.push('/' + this.props.auth.publicKey + '/tweets');
                            }}>{this.props.auth.name}</a> : <span className="text-loading-wrapper"><img className="text-loading" src="/loading_text.gif" alt="" /></span>}</strong></h4>
                        </div>
                    </div> {/* end one-news-header */}
                    <div className="row one-news-content">
                        <div className="text">
                            {error ? <h4>{error}</h4> : null}
                            <h4>{tweet ? Content.length > 0 ? Content : null : <span className="text-loading-wrapper"><img className="text-loading" src="/loading_text.gif" alt="" /></span>}</h4>
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
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 post-time">
                            <p>{tweet ? time ? time.toString().replace(" +0700", "") : null : "time"}</p>
                        </div>
                        <ul className="stats col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <li>React: <div className="rection-case">
                                {reacts ? reacts : null}
                            </div></li>
                        </ul>
                        <ul className="associate col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <li><div className="popup-react"><Popup
                                trigger={<button><span className="glyphicon glyphicon-heart-empty"></span></button>}
                                position="right center"
                                on="hover"
                            >
                                <Reaction yourReact={yourReact} hash={hash} />
                            </Popup></div></li>
                        </ul>
                    </div> {/* end one-new-status */}
                    <div className="text-center">
                        <h4>Comments</h4>
                    </div>
                    {comments === null ? comments ? null : <div className="img-loading-wrapper"><img className="img-loading" src="/loading.gif" alt="" /></div> : comments}
                    <Comment hash={hash} />
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