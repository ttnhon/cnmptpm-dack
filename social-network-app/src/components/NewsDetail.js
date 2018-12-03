import React, { Component } from 'react';
import './../assets/css/news_detail.css';
import { connect } from 'react-redux';
import Header from './Header';

class NewsDetail extends Component {
    render() {
        let tweet = this.props.tweet;
        //console.log(tweet);
        let replies = tweet.replies.map((reply, index) => {
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
            console.log(rep);
            return rep;
        })
        console.log(replies);
        return (
            <div>
                <Header />
                <div className="container-fluid one-news-detail">
                    <div className="row one-news-header">
                        <div className="col-md-2 img-responsive">
                            <img src={this.props.auth.avtUrl} className="img-circle" alt="" />
                        </div>
                        <div className="col-md-7 news-owner-name">
                            <h4><strong>{this.props.auth.name}</strong></h4>
                            <p>@{this.props.auth.id}</p>
                        </div>
                        <div className="col-md-3 news-status">
                            <button type="button" className="btn btn-primary">Follow</button>
                            {/* <button type="button" class="btn btn-danger">Bỏ theo dõi</button> */}
                        </div>
                    </div> {/* end one-news-header */}
                    <div className="row one-news-content">
                        <div className="text">
                            <h4>{this.props.tweet.content}</h4>
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
                            <p>{tweet.date.toLocaleString()}</p>
                        </div>
                        <ul className="stats col-md-12">
                            <li>Retweet: <strong>{tweet.retweet}</strong> </li>
                            <li>Likes: <strong>{tweet.like}</strong></li>
                        </ul>
                        <ul className="associate col-md-12">
                            <li><button><i className="far fa-comment"></i><span> {tweet.replies.length}</span></button></li>
                            <li><button><span className="glyphicon glyphicon-retweet"></span><span> {tweet.retweet}</span></button></li>
                            <li><button><span className="glyphicon glyphicon-heart-empty"></span><span> {tweet.like}</span></button></li>
                            <li><button><span className="glyphicon glyphicon-envelope"></span></button></li>
                        </ul>
                    </div> {/* end one-new-status */}
                    <div className="row one-news-reply">
                        <form className="form-inline" action="/">
                            <div className="form-group">
                                <label htmlFor="email">
                                    <img src={this.props.auth.avtUrl} className="img-circle" alt="" />
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
    return {
        auth: state.auth,
        tweet: state.auth.tweets[props.match.params.index]
    }
};

const mapDispatchToProps = (dispatch) => {
    return {

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NewsDetail)