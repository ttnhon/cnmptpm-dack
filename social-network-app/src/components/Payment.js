import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../assets/css/Following.css';
import * as account from '../lib/account';
import Header from './Header'
import { postPlainText, doTransaction } from '../lib/helper';
import { SendMoney } from '../store/actions/index';


class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            amout: 0
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event) {
        let state_name = event.target.name;
        let state_value = event.target.value;

        this.setState({ [state_name]: state_value });
    }
    handleChange(event) {
        let state_name = event.target.name;
        let state_value = event.target.value;

        this.setState({ [state_name]: state_value });
    }

    handleSubmit(e) {
        e.preventDefault();
        //console.log('click nut gui');
        const user = this.props.user;
        const my_balance = user.balance;
        //chuan bi du lieu
        let public_key = user.publicKey;
        let secret_key = account.checkLogged().secret();
        //console.log(secret_key);
        let receiver_account = this.state.account;
        let sequence = user.sequence + 1;
        let amount = this.state.amount;
        let memo = '';

        if (Number(amount) <= 0 ) {
            console.log('So tien gui phai lon hon 0');
            return;
        }
        if(Number(amount) > my_balance )
        {
            console.log('So du khong du de thuc hien');
            return;
        }
        this.props.sendMoney(public_key, secret_key, receiver_account, sequence, amount);
    }

    render() {
        const user = this.props.user;
        if (user) {
                //console.log(user);
        }
        return (
            <div>
            <Header />
            <div className="container payment">
                <div className="row">
                    {/* You can make it whatever width you want. I'm making it full width
                on <= small devices and 4/12 page width on >= medium devices */}
                    <div className="col-xs-12 col-md-6 col-md-push-3">
                    {/* CREDIT CARD FORM STARTS HERE */}
                    <div className="panel panel-default credit-card-box">
                        <div className="panel-heading display-table">
                        <div className="row display-tr">
                            <h3 className="panel-title display-td">Payment Details</h3>
                            <div className="display-td">                            
                            <img className="img-responsive pull-right" src="http://i76.imgup.net/accepted_c22e0.png" />
                            </div>
                        </div>                    
                        </div>
                        <div className="panel-body">
                        <div role="form" id="payment-form">
                            <div className="row">
                            <div className="col-xs-12">
                                <div className="form-group">
                                <label htmlFor="cardNumber">CARD NUMBER</label>
                                <div className="input-group">
                                    <input type="tel" value = {this.state.account} onChange={this.handleChange} className="form-control" name="account" placeholder="Valid Card Number" autoComplete="cc-number" required autoFocus />
                                    <span className="input-group-addon"><i className="fa fa-credit-card" /></span>
                                </div>
                                </div>                            
                            </div>
                            </div>
                            <div className="row">
                            <div className="col-xs-12">
                                <div className="form-group">
                                <div className="row">
                                    <div className="col-xs-7">
                                        <label htmlFor="couponCode">AMOUNT:</label>
                                    </div>
                                    <div className="col-xs-5">
                                    <label htmlFor="payment-balance"><small>{user?'balance: '+ user.balance:'balance: '+ 0}</small></label>
                                    </div>
                                </div>
                                <input type="number" value = {this.state.amout} onChange={this.handleChange} className="form-control" name="amout" />
                                </div>
                            </div>                        
                            </div>
                            <div className="row">
                            <div className="col-xs-12">
                                <button onClick={this.handleSubmit} className="btn btn-success btn-lg btn-block">Submit</button>
                            </div>
                            </div>
                            <div className="row" style={{display: 'none'}}>
                            <div className="col-xs-12">
                                <p className="payment-errors" />
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>            
                    {/* CREDIT CARD FORM ENDS HERE */}
                    </div>            
                </div>
             </div>
            </div>
        )
    }
}

const mapStatetoProps = (state) => {
    console.log(state);
    return {
      user: state.auth.user
    }
  };
  
const mapDispatchToProps = (dispatch) => {
return {
    sendMoney: (public_key, secret_key, receiver_account, sequence, amount) => dispatch(SendMoney(public_key, secret_key, receiver_account, sequence, amount))
}
};

export default connect(mapStatetoProps, mapDispatchToProps)(Payment);