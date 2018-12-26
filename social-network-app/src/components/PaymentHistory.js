import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../assets/css/Following.css';
import { GetPaymentHistory } from '../store/actions/index';
import * as account from '../lib/account';
import Header from './Header'
import '../assets/css/payment_history.css'


class PaymentHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1
        }
        window.onscroll = () => {
            //if is loading getout
            if (this.props.payments) {
                //get out if end of page
                if (this.state.page >= Math.floor(this.props.payments.length / 10)) {
    
                    return;
                }
                if (
                    window.innerHeight + document.documentElement.scrollTop
                    === document.documentElement.offsetHeight
                ) {
                    this.setState({ page: this.state.page + 1 });
                }
            }
        }
    }
    componentWillMount() {
        //console.log(this.props.payments)
        if (this.props.payments === undefined || this.props.payments === null) {
            let key = account.checkLogged().publicKey();
            this.props.getPaymentHistory(key);
        }
    }
    render() {
        var payments = this.props.payments;
        if(payments){
            payments = payments.slice(0, (this.state.page * 10));
        }
        //console.log(payments);
        
        return (
            <div>
                <Header></Header>
                <div className="container payment-history">
                    <h2>Payment History</h2>
                    <hr></hr>
                    <div className="row">
                        <div className="col-xs-12 col-md-12">
                            {/* one history */}
                            {payments ? payments.length > 0 ?
                                payments.map((one_payment, index) => (
                                    <div key={index}>
                                    <article className="media">
                                        <figure className="media-left">
                                            <p className="image is-64x64"><img src={one_payment.sender.img_url ? one_payment.sender.img_url !== "Not Set" ?  'data:image/jpeg;base64,' + one_payment.sender.img_url : "/default_profile_icon.png" : "/loading_circle.gif"}></img></p>
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
                                                    <span>sent <strong>{(one_payment.amount/100000000).toFixed(8)+"  TRE  "}</strong> <span>to </span>
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
                                : <div className="img-loading-wrapper"><img className="img-loading" src="/loading.gif" alt="" /></div>
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
        payments: state.payments.histories
    }
  };
  
const mapDispatchToProps = (dispatch) => {
return {
    getPaymentHistory: (key) => dispatch(GetPaymentHistory(key))
}
};

export default connect(mapStatetoProps, mapDispatchToProps)(PaymentHistory);