import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../assets/css/Following.css';
import { GetFollowing } from '../store/actions/index';
//import history from '../history';

class Following extends Component {
  componentWillMount() {
    // if (this.props.following === undefined || this.props.following === null) {
    //   const params = history.location.pathname.split("/");
    //   let key = params[1];
    //   this.props.GetFollowing(key);
    // }
  }
  render() {
    const users = this.props.following;
    //console.log(this.props);
    return (
      <div>
        {users && users.map((user, index) => {
          return (
            <div key={index} className="twPc-div">
              <i className="twPc-bg twPc-block"></i>

              <div>
                <a title={user.name} href={"/"+user+"/tweets"} className="twPc-avatarLink">
                  <img alt={user.name} src={user.img_url !=="Not Set" ? user.img_url: "https://pbs.twimg.com/profile_images/1068915193982271488/5-DfGVRD_400x400.jpg"} className="twPc-avatarImg" />
                </a>

                <div className="twPc-divUser">
                  <div className="twPc-divName">
                    <a href={"/"+user.account+"/tweets"}>{user.name}</a>
                  </div>
                </div>

                <div className="twPc-divStats">
                  <ul className="twPc-Arrange">
                    <li className="twPc-ArrangeSizeFit">
                      <a href={"/"+user.account+"/tweets"} title={user.tweets + " Tweets"}>
                        <span className="twPc-StatLabel twPc-block">Tweets</span>
                        <span className="twPc-StatValue">{user.tweets}</span>
                      </a>
                    </li>
                    <li className="twPc-ArrangeSizeFit">
                      <a href={"/"+user.account+"/following"} title={user.following + " Following"}>
                        <span className="twPc-StatLabel twPc-block">Following</span>
                        <span className="twPc-StatValue">{user.following}</span>
                      </a>
                    </li>
                    <li className="twPc-ArrangeSizeFit">
                      <a href={"/"+user.account+"/followers"} title={user.followers + " Followers"}>
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
    following: state.following.users
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    GetFollowing: (key) => dispatch(GetFollowing(key))
  }
};

export default connect(mapStatetoProps, mapDispatchToProps)(Following);