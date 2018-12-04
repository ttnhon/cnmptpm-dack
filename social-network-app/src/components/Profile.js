import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../assets/css/profile.css';
import Header from './Header';
import ProfileFollow from './ProfileFollow';
import Tweets from './Tweets';
import Following from './Following';
import Followers from './Followers';

class Profile extends Component {

    render() {
        //console.log(this.props);
        let auth = this.props.auth;
        let value = "";
        if (this.props.match.params.value) {
            value = this.props.match.params.value;
        }
        let page = null;
        switch(value){
            case "":
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
                <ProfileFollow value={value} />
                <div className="container">
                    <div className="row">
                        <div className="col-sm-3 profile-info">
                            <div className="panel panel-default">
                                <div className="panel-body">
                                    <h2 className="profile-info-name">
                                        <a href="/">{auth ? auth.name : ""}</a>
                                    </h2>
                                    <h5 className="profile-info-acc">
                                        @<a href="/">{auth ? auth.id : ""}</a>
                                    </h5>
                                    {auth.bio !== "" ? <h5 className="profile-info-bio">
                                        <span>{auth.bio}</span>
                                    </h5> : null}
                                    {auth.location !== "" ? <div className="profile-info-date">
                                    <i className="fas fa-map-marker-alt"></i>
                                        <span> {auth.location}</span>
                                    </div> : null}
                                    {auth.website !== "" ? <h5 className="profile-info-acc">
                                        <a href="/">{auth.website}</a>
                                    </h5> : null}
                                    <div className="profile-info-date">
                                        <span className="glyphicon glyphicon-calendar" aria-hidden="true"></span>
                                        <span>{auth ? " Joined " + auth.date.toDateString() : ""}</span>
                                    </div>
                                    {auth.birthday ? <div className="profile-info-date">
                                    <i className="fas fa-birthday-cake"></i>
                                        <span>{" Born " + auth.birthday.toDateString()}</span>
                                    </div> : null}
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

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile)