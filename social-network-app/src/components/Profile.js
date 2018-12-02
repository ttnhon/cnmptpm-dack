import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../assets/css/Profile.css';
import Header from './Header';
import ProfileFollow from './ProfileFollow';

class Profile extends Component {

    render() {
        return (
            <div>
                <Header />
                <ProfileFollow />
                <div className="container">
                    <div className="row">
                        <div className="col-sm-3 profile-info">
                        <div className="panel panel-default">
                            <div className="panel-body">
                                <h2 className="profile-info-name">
                                    <a href="#fake">Phuc</a>
                                </h2>
                                <h5 className="profile-info-acc">
                                @<a href="#fake">Phuc89286488</a>
                                </h5>
                                <div className="profile-info-date">
                                <span className="glyphicon glyphicon-calendar" aria-hidden="true"></span>
                                <span> Joined December 2018</span>
                                </div>
                            </div>
                        </div>
                        </div>
                        <div className="col-sm-6 profile-tweets">
                            <div className="panel panel-info profile-tweets-item">
                                <div className="panel-heading">
                                    <div className="media">
                                        <h4 className="media-left">
                                        Tweets
                                        </h4>
                                        <div className="media-body">
                                            <a href="#fake">Tweets & replies</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="panel-body">
                                    <div className="media" href="#toDetail">
                                        <a className="media-left" href="#fake">
                                        <img alt="" className="media-object img-circle" src="https://pbs.twimg.com/profile_images/1068915193982271488/5-DfGVRD_400x400.jpg" />
                                        </a>
                                        <div className="media-body">
                                        <div className="profile-tweets-user-header">
                                            <a className="profile-tweets-user" href="#fake">
                                                <span className="user-name">
                                                    <span>Phuc</span>
                                                </span>
                                                <span className="user-acc">
                                                <span>@Phuc89286488</span>
                                                </span>
                                                <div className="user-time">
                                                <span>14h</span>
                                                </div> 
                                            </a>
                                        </div>
                                        <p>Dolorem aspernatur rerum, iure? Culpa iste aperiam sequi, fuga, quasi rerum, eum, quo natus tenetur
                                            officia placeat.</p>
                                        <ul className="nav nav-pills nav-pills-custom">
                                            <li><a href="/"><i className="far fa-comment"></i></a></li>
                                            <li><a href="/"><span className="glyphicon glyphicon-retweet"></span></a></li>
                                            <li><a href="/"><span className="glyphicon glyphicon-heart-empty"></span> <span>1</span></a></li>
                                            <li><a href="/"><i className="far fa-chart-bar"></i></a></li>
                                        </ul>
                                        </div>
                                    </div>
                                    <div className="media" href="#toDetail">
                                        <a className="media-left" href="#fake">
                                        <img alt="" className="media-object img-circle" src="https://pbs.twimg.com/profile_images/1068915193982271488/5-DfGVRD_400x400.jpg" />
                                        </a>
                                        <div className="media-body">
                                        <div className="profile-tweets-user-header">
                                            <a className="profile-tweets-user" href="#fake">
                                                <span className="user-name">
                                                    <span>Phuc</span>
                                                </span>
                                                <span className="user-acc">
                                                <span>@Phuc89286488</span>
                                                </span>
                                                <div className="user-time">
                                                <span>14h</span>
                                                </div> 
                                            </a>
                                        </div>
                                        <p>Dolorem aspernatur rerum, iure? Culpa iste aperiam sequi, fuga, quasi rerum, eum, quo natus tenetur
                                            officia placeat.</p>
                                        <ul className="nav nav-pills nav-pills-custom">
                                            <li><a href="/"><i className="far fa-comment"></i></a></li>
                                            <li><a href="/"><span className="glyphicon glyphicon-retweet"></span></a></li>
                                            <li><a href="/"><span className="glyphicon glyphicon-heart-empty"></span> <span>1</span></a></li>
                                            <li><a href="/"><i className="far fa-chart-bar"></i></a></li>
                                        </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="panel-footer">
                                    <div className="media">
                                        <div className="media-body">
                                            <span>end</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
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