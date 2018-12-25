import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../assets/css/Following.css';
import * as account from '../lib/account';
import Header from './Header'
import '../assets/css/payment_history.css'
import { postPlainText, doTransaction } from '../lib/helper';
import { SendMoney } from '../store/actions/index';


class PaymentHistory extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        const user = this.props.user;
        if (user) {
                console.log(user);
        }
        const payments = [];
        return (
            <div>
                <Header></Header>
                <div className="container payment-history">
                    <h2>Payment History</h2>
                    <hr></hr>
                    <div className="row">
                        <div className="col-xs-12 col-md-12">
                            {/* one history */}
                            {payments? 
                                payments.map((one_payment) => (
                                    <div>
                                    <article className="media">
                                        <figure className="media-left">
                                            <p className="image is-64x64"><img src=""></img></p>
                                        </figure>
                                        <div className="media-content">
                                            <div className="content">
                                                <p>
                                                    <strong>
                                                        <a href={"/"+one_payment.sender.account+"/tweets"} className="">
                                                    <span>{one_payment.sender.name}</span></a>
                                                    </strong>
                                                    {/* <small>
                                                        <a href="/transactions/FAA9E272DE2388343803E0A77D64583817E877C66ADADBEAF5012A39085F1A3B" className="has-text-grey"> a minute ago</a>
                                                    </small> */}
                                                    <br></br>
                                                    <span>sent <strong>{(one_payment.amount/100000000).toFixed(9)+"  TRE"}</strong> to 
                                                    <a href={"/"+one_payment.receiver.account+"/tweets"} className=""><span>{one_payment.receiver.name}</span>
                                                    </a>
                                                    </span>
                                                </p>
                                        </div>
                                        </div>
                                    </article>
                                    <hr></hr>
                                    </div>
                                ))
                                :
                                <h2>Nothing to show</h2>
                            }
                        </div>          
                    </div>
                </div>
            </div>
        )
    }
}

const mapStatetoProps = (state) => {
    return {
      user: state.auth.user
    }
  };
  
const mapDispatchToProps = (dispatch) => {
// return {
//     sendMoney: (public_key, secret_key, receiver_account, sequence, amount) => dispatch(SendMoney(public_key, secret_key, receiver_account, sequence, amount))
// }
};

export default connect(mapStatetoProps, mapDispatchToProps)(PaymentHistory);