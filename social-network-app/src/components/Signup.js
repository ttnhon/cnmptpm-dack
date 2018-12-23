import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../assets/css/Following.css';
import { LogIn, AddSequence } from '../store/actions/index';
import history from '../history';
import { sign, encode } from '../lib/index';
import axios from 'axios';
import * as account from '../lib/account';
import { doTransaction } from '../lib/helper';


class Signup extends Component {
    constructor(props) {
        super(props)
        this.state = { isClick: false, key: null };
    }
    BtnClick(e) {
        const { Keypair } = require('stellar-base');
        const key = Keypair.random();
        //document.getElementById("btn-create").disabled = true;
        this.setState({ isClick: true, key: { public: key.publicKey(), secret: key.secret() } });
    }
    NextClick(e) {
        //console.log("next");
        const key = account.checkLogged();
        if(key === false) return;
        var tx = {
            version: 1,
            account: new Buffer(35),
            sequence: this.props.auth.user.sequence + 1,
            memo: Buffer.alloc(0),
            operation: 'create_account',
            params: {
                address: this.state.key.public
            },
            signature: new Buffer(64)
        };
        var secretKey = key.secret();
        //const txs = '0x' + encode(tx).toString('hex');
        doTransaction(tx, secretKey).then(res=>{
            if(res){
                this.props.AddSequence();
                console.log(res);
            }
        });
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
        auth: state.auth
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        logIn: (key) => dispatch(LogIn(key)),
        AddSequence: () => dispatch(AddSequence())
    }
};

export default connect(mapStatetoProps, mapDispatchToProps)(Signup);