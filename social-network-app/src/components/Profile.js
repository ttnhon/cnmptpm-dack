import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import '../assets/css/profile.css';
import Header from './Header';
import ProfileFollow from './ProfileFollow';
import Tweets from './Tweets';
import Following from './Following';
import Error from './Error';
import { GetProfile, SetDefaultState } from '../store/actions/index';
import history from '../history';

class Profile extends Component {
    componentWillMount() {
        let id = "";

        if (this.props.match.params.id) {
            id = this.props.match.params.id;
            this.props.GetProfile({ key: id }, 1, { balance: 0, sequence: 0, tweets: [] });
        }
    }
    render() {
        //console.log(this.props);
        let auth = this.props.auth;
        let value = "";
        if (this.props.match.params.value) {
            value = this.props.match.params.value;
        }
        //console.log(auth);
        if (auth.publicKey) {
            if (this.props.match.params.id !== auth.publicKey) {
                //console.log("get info");
                let id = this.props.match.params.id;
                this.props.SetDefaultState();
                this.props.GetProfile({ key: id }, 1, { balance: 0, sequence: 0, tweets: [], interact: [] });
            }
        }
        if (auth.user) {
            if (this.props.auth.user.isRedirect) {
                this.props.logout();
                this.props.setUserPro({ type: "SET_USER_PROFILE", payload: { isRedirect: false } });
                history.push('/error');
            }
        }
        let page = null;
        switch (value) {
            case "tweets":
                page = <Tweets />;
                break;
            case "following":
                page = <Following />;
                break;
            default:
                page = <Error error={"Page not found"} />
                break;
        }
        return (
            <div>
                <Header />
                <ProfileFollow value={value} id={auth.publicKey} />
                <div className="container">
                    <div className="row">
                        <div className="col-sm-3 profile-info">
                            <div className="profile-canopy-header">
                                <div className="container">
                                    <div className="profile-canopy-avatar">
                                        <img src={auth.picture ? auth.picture !== "Not Set" ? ('data:image/jpeg;base64,' + auth.picture) : "/default_profile_icon.png" : "/loading_circle.gif"} alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="panel panel-default">
                                <div className="panel-body">
                                    <h2 className="profile-info-name">
                                        <Link to={"/" + auth.publicKey + "/tweets"}>{auth.name ? auth.name : <span className="text-loading-wrapper"><img className="text-loading" src="/loading_text.gif" alt="" /></span>}</Link>
                                    </h2>
                                    <h5 className="profile-info-bio">
                                        <span>Balance: {auth.balance  ? (auth.balance * 1.0 / 100000000.0).toFixed(8) + " TRE" : 0  }</span>
                                    </h5>
                                    <h5 className="profile-info-bio">
                                        <span>Energy: {auth.balance ? '39757 OXY' : 0}</span>
                                    </h5>
                                    <h5 className="profile-info-bio">
                                        <span>Sequence: {auth.sequence ? auth.sequence : 0}</span>
                                    </h5>
                                    
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            {page}
                        </div>

                        <div className="col-sm-3">
                            <div className="panel panel-default panel-custom">
                                <div className="panel-heading">
                                    <h3 className="panel-title">
                                        Who to follow
                                <small><a href="/">Refresh</a> ● <a href="/">View all</a></small>
                                    </h3>
                                </div>
                                <div className="panel-body">
                                    <div className="media">
                                        <div className="media-left">
                                            <img src="http://placehold.it/32x32" alt="" className="media-object img-rounded" />
                                        </div>
                                        <div className="media-body">
                                            <h4 className="media-heading">Nome e cognome</h4>
                                            <a href="/" className="btn btn-default btn-xs">
                                                +
                                    <span className="glyphicon glyphicon-user"></span>
                                                Follow
                                </a>
                                        </div>
                                    </div>
                                    <div className="media">
                                        <div className="media-left">
                                            <img src="http://placehold.it/32x32" alt="" className="media-object img-rounded" />
                                        </div>
                                        <div className="media-body">
                                            <h4 className="media-heading">Nome e cognome</h4>
                                            <a href="/" className="btn btn-default btn-xs">
                                                +
                                    <span className="glyphicon glyphicon-user"></span>
                                                Follow
                                </a>
                                        </div>
                                    </div>
                                    <div className="media">
                                        <div className="media-left">
                                            <img src="http://placehold.it/32x32" alt="" className="media-object img-rounded" />
                                        </div>
                                        <div className="media-body">
                                            <h4 className="media-heading">Nome e cognome</h4>
                                            <a href="/" className="btn btn-default btn-xs">
                                                +
                                    <span className="glyphicon glyphicon-user"></span>
                                                Follow
                                </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="panel-footer">
                                    <a href="www.google.it">
                                        <span className="glyphicon glyphicon-user"></span>
                                        Find people you know
                            </a>
                                </div>
                            </div>
                            <div className="well well-sm">
                                <ul className="list-inline">
                                    <li>© 2015 Twitter</li>
                                    <li><a href="/">About</a></li>
                                    <li><a href="/">Help</a></li>
                                    <li><a href="/">Terms</a></li>
                                    <li><a href="/">Privacy</a></li>
                                    <li><a href="/">Cookies</a></li>
                                    <li><a href="/">Ads info</a></li>
                                    <li><a href="/">Brand</a></li>
                                    <li><a href="/">Blog</a></li>
                                    <li><a href="/">Status</a></li>
                                    <li><a href="/">Apps</a></li>
                                    <li><a href="/">Jobs</a></li>
                                    <li><a href="/">Advertise</a></li>
                                    <li><a href="/">Businesses</a></li>
                                    <li><a href="/">Media</a></li>
                                    <li><a href="/">Developers</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        GetProfile: (key, page, result) => dispatch(GetProfile(key, page, result)),
        SetDefaultState: () => dispatch(SetDefaultState())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile)