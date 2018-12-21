import React, { Component } from 'react';
import { connect } from 'react-redux';
//import '../assets/css/bootstrap4.css';
import '../assets/css/login.css';
import { LogIn } from '../store/actions/index';
import history from '../history';
import Popup from "reactjs-popup";
import Signup from './Signup';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            secretKey: '',
            open: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({ open: true });
    }
    closeModal() {
        this.setState({ open: false });
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
            this.props.logIn({ publicKey: key.publicKey(), secretKey: this.state.secretKey });
            //console.log(this.state.secretKey);
            history.push('/');
        } catch (err) {
            console.log(err);
        }
    }
    render() {
        return (
            <section className="login-block">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 login-sec">
                            <h2 className="text-center">Login Now</h2>
                            <form className="login-form" onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1" className="text-uppercase">Secret key</label>
                                    <input type="text" name='secretKey' value={this.state.secretKey} onChange={this.handleChange} className="form-control" placeholder="" />
                                </div>
                                <div className="form-submit">
                                    <button onClick={this.handleSubmit} className="btn btn-login float-right">Sign in</button>
                                </div>
                                <div className="form-signup">
                                    <a href="javascript:;" onClick={this.openModal}>Sign up</a>
                                    <Popup modal={true}
                                        closeOnDocumentClick={false}
                                        open={this.state.open}
                                        onClose={this.closeModal}>
                                        <div>
                                            <Signup />
                                            <div className="modal-close">
                                                <button className="btn btn-default btn-close-modal" onClick={this.closeModal}>Cancel</button>
                                            </div>
                                        </div>
                                    </Popup>
                                </div>
                            </form>
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