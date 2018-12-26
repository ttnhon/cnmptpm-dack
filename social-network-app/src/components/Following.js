import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../assets/css/Following.css';
import { GetFollowing, Follow, DeleteFollowing } from '../store/actions/index';
import history from '../history';
import * as account from '../lib/account';

class Following extends Component {
  constructor(props) {
    super(props);
    this.state = {
        page: 1
    }
    window.onscroll = () => {
        //if is loading getout
        if (this.props.following) {
            //get out if end of page
            if (this.state.page >= Math.floor(this.props.following.length / 10)) {

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
    if (this.props.following === undefined || this.props.following === null) {
      const params = history.location.pathname.split("/");
      let key = params[1];
      this.props.GetFollowing(key);
    }
  }
  ClickPerson(key, value) {
    history.push('/' + key + '/' + value);
  }
  render() {
    var users = this.props.following;
    const isUser = account.checkLogged().publicKey() === this.props.auth.publicKey;
    //console.log(users);
    let media;
    if (users) {
      users = users.slice(0, (this.state.page * 10));
      media = users.map((user, index) => {
        return (
          <div key={index} className="twPc-div">
            <i className="twPc-bg twPc-block"></i>

            <div>
              <a title={user.name} href={"/"} onClick={(e) => {
                e.preventDefault();
                this.ClickPerson(user.account, "tweets");
              }} className="twPc-avatarLink">
                <img alt={user.name} src={user.img_url !== "Not Set" ? 'data:image/jpeg;base64,' + user.img_url : "/default_profile_icon.png"} className="twPc-avatarImg" />
              </a>

              <div className="twPc-divUser">
                <div className="twPc-divName">
                  <a href={"/"} onClick={(e) => {
                    e.preventDefault();
                    this.ClickPerson(user.account, "tweets");
                  }}>{user.name}</a>
                  {isUser ? <button className="btn btn-default btn-unfollow" onClick={((e) => {
                    this.props.unFollow(user.account, true);
                    this.props.DeleteFollowing(user.account);
                  })}>
                    Unfollow
                  </button> : null}
                </div>
              </div>

              {/* <div className="twPc-divStats">
                <ul className="twPc-Arrange">
                  <li className="twPc-ArrangeSizeFit">
                    <a href={"/"} onClick={(e) => {
                      e.preventDefault();
                      this.ClickPerson(user.account, "tweets");
                    }} title={user.tweets + " Tweets"}>
                      <span className="twPc-StatLabel twPc-block">Tweets</span>
                      <span className="twPc-StatValue">{user.tweets}</span>
                    </a>
                  </li>
                  <li className="twPc-ArrangeSizeFit">
                    <a href={"/"} onClick={(e) => {
                      e.preventDefault();
                      this.ClickPerson(user.account, "Following");
                    }} title={user.following + " Following"}>
                      <span className="twPc-StatLabel twPc-block">Following</span>
                      <span className="twPc-StatValue">{user.following}</span>
                    </a>
                  </li>
                  <li className="twPc-ArrangeSizeFit">
                    <a href={"/"} onClick={(e) => {
                      e.preventDefault();
                      this.ClickPerson(user.account, "Followers");
                    }} title={user.followers + " Followers"}>
                      <span className="twPc-StatLabel twPc-block">Followers</span>
                      <span className="twPc-StatValue">{user.followers}</span>
                    </a>
                  </li>
                </ul>
              </div> */}
            </div>
          </div>
        )
      });
      if(users.length <= 0) media = "emptyList";
    }
    return (
      <div>
        {users ? media !== "emptyList" ? media : null : <div className="img-loading-wrapper"><img className="img-loading" src="/loading.gif" alt="" /></div>}

      </div>
    )
  }
}

const mapStatetoProps = (state) => {
  return {
    auth: state.auth,
    following: state.following.users
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    GetFollowing: (key) => dispatch(GetFollowing(key)),
    unFollow: (key, isFollow) => dispatch(Follow(key, isFollow)),
    DeleteFollowing: (acc) => dispatch(DeleteFollowing(acc))
  }
};

export default connect(mapStatetoProps, mapDispatchToProps)(Following);