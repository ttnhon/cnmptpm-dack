import React, { Component } from 'react';
import { connect } from 'react-redux';
import { doComment, doTransaction } from '../lib/helper';
import * as account from '../lib/account';
import { AddSequence, AddInteract } from '../store/actions/index';

class Comment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }
    render() {
        //console.log(this.props);
        let inputComment;
        return (
            <div className="row one-news-reply">
                <form className="form-inline" action="/" onSubmit={(e) => {
                    e.preventDefault();
                    if (!inputComment.value.trim()) return;
                    this.setState({ isLoading: true });
                    //console.log(inputComment.value);
                    let text = inputComment.value;
                    doComment(text, this.props.hash, this.props.auth.user.sequence + 1).then(tx => {
                        const key = account.checkLogged();
                        doTransaction(tx, key.secret()).then(res => {
                            if (res) {
                                //console.log(res);
                                if (res.data.result.check_tx.log) {
                                    alert(res.data.result.check_tx.log);
                                }else{
                                    this.props.AddSequence();
                                    var interact = {
                                        account: { name: this.props.auth.user.name, img_url: this.props.auth.user.picture, account: this.props.auth.user.publicKey },
                                        content: { type: 1, text: text },
                                        hash: res.data.result.hash,
                                        object: this.props.hash
                                    };
                                    this.props.AddInteract(interact);
                                }
                            }
                            this.setState({ isLoading: false });
                        });
                    })
                    inputComment.value = "";
                }}>
                    <div className="form-group">
                        <label htmlFor="your_comment">
                            <img src={this.props.auth.user ? this.props.auth.user.picture ? ('data:image/jpeg;base64,' + this.props.auth.user.picture) : "/default_profile_icon.png" : "/loading_circle.gif"} className="img-circle" alt="" />
                        </label>
                        <input type="text" className="form-control" ref={node => inputComment = node} placeholder="Để lại bình luận của bạn" name="your_comment" />
                        <button type="submit" className="btn btn-primary form-control" name="comment_send" >Send</button>
                    </div>
                </form>
                {this.state.isLoading ? <div className="text-center"><span className="text-loading-wrapper"><img className="text-loading" src="/loading_text.gif" alt="" /></span></div> : null}
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
        AddInteract: (interact) => dispatch(AddInteract(interact))
    }
};

export default connect(mapStatetoProps, mapDispatchToProps)(Comment);