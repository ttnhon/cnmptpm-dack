import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../assets/css/Following.css';
import { LogIn } from '../store/actions/index';
import history from '../history';
import { sign, encode, decode } from '../lib/index';
const vstruct = require('varstruct')


class Signup extends Component {
    constructor(props) {
        super(props)
        this.state = { isClick: false, key: null };
    }
    BtnClick(e) {
        const { Keypair } = require('stellar-base');
        const key = Keypair.random();
        document.getElementById("btn-create").disabled = true;
        this.setState({ isClick: true, key: { public: key.publicKey(), secret: key.secret() } });
    }
    NextClick(e) {
        //console.log("next");
        //var fetchUrl = require("fetch").fetchUrl;
        const PlainTextContent = vstruct([
            { name: 'type', type: vstruct.UInt8 },
            { name: 'text', type: vstruct.VarString(vstruct.UInt16BE) },
        ]);
        var ct = PlainTextContent.encode({ type: 1, text: "abcde" })
        var tx = {
            version: 1,
            account: new Buffer(35),
            sequence: 1,
            memo: Buffer.alloc(0),
            operation: 'post',
            params: {
                content: ct,
                keys: []
            },
            signature: new Buffer(64)
        };
        this.props.logIn({ publicKey: this.state.key.public, secretKey: this.state.key.secret });
        history.push('/');
    }
    render() {
        return (
            <div className="sign-up">
                <div className="btn-create-acc">
                    <button id="btn-create" onClick={this.BtnClick.bind(this)} className="btn btn-primary">Create account</button>
                </div>
                <div className="account" id="Acc">
                    {this.state.key ?
                        <div> <div className="key">
                            <div className="public-key">
                                <span>Public key: </span>
                                <code>{this.state.key.public}</code>
                            </div>
                            <div className="secret-key">
                                <span>Secret key: </span>
                                <code>{this.state.key.secret}</code>
                            </div>
                        </div>
                            <span>Remember to save your secret key to login!</span>
                            <div className="btn-next">
                                <button onClick={this.NextClick.bind(this)} className="btn btn-primary">Next</button>
                            </div>
                        </div>
                        : null}
                </div>
            </div>
        )
    }
}

const mapStatetoProps = (state) => {
    return {

    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        logIn: (key) => dispatch(LogIn(key))
    }
};

export default connect(mapStatetoProps, mapDispatchToProps)(Signup);