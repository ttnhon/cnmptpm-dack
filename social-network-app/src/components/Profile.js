import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../assets/css/profile.css';
import Header from './Header';
import ProfileFollow from './ProfileFollow';
import Tweets from './Tweets';
import Following from './Following';
import Followers from './Followers';
import { GetProfile } from '../store/actions/index';

class Profile extends Component {
    componentWillMount() {
        let id = "";

        if (this.props.match.params.id) {
            id = this.props.match.params.id;
            this.props.GetProfile(id);
        }
    }
    render() {
        //console.log(this.props);
        let auth = this.props.auth === {} ? undefined : this.props.auth;
        let value = "";
        let id = auth.publicKey;
        if (this.props.match.params.value) {
            value = this.props.match.params.value;
        }
        // if (this.props.match.params.id) {
        //     id = this.props.match.params.id;
        //     this.props.GetProfile(id);
        // }
        let page = null;
        switch (value) {
            case "tweets":
                page = <Tweets />;
                break;
            case "following":
                page = <Following />;
                break;
            case "followers":
                page = <Followers />;
                break;
            default:
                break;
        }
        return (
            <div>
                <Header />
                <ProfileFollow value={value} id={id} />
                <div className="container">
                    <div className="row">
                        <div className="col-sm-3 profile-info">
                            <div className="profile-canopy-header">
                                <div className="container">
                                    <div className="profile-canopy-avatar">
                                        <img src={this.props.auth ? this.props.auth.picture ? ('data:image/jpeg;base64,' + this.props.auth.picture) : "/default_profile_icon.png" : "/default_profile_icon.png"} alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className="panel panel-default">
                                <div className="panel-body">
                                    <h2 className="profile-info-name">
                                        <a href={"/"+id+"/tweets"}>{auth.name ? auth.name : "No name"}</a>
                                    </h2>
                                    <h5 className="profile-info-bio">
                                        <span>Balance: {auth.balance}</span>
                                    </h5>
                                    <h5 className="profile-info-bio">
                                        <span>Sequence: {auth.sequence}</span>
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
        GetProfile: (key) => dispatch(GetProfile(key))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile)