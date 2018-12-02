import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../assets/css/Following.css';
import Header from './Header';
import ProfileFollow from './ProfileFollow';

class Followers extends Component {
  render() {
    const users = this.props.followers;
    return (
      <div>
        <Header />
        <ProfileFollow activeId="2" />
        { users && users.map((user,index) => {
          return (
            <div key={index} className="twPc-div">
            <a className="twPc-bg twPc-block"></a>

          <div>
            <a title={user.name} href={user.url} className="twPc-avatarLink">
              <img alt={user.name} src={user.avtUrl} className="twPc-avatarImg" />
            </a>

            <div className="twPc-divUser">
              <div className="twPc-divName">
                <a href={user.url}>{user.name}</a>
              </div>
              <span>
                <a href={user.url}>@<span>{user.id} </span></a>
                Follow you
              </span>
            </div>

            <div className="twPc-divStats">
              <ul className="twPc-Arrange">
                <li className="twPc-ArrangeSizeFit">
                  <a href={user.url} title={user.tweets+" Tweets"}>
                    <span className="twPc-StatLabel twPc-block">Tweets</span>
                    <span className="twPc-StatValue">{user.tweets}</span>
                  </a>
                </li>
                <li className="twPc-ArrangeSizeFit">
                  <a href="#" title={user.following+" Following"}>
                    <span className="twPc-StatLabel twPc-block">Following</span>
                    <span className="twPc-StatValue">{user.following}</span>
                  </a>
                </li>
                <li className="twPc-ArrangeSizeFit">
                  <a href="#" title={user.followers+" Followers"}>
                    <span className="twPc-StatLabel twPc-block">Followers</span>
                    <span className="twPc-StatValue">{user.followers}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
          )
        })}
      </div>
    )
  }
}

const mapStatetoProps = (state) => {
  return {
    followers: state.followers.users
  }
};

export default connect(mapStatetoProps)(Followers);