import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../assets/css/Following.css';
//import history from '../history';
//import { sign, encode } from '../lib/index';
//import axios from 'axios';
import * as account from '../lib/account';
import { postPlainText, doTransaction } from '../lib/helper';
import { AddSequence, AddNewfeed, AddTweet } from '../store/actions/index';


class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }
    render() {
        let auth = this.props.auth;
        let inputPost;
        return (
            <div className="panel-heading form-post">
                <div className="media">
                    <div className="media-left">
                        <img src={auth.user ? auth.user.picture ? ('data:image/jpeg;base64,' + auth.user.picture) : "/default_profile_icon.png" : "/loading_circle.gif"} alt="" />
                    </div>
                    <div className="media-body">
                        <div className="new-post">
                            <div className="text-input-wrapper">
                                <textarea className="form-control" ref={node => inputPost = node} placeholder="What's happening?"></textarea>
                            </div>
                            <div className="btn-send-wrapper">
                                <button type="button" className="btn btn-default" onClick={((e) => {
                                    if (!inputPost.value.trim()) return;
                                    this.setState({ isLoading: true });
                                    var date = new Date();
                                    //console.log(date);
                                    let seq = auth.user.sequence;
                                    seq++;
                                    var acc = account.checkLogged();
                                    const secretKey = acc.secret();
                                    //console.log(seq, inputPost.value, secretKey);
                                    let text = inputPost.value;
                                    postPlainText(inputPost.value, seq).then(tx => {
                                        //console.log(tx);
                                        doTransaction(tx, secretKey).then(res => {
                                            //console.log(res);
                                            if (res) {
                                                if (res.data.result.check_tx.log) {
                                                    alert(res.data.result.check_tx.log);
                                                } else {
                                                    this.props.AddSequence();
                                                    var post = {
                                                        name: auth.user.name,
                                                        img_url: auth.user.picture,
                                                        account: acc.publicKey(),
                                                        height: res.data.result.height,
                                                        content: { type: 1, text: text },
                                                        time: date
                                                    };
                                                    this.props.AddNewfeed(post);
                                                    this.props.AddTweet(post);
                                                }
                                            }
                                            this.setState({ isLoading: false });
                                        });
                                    });
                                    inputPost.value = "";
                                })}>
                                    <span className="glyphicon glyphicon-send" aria-hidden="true"></span>
                                </button>
                            </div>
                            {this.state.isLoading ? <span className="text-loading-wrapper"><img className="text-loading" src="/loading_text.gif" alt="" /></span> : null}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStatetoProps = (state) => {
    return {
        auth: state.auth
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        AddSequence: () => dispatch(AddSequence()),
        AddNewfeed: (post) => dispatch(AddNewfeed(post)),
        AddTweet: (post) => dispatch(AddTweet(post))
    }
};

export default connect(mapStatetoProps, mapDispatchToProps)(Post);