import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
//import '../assets/css/bootstrap4.css';
import '../assets/css/login.css';
import { LogIn } from '../store/actions/index';
import history from '../history';
//import Popup from "reactjs-popup";
//import Signup from './Signup';
import server from '../lib/server';
import * as account from '../lib/account';
import axios from 'axios';
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            secretKey: '',
            error: undefined
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        let state_name = event.target.name;
        let state_value = event.target.value;

        this.setState({ [state_name]: state_value });
    }
    handleSubmit(e) {
        e.preventDefault();
        if (this.state.secretKey === undefined || this.state.secretKey === null || this.state.secretKey === '') return;
        const { Keypair } = require('stellar-base');
        try {
            const key = Keypair.fromSecret(this.state.secretKey);
            //console.log(key.publicKey());
            axios.get('https://' + server + '.forest.network/tx_search?query="account=\'' + key.publicKey() + '\'"')
                .then(async res => {
                    if (res.data.result.total_count <= 0) {
                        alert('Tài khoản không tồn tại');
                    }
                    else {
                        this.props.logIn({ publicKey: key.publicKey(), secretKey: this.state.secretKey });

                        account.login(this.state.secretKey);
                        history.push("/" + key.publicKey() + "/tweets");
                    }
                });
        } catch (err) {
            this.setState({ error: "Invalid secret key" });
            console.log(err);
        }
    }
    render() {
        const key = account.checkLogged();
        if (key !== false) {
            return <Redirect to={"/" + key.publicKey() + "/tweets"} />
        }
        return (
            <section className="login-block">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 login-sec">
                            <h2 className="text-center">Login Now</h2>
                            <form autoComplete="off" className="login-form" onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1" className="text-uppercase">Secret key</label>
                                    <input type="text" name='secretKey' value={this.state.secretKey} onChange={this.handleChange} className="form-control" placeholder="" />
                                </div>
                                <div className="form-submit text-center">
                                    <button onClick={this.handleSubmit} className="btn btn-login float-right">Sign in</button>
                                </div>
                            </form>
                            {this.state.error ? <div className="alert alert-danger fade in  error-log">
                                <strong>{this.state.error ? this.state.error : null}</strong>
                            </div> : null}
                            <div className="copy-text">Created with <i className="fa fa-heart" /> by <a href="/">N2P</a></div>
                        </div>
                        <div className="col-md-6 banner-sec">
                            <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                                <ol className="carousel-indicators">
                                    <li data-target="#carouselExampleIndicators" data-slide-to={0} className="active" />
                                    <li data-target="#carouselExampleIndicators" data-slide-to={1} />
                                    <li data-target="#carouselExampleIndicators" data-slide-to={2} />
                                </ol>
                                <div className="carousel-inner" role="listbox">
                                    <div className="carousel-item active">
                                        <img className="d-block img-fluid" src="https://static.pexels.com/photos/33972/pexels-photo.jpg" alt="First slide" />
                                        <div className="carousel-caption d-none d-md-block">
                                            <div className="banner-text">
                                                <h2>This is Heaven</h2>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="carousel-item">
                            <img className="d-block img-fluid" src="https://images.pexels.com/photos/7097/people-coffee-tea-meeting.jpg" alt="First slide" />
                            <div className="carousel-caption d-none d-md-block">
                                <div className="banner-text">
                                <h2>This is Heaven</h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</p>
                                </div>	
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block img-fluid" src="https://images.pexels.com/photos/872957/pexels-photo-872957.jpeg" alt="First slide" />
                            <div className="carousel-caption d-none d-md-block">
                                <div className="banner-text">
                                <h2>This is Heaven</h2>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</p>
                                </div>	
                            </div>
                        </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

const mapStatetoProps = (state) => {
    return {
        following: state.following.users
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        logIn: (key) => dispatch(LogIn(key))
    }
};

export default connect(mapStatetoProps, mapDispatchToProps)(Login);