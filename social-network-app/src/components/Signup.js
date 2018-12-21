import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../assets/css/Following.css';
import { LogIn } from '../store/actions/index';
import history from '../history';
import { sign, encode, decode } from '../lib/index';
import axios from 'axios';


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
        var tx = {
            version: 1,
            account: new Buffer(35),
            sequence: 1,
            memo: Buffer.alloc(0),
            operation: 'create_account',
            params: {
                address: this.state.key.public
            },
            signature: new Buffer(64)
        };
        sign(tx, 'SACE2PK3T76STIS44EBKE3Y4E7YOY7IT6HBE6JFXVIVB65X7HCJ2IR45');
        //console.log(tx);
        const txs = '0x'+ encode(tx).toString('hex');

        axios.get('https://komodo.forest.network/broadcast_tx_commit?tx=' + txs)
        .then(res => {
            //console.log(res);
        });
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