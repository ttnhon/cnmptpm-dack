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
    render() {
        let auth = this.props.auth;
        let inputPost;
        return (
            <div className="panel-heading form-post">
                <div className="media">
                    <div className="media-left">
                        <img src={auth.user ? auth.user.picture ? ('data:image/jpeg;base64,' + auth.user.picture) : "/default_profile_icon.png" : "/default_profile_icon.png"} alt="" />
                    </div>
                    <div className="media-body">
                        <div className="new-post">
                            <div className="text-input-wrapper">
                                <textarea className="form-control" ref={node => inputPost = node} placeholder="What's happening?"></textarea>
                            </div>
                            <div className="btn-send-wrapper">
                                <button type="button" className="btn btn-default" onClick={((e) => {
                                    if (!inputPost.value.trim()) return;
                                    let seq = auth.user.sequence;
                                    seq++;
                                    var acc = account.checkLogged();
                                    const secretKey = acc.secret();
                                    console.log(seq, inputPost.value, secretKey);
                                    let text = inputPost.value;
                                    postPlainText(inputPost.value, seq).then(tx => {
                                        console.log(tx);
                                        doTransaction(tx, secretKey).then(res => {
                                            console.log(res);
                                            if (res) {
                                                this.props.AddSequence();
                                                var post = {
                                                    name: auth.user.name,
                                                    account: acc.publicKey(),
                                                    height: res.result.height,
                                                    content: { type: 1, text: text }
                                                };
                                                this.props.AddNewfeed(post);
                                                this.props.AddTweet(post);
                                            }
                                        });
                                    });
                                    inputPost.value = "";
                                })}>
                                    <span className="glyphicon glyphicon-send" aria-hidden="true"></span>
                                </button>
                            </div>
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