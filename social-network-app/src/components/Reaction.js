import React, { Component } from 'react';
import { connect } from 'react-redux';
import { doReact, doTransaction } from '../lib/helper';
import * as account from '../lib/account';
import { AddSequence, AddInteract } from '../store/actions/index';

class Reaction extends Component {
    btnClick(react) {
        //console.log(react);
        doReact(react, this.props.hash, this.props.auth.user.sequence + 1).then(tx => {
            const key = account.checkLogged();
            doTransaction(tx, key.secret()).then(res => {
                if (res) {
                    //console.log(res);
                    if (res.data.result.check_tx.log) {
                        console.log(res.data.result.check_tx.log);
                    }else{
                        this.props.AddSequence();
                        var interact = {
                            account: { name: this.props.auth.user.name, img_url: this.props.auth.user.picture, account: this.props.auth.user.publicKey },
                            content: { type: 2, reaction: react },
                            hash: res.data.result.hash,
                            object: this.props.hash
                        };
                        this.props.AddInteract(interact);
                    }
                }
            });
        })
    }
    render() {
        //console.log(this.props);
        return (
            <div className="rection-tooltip">
                <div className="react-wrapper">
                    <button onClick={(() => this.btnClick(1)).bind(this)}><img src="/reaction/like.png" style={this.props.yourReact === "like" ? { opacity: 1 } : {}} className="img-responsive" alt="" /></button>
                </div>
                <div className="react-wrapper">
                    <button onClick={(() => this.btnClick(2)).bind(this)}><img src="/reaction/love.png" style={this.props.yourReact === "love" ? { opacity: 1 } : {}} className="img-responsive" alt="" /></button>
                </div>
                <div className="react-wrapper">
                    <button onClick={(() => this.btnClick(3)).bind(this)}><img src="/reaction/haha.png" style={this.props.yourReact === "haha" ? { opacity: 1 } : {}} className="img-responsive" alt="" /></button>
                </div>
                <div className="react-wrapper">
                    <button onClick={(() => this.btnClick(4)).bind(this)}><img src="/reaction/wow.png" style={this.props.yourReact === "wow" ? { opacity: 1 } : {}} className="img-responsive" alt="" /></button>
                </div>
                <div className="react-wrapper">
                    <button onClick={(() => this.btnClick(5)).bind(this)}><img src="/reaction/sad.png" style={this.props.yourReact === "sad" ? { opacity: 1 } : {}} className="img-responsive" alt="" /></button>
                </div>
                <div className="react-wrapper">
                    <button onClick={(() => this.btnClick(6)).bind(this)}><img src="/reaction/angry.png" style={this.props.yourReact === "angry" ? { opacity: 1 } : {}} className="img-responsive" alt="" /></button>
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
        AddInteract: (interact) => dispatch(AddInteract(interact))
    }
};

export default connect(mapStatetoProps, mapDispatchToProps)(Reaction);