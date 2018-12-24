import React, { Component } from 'react';
import './../assets/css/news_detail.css';
import { connect } from 'react-redux';
import Header from './Header';
import { GetProfile } from '../store/actions/index';
import history from '../history';
//import * as account from '../lib/account';

class NewsDetail extends Component {
    componentWillMount() {
        let id = "";

        if (this.props.match.params.id) {
            id = this.props.match.params.id;
            this.props.GetProfile(id, 1, { balance: 0, sequence: 0, tweets: [] });
        }
    }
    render() {
        let hash = this.props.match.params.hash;
        var tweet = this.props.tweet;
        let error;
        //console.log(tweet);
        if(tweet && hash){
            let index = null;
            for(let i = 0; i < tweet.length; i++){
                if(tweet[i].hash === hash) {
                    index = i;
                    break;
                }
            }
            if(index !== null){
                tweet = tweet[index];
            }else{
                tweet = undefined;
                error = "Tweet not found";
            }
        }else{
            tweet = undefined;
        }
        let replies = null;
        if (tweet) {
            if (tweet.replies) {
                replies = tweet.replies.map((reply, index) => {
                    let rep = [];
                    rep.push(
                        <div className={reply.replies.length <= 0 ? "row one-news-comments" : "row one-news-comments have-reply"} key={index}>
                            <div className="col-md-2 img">
                                <img src={reply.owner.avtUrl} className="img-circle" alt="" />
                            </div>
                            <div className="col-md-10 comment-content">
                                <pre><strong className="name">{reply.owner.name}</strong><i className="nickname"> @{reply.owner.id}</i><i className="time">{reply.date.toLocaleString()}</i></pre>
                                <div className="content">
                                    <h4>{reply.content}</h4>
                                </div>
                                <ul className="associate">
                                    <li><button><i className="far fa-comment"></i><span> {reply.replies.length}</span></button></li>
                                    <li><button><span className="glyphicon glyphicon-retweet"></span><span> {reply.retweet}</span></button></li>
                                    <li><button><span className="glyphicon glyphicon-heart-empty"></span><span> {reply.like}</span></button></li>
                                    <li><button><span className="glyphicon glyphicon-envelope"></span></button></li>
                                </ul>
                            </div>
                        </div>
                    );
                    if (reply.replies.length !== 0) {
                        for (let i = 0; i < reply.replies.length; i++) {
                            rep.push(<div className={"row one-news-comments"} key={index + '_' + i}>
                                <div className="col-md-2 img">
                                    <img src={reply.replies[i].owner.avtUrl} className="img-circle" alt="" />
                                </div>
                                <div className="col-md-10 comment-content">
                                    <pre><strong className="name">{reply.replies[i].owner.name}</strong><i className="nickname"> @{reply.replies[i].owner.id}</i><i className="time">{reply.replies[i].date.toLocaleString()}</i></pre>
                                    <div className="content">
                                        <h4>{reply.replies[i].content}</h4>
                                    </div>
                                    <ul className="associate">
                                        <li><button><i className="far fa-comment"></i><span> {reply.replies[i].replies.length}</span></button></li>
                                        <li><button><span className="glyphicon glyphicon-retweet"></span><span> {reply.replies[i].retweet}</span></button></li>
                                        <li><button><span className="glyphicon glyphicon-heart-empty"></span><span> {reply.replies[i].like}</span></button></li>
                                        <li><button><span className="glyphicon glyphicon-envelope"></span></button></li>
                                    </ul>
                                </div>
                            </div>);
                        }
                    }
                    //console.log(rep);
                    return rep;
                })
            }
        }
        //console.log(replies);
        return (
            <div>
                <Header />
                <div className="container-fluid one-news-detail">
                    <div className="row one-news-header">
                        <div className="col-md-2 img-responsive">
                            <img src={this.props.auth ? this.props.auth.picture ? ('data:image/jpeg;base64,' + this.props.auth.picture) : "/default_profile_icon.png" : "/default_profile_icon.png"} className="img-circle" alt="" />
                        </div>
                        <div className="col-md-7 news-owner-name">
                            <h4><strong><a className="nav-link-account" href="/" onClick={(e)=>{
                                e.preventDefault();
                                history.push('/' + this.props.auth.publicKey + '/tweets');
                            }}>{this.props.auth.name}</a></strong></h4>
                        </div>
                        <div className="col-md-3 news-status">
                            <button type="button" className="btn btn-primary">Follow</button>
                            {/* <button type="button" class="btn btn-danger">Bỏ theo dõi</button> */}
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
                            <li>Likes: <strong>{tweet ? tweet.like ? tweet.like : null : null}</strong></li>
                        </ul>
                        <ul className="associate col-md-12">
                            <li><button><i className="far fa-comment"></i><span> {tweet ? tweet.replies ? tweet.replies.length : null : null}</span></button></li>
                            <li><button><span className="glyphicon glyphicon-retweet"></span><span> {tweet ? tweet.retweet ? tweet.retweet : null : null}</span></button></li>
                            <li><button><span className="glyphicon glyphicon-heart-empty"></span><span> {tweet ? tweet.like ? tweet.like : null : null}</span></button></li>
                            <li><button><span className="glyphicon glyphicon-envelope"></span></button></li>
                        </ul>
                    </div> {/* end one-new-status */}
                    <div className="row one-news-reply">
                        <form className="form-inline" action="/">
                            <div className="form-group">
                                <label htmlFor="email">
                                    <img src={this.props.auth ? this.props.auth.picture ? ('data:image/jpeg;base64,' + this.props.auth.picture) : "/default_profile_icon.png" : "/default_profile_icon.png"} className="img-circle" alt="" />
                                </label>
                                <input type="text" className="form-control" placeholder="Để lại bình luận của bạn" name="your_comment" />
                            </div>
                        </form>
                    </div> {/* end one-new-reply */}
                    {replies}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    //console.log(state);
    return {
        auth: state.auth,
        tweet: state.auth.tweets
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        GetProfile: (key, page, result) => dispatch(GetProfile(key, page, result))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsDetail)